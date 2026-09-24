import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Thin wrapper over Paystack's REST API (https://paystack.com/docs/api/) —
 * just the three calls the checkout flow needs: start a transaction,
 * verify one server-side, and check a webhook's signature. No SDK
 * dependency; Paystack's API is simple enough that a fetch wrapper is
 * less surface area than pulling in a client library for three endpoints.
 *
 * PAYSTACK_SECRET_KEY is required for all of these — same fail-closed
 * pattern as lib/resend.ts's RESEND_API_KEY: a clear thrown error when
 * it's missing, not a silent no-op or a fabricated success.
 */

export class PaystackNotConfiguredError extends Error {
  constructor() {
    super("PAYSTACK_SECRET_KEY is not set — payments are not configured.");
    this.name = "PaystackNotConfiguredError";
  }
}

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new PaystackNotConfiguredError();
  return key;
}

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export type InitializeTransactionInput = {
  email: string;
  /** Naira, not kobo — converted to kobo internally, since Paystack's API takes the smallest currency unit. */
  amountNaira: number;
  currency: "NGN";
  callbackUrl: string;
  /** Arbitrary data echoed back verbatim on the webhook payload's `data.metadata` — this is how order details (book, delivery address) survive the round trip to Paystack's hosted page and back. */
  metadata: Record<string, unknown>;
};

export type InitializeTransactionResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

/** Starts a transaction and returns the URL to redirect the customer to (Paystack's own hosted payment page — we never collect card details ourselves). */
export async function initializeTransaction(input: InitializeTransactionInput): Promise<InitializeTransactionResult> {
  const secretKey = getSecretKey();

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amountNaira * 100),
      currency: input.currency,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const json = await response.json();
  if (!response.ok || !json.status) {
    throw new Error(`Paystack initialize failed: ${json.message ?? response.statusText}`);
  }

  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
    reference: json.data.reference,
  };
}

export type VerifyTransactionResult = {
  status: string; // "success" | "failed" | "abandoned" | ...
  reference: string;
  /** Kobo, as Paystack returns it. */
  amount: number;
  currency: string;
  customerEmail: string;
  metadata: Record<string, unknown> | null;
};

/**
 * Paystack does not consistently echo `metadata` back in the shape it
 * was sent: depending on how the transaction was created, it comes back
 * either as the object we passed at initialize or as a JSON *string* of
 * that object. Reading `.bookId` straight off a string silently yields
 * `undefined`, which in the webhook means "no matching book" — i.e. a
 * customer who has already paid gets quietly dropped with nobody
 * notified. Normalizing both shapes here is what stops that.
 *
 * Exported for direct testing — this is exactly the kind of quirk that
 * should have a case pinned to it rather than being trusted by eye.
 */
export function normalizeMetadata(raw: unknown): Record<string, unknown> | null {
  if (raw === null || raw === undefined) return null;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }

  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }

  return null;
}

/** Re-checks a transaction directly against Paystack's own record — the webhook payload alone is trusted only after its signature is verified, but this is an extra, independent confirmation before any fulfillment email goes out. */
export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const secretKey = getSecretKey();

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  const json = await response.json();
  if (!response.ok || !json.status) {
    throw new Error(`Paystack verify failed: ${json.message ?? response.statusText}`);
  }

  const data = json.data;
  return {
    status: data.status,
    reference: data.reference,
    amount: data.amount,
    currency: data.currency,
    customerEmail: data.customer?.email ?? "",
    metadata: normalizeMetadata(data.metadata),
  };
}

type PaystackCustomerLookup = {
  id: number;
};

/**
 * Finds recent successful transactions for an email address. This is a
 * recovery path for buyers whose charge succeeded while the webhook was
 * unavailable. Every returned reference must still go through
 * `verifyTransaction` before the site grants access.
 */
export async function findRecentSuccessfulTransactionReferences(
  email: string,
  limit = 5,
): Promise<string[]> {
  const secretKey = getSecretKey();
  const headers = { Authorization: `Bearer ${secretKey}` };

  const customerResponse = await fetch(
    `${PAYSTACK_BASE_URL}/customer/${encodeURIComponent(email)}`,
    { headers },
  );
  const customerJson = await customerResponse.json().catch(() => null);

  // A customer who has never paid through this Paystack integration is a
  // normal result for the passwordless form, not an application error.
  if (customerResponse.status === 404) return [];
  if (!customerResponse.ok) {
    throw new Error(`Paystack customer lookup failed: ${customerJson?.message ?? customerResponse.statusText}`);
  }
  if (!customerJson?.status) return [];

  const customer = customerJson.data as PaystackCustomerLookup | undefined;
  if (!Number.isFinite(customer?.id)) return [];

  const query = new URLSearchParams({
    customer: String(customer!.id),
    status: "success",
    perPage: "50",
    page: "1",
  });
  const transactionsResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction?${query}`, { headers });
  const transactionsJson = await transactionsResponse.json().catch(() => null);
  if (!transactionsResponse.ok || !transactionsJson?.status) {
    throw new Error(
      `Paystack transaction lookup failed: ${transactionsJson?.message ?? transactionsResponse.statusText}`,
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const transactions: Record<string, unknown>[] = Array.isArray(transactionsJson.data)
    ? (transactionsJson.data as Record<string, unknown>[])
    : [];

  const candidateReferences: string[] = transactions
    .filter((transaction: Record<string, unknown>) => {
      const customerEmail =
        typeof transaction.customer === "object" && transaction.customer !== null
          ? String((transaction.customer as Record<string, unknown>).email ?? "").trim().toLowerCase()
          : "";
      return transaction.status === "success" && customerEmail === normalizedEmail;
    })
    .map((transaction: Record<string, unknown>) => String(transaction.reference ?? ""))
    .filter(Boolean)
    .slice(0, Math.max(1, Math.min(limit, 10)));

  // List responses can omit or abbreviate metadata. Verify each small,
  // bounded candidate set so recovery never depends on the list shape and
  // never treats a paperback transaction as an e-book purchase.
  const verifiedCandidates = await Promise.allSettled(
    candidateReferences.map((reference) => verifyTransaction(reference)),
  );

  return verifiedCandidates
    .filter(
      (candidate): candidate is PromiseFulfilledResult<VerifyTransactionResult> =>
        candidate.status === "fulfilled" &&
        candidate.value.status === "success" &&
        candidate.value.customerEmail.trim().toLowerCase() === normalizedEmail &&
        candidate.value.metadata?.format === "ebook",
    )
    .map((candidate) => candidate.value.reference);
}

/**
 * Paystack signs every webhook body with HMAC-SHA512 over the raw
 * request bytes, using the same secret key — the `x-paystack-signature`
 * header must match before anything in the payload is trusted. Must be
 * called with the exact raw body string/bytes as received (before any
 * JSON.parse), or the computed digest won't match.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const secretKey = getSecretKey();

  const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signatureHeader, "utf8");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}
