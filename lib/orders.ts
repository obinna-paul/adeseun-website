import { Redis } from "@upstash/redis";

/**
 * A minimal order log, backed by Upstash Redis (not the deprecated
 * `@vercel/kv` package — Vercel's own KV product now redirects to an
 * Upstash Redis integration under Marketplace, so this talks to Upstash
 * directly). Two jobs:
 *  1. Idempotency — if Paystack retries a webhook delivery (it does, on
 *     a slow or failed response), the same order must not fire its three
 *     emails twice.
 *  2. A real place to look up past orders, instead of only three inboxes.
 *
 * Reads either `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` (what
 * Upstash's own dashboard calls them) or `KV_REST_API_URL`/
 * `KV_REST_API_TOKEN` (what Vercel's Storage tab still labels them,
 * depending on which flow provisions the integration) — whichever pair
 * is actually present. Confirm which one your Vercel project sets once
 * it's provisioned; this checks both so it works either way.
 *
 * Deliberately degrades rather than failing closed: by the time
 * anything here runs, the customer has already paid. If Redis isn't
 * configured yet or a call errors, every function below logs loudly and
 * returns as if there's no record — callers (the webhook) fall back to
 * sending the fulfillment emails without a dedupe check, which risks an
 * occasional duplicate email on a webhook retry. That's the accepted
 * trade-off (see the checkout planning discussion): losing a paid
 * order's fulfillment emails entirely is worse than sending them twice.
 */

export type OrderStatus = "pending" | "fulfilled";

/** Per-recipient outcome of the three order emails, so a partial failure is visible after the fact instead of only in a log line that scrolls away. */
export type EmailOutcome = "sent" | "failed" | "skipped";

export type OrderRecord = {
  reference: string;
  bookId: string;
  bookTitle: string;
  priceNaira: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    line1: string;
    city: string;
    state: string;
  };
  status: OrderStatus;
  createdAt: string;
  fulfilledAt?: string;
  emailStatus?: {
    customer: EmailOutcome;
    owner: EmailOutcome;
    printer: EmailOutcome;
  };
};

const ORDER_TTL_SECONDS = 60 * 60 * 24 * 180; // 180 days — an order log, not permanent archival storage

/**
 * How long a fulfillment claim is held. Long enough to cover a
 * fulfillment run (three email sends) plus any near-simultaneous retry,
 * short enough that a crashed run's claim expires and a later retry can
 * legitimately pick the order back up rather than being locked out for
 * the order's whole lifetime.
 */
const CLAIM_TTL_SECONDS = 60 * 10;

let redis: Redis | null | undefined; // undefined = not checked yet, null = not configured

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.error("Redis is not configured (no UPSTASH_REDIS_REST_URL/KV_REST_API_URL env vars) — order log and webhook idempotency are disabled.");
    redis = null;
    return redis;
  }

  redis = new Redis({ url, token });
  return redis;
}

function orderKey(reference: string): string {
  return `order:${reference}`;
}

function claimKey(reference: string): string {
  return `order-claim:${reference}`;
}

/**
 * Atomically claims an order for fulfillment. `true` means this caller
 * won the claim and should send the emails; `false` means another
 * delivery of the same webhook is already doing it and this one should
 * stand down.
 *
 * This exists because the `status === "fulfilled"` check alone is
 * check-then-act: Paystack retries deliveries and can overlap them, so
 * two concurrent runs could both read "not fulfilled yet" and both send
 * the whole set — which for the printer means two copies printed for
 * one paid order. Redis `SET NX` makes winning the claim a single
 * atomic operation, so exactly one run proceeds.
 *
 * Returns `true` when Redis is unconfigured or erroring, for the same
 * reason the rest of this module degrades rather than failing closed:
 * the customer has already paid, and a possible duplicate is better
 * than dropping their order entirely.
 */
export async function claimOrderForFulfillment(reference: string): Promise<boolean> {
  const client = getRedis();
  if (!client) return true;

  try {
    const result = await client.set(claimKey(reference), new Date().toISOString(), {
      nx: true,
      ex: CLAIM_TTL_SECONDS,
    });
    return result === "OK";
  } catch (err) {
    console.error("Failed to claim order in Redis (proceeding anyway):", err);
    return true;
  }
}

/** Best-effort — called right after Paystack initialize, before the customer has paid. Never throws; a failed write here shouldn't block checkout. */
export async function createPendingOrder(order: Omit<OrderRecord, "status" | "createdAt">): Promise<void> {
  const client = getRedis();
  if (!client) return;

  const record: OrderRecord = { ...order, status: "pending", createdAt: new Date().toISOString() };
  try {
    await client.set(orderKey(order.reference), JSON.stringify(record), { ex: ORDER_TTL_SECONDS });
  } catch (err) {
    console.error("Failed to write pending order to Redis:", err);
  }
}

/** Returns null if unconfigured, not found, or on error — callers must treat null as "no dedupe info available," not "definitely a new order." */
export async function getOrder(reference: string): Promise<OrderRecord | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const raw = await client.get<string | OrderRecord>(orderKey(reference));
    if (!raw) return null;
    return typeof raw === "string" ? (JSON.parse(raw) as OrderRecord) : raw;
  } catch (err) {
    console.error("Failed to read order from Redis:", err);
    return null;
  }
}

/** Best-effort — called after the three fulfillment emails have been attempted. Never throws. */
export async function markOrderFulfilled(
  reference: string,
  order: Omit<OrderRecord, "status" | "createdAt">,
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  const existing = await getOrder(reference);
  const record: OrderRecord = {
    ...order,
    status: "fulfilled",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    fulfilledAt: new Date().toISOString(),
  };
  try {
    await client.set(orderKey(reference), JSON.stringify(record), { ex: ORDER_TTL_SECONDS });
  } catch (err) {
    console.error("Failed to mark order fulfilled in Redis:", err);
  }
}
