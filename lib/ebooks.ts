import { createHash, randomBytes } from "node:crypto";
import { getRedis, requireRedis } from "@/lib/redis";
import type {
  EbookCatalogItem,
  EbookEntitlement,
  EbookPublication,
  ReaderAccessGrant,
  ReadingProgress,
} from "@/lib/ebook-types";

const ACCESS_LINK_TTL_SECONDS = 60 * 15;
const PROGRESS_TTL_SECONDS = 60 * 60 * 24 * 365 * 5;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function emailHash(email: string): string {
  return createHash("sha256").update(normalizeEmail(email)).digest("hex");
}

function parseRecord<T>(value: T | string | null): T | null {
  if (!value) return null;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function publicationKey(bookId: string): string {
  return `ebook:publication:${bookId}`;
}

function entitlementKey(email: string, bookId: string): string {
  return `ebook:entitlement:${emailHash(email)}:${bookId}`;
}

function entitlementSetKey(email: string): string {
  return `ebook:entitlements:${emailHash(email)}`;
}

function progressKey(email: string, bookId: string): string {
  return `ebook:progress:${emailHash(email)}:${bookId}`;
}

function accessKey(token: string): string {
  const digest = createHash("sha256").update(token).digest("hex");
  return `ebook:access:${digest}`;
}

export async function getEbookPublication(bookId: string): Promise<EbookPublication | null> {
  const client = getRedis();
  if (!client) return null;
  return parseRecord(await client.get<EbookPublication | string>(publicationKey(bookId)));
}

export async function saveEbookPublication(publication: EbookPublication): Promise<void> {
  const client = requireRedis("E-book publishing");
  await client.set(publicationKey(publication.bookId), JSON.stringify(publication));
}

export async function getPublishedEbookCatalog(bookIds: string[]): Promise<Record<string, EbookCatalogItem>> {
  const client = getRedis();
  if (!client || bookIds.length === 0) return {};

  const raw = await client.mget<(EbookPublication | string | null)[]>(...bookIds.map(publicationKey));
  const catalog: Record<string, EbookCatalogItem> = {};

  bookIds.forEach((bookId, index) => {
    const publication = parseRecord<EbookPublication>(raw[index] ?? null);
    // A manifest is the live edition. Keep it available while a replacement
    // PDF uploads or processes, then atomically switch to the new manifest.
    if (publication?.manifestKey) {
      catalog[bookId] = { bookId, priceNaira: publication.priceNaira, status: "published" };
    }
  });

  return catalog;
}

export async function grantEbookEntitlement(entitlement: EbookEntitlement): Promise<void> {
  const client = requireRedis("E-book fulfillment");
  const normalized: EbookEntitlement = {
    ...entitlement,
    customerEmail: normalizeEmail(entitlement.customerEmail),
  };

  await Promise.all([
    client.set(entitlementKey(normalized.customerEmail, normalized.bookId), JSON.stringify(normalized)),
    client.sadd(entitlementSetKey(normalized.customerEmail), normalized.bookId),
  ]);
}

export async function getEbookEntitlement(email: string, bookId: string): Promise<EbookEntitlement | null> {
  const client = requireRedis("Reader access");
  return parseRecord(await client.get<EbookEntitlement | string>(entitlementKey(email, bookId)));
}

export async function getReaderBookIds(email: string): Promise<string[]> {
  const client = requireRedis("Reader access");
  return client.smembers<string[]>(entitlementSetKey(email));
}

export async function createReaderAccessToken(grant: ReaderAccessGrant): Promise<string> {
  const client = requireRedis("Reader access links");
  const token = randomBytes(32).toString("base64url");
  await client.set(
    accessKey(token),
    JSON.stringify({ ...grant, email: normalizeEmail(grant.email) }),
    { ex: ACCESS_LINK_TTL_SECONDS },
  );
  return token;
}

export async function consumeReaderAccessToken(token: string): Promise<ReaderAccessGrant | null> {
  const client = requireRedis("Reader access links");
  return parseRecord(await client.getdel<ReaderAccessGrant | string>(accessKey(token)));
}

export async function canSendReaderAccessEmail(email: string): Promise<boolean> {
  const client = requireRedis("Reader access links");
  const result = await client.set(`ebook:access-rate:${emailHash(email)}`, new Date().toISOString(), {
    nx: true,
    ex: 60,
  });
  return result === "OK";
}

export async function getReadingProgress(email: string, bookId: string): Promise<ReadingProgress | null> {
  const client = requireRedis("Reading progress");
  return parseRecord(await client.get<ReadingProgress | string>(progressKey(email, bookId)));
}

export async function saveReadingProgress(email: string, bookId: string, page: number): Promise<void> {
  const client = requireRedis("Reading progress");
  const progress: ReadingProgress = { bookId, page, updatedAt: new Date().toISOString() };
  await client.set(progressKey(email, bookId), JSON.stringify(progress), { ex: PROGRESS_TTL_SECONDS });
}

export async function checkReaderPageRateLimit(email: string): Promise<boolean> {
  const client = requireRedis("Protected page delivery");
  const bucket = Math.floor(Date.now() / 60_000);
  const key = `ebook:page-rate:${emailHash(email)}:${bucket}`;
  const count = await client.incr(key);
  if (count === 1) await client.expire(key, 90);
  return count <= 120;
}

export function maskReaderEmail(email: string): string {
  const [local = "reader", domain = ""] = normalizeEmail(email).split("@");
  const visible = local.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(3, Math.min(8, local.length - 1)))}@${domain}`;
}
