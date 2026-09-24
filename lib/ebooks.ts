import { createHash, randomBytes } from "node:crypto";
import { getRedis, requireRedis } from "@/lib/redis";
import type {
  EbookCatalogItem,
  EbookEntitlement,
  EbookPublication,
  ReaderAccessGrant,
  ReadingProgress,
} from "@/lib/ebook-types";

/** Private reader links stay usable for three days and are consumed on first use. */
export const READER_ACCESS_LINK_TTL_SECONDS = 60 * 60 * 24 * 3;
const PROGRESS_TTL_SECONDS = 60 * 60 * 24 * 365 * 5;
const PUBLICATION_INDEX_KEY = "ebook:publications";

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

function accessRateKey(email: string): string {
  return `ebook:access-rate:${emailHash(email)}`;
}

export async function getEbookPublication(bookId: string): Promise<EbookPublication | null> {
  const client = getRedis();
  if (!client) return null;
  return parseRecord(await client.get<EbookPublication | string>(publicationKey(bookId)));
}

export async function saveEbookPublication(publication: EbookPublication): Promise<void> {
  const client = requireRedis("E-book publishing");
  await Promise.all([
    client.set(publicationKey(publication.bookId), JSON.stringify(publication)),
    client.sadd(PUBLICATION_INDEX_KEY, publication.bookId),
  ]);
}

export async function getEbookPublications(bookIds: string[] = []): Promise<Record<string, EbookPublication>> {
  const client = getRedis();
  if (!client) return {};

  const indexedIds = await client.smembers<string[]>(PUBLICATION_INDEX_KEY);
  const ids = Array.from(new Set([...bookIds, ...indexedIds])).filter(Boolean);
  if (ids.length === 0) return {};

  const raw = await client.mget<(EbookPublication | string | null)[]>(...ids.map(publicationKey));
  const publications: Record<string, EbookPublication> = {};

  ids.forEach((bookId, index) => {
    const publication = parseRecord<EbookPublication>(raw[index] ?? null);
    if (publication) publications[bookId] = publication;
  });

  return publications;
}

export async function getPublishedEbookCatalog(bookIds: string[] = []): Promise<Record<string, EbookCatalogItem>> {
  const publications = await getEbookPublications(bookIds);
  const catalog: Record<string, EbookCatalogItem> = {};

  Object.entries(publications).forEach(([bookId, publication]) => {
    // A manifest is the live edition. Keep it available while a replacement
    // PDF uploads or processes, then atomically switch to the new manifest.
    if (publication.manifestKey) {
      catalog[bookId] = {
        bookId,
        title: publication.title,
        description: publication.description,
        standalone: publication.standalone,
        priceNaira: publication.priceNaira,
        pageCount: publication.pageCount,
        status: "published",
      };
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
    { ex: READER_ACCESS_LINK_TTL_SECONDS },
  );
  return token;
}

export async function consumeReaderAccessToken(token: string): Promise<ReaderAccessGrant | null> {
  const client = requireRedis("Reader access links");
  return parseRecord(await client.getdel<ReaderAccessGrant | string>(accessKey(token)));
}

export async function canSendReaderAccessEmail(email: string): Promise<boolean> {
  const client = requireRedis("Reader access links");
  const result = await client.set(accessRateKey(email), new Date().toISOString(), {
    nx: true,
    ex: 60,
  });
  return result === "OK";
}

/** Let a buyer retry immediately when the email provider rejected a send. */
export async function releaseReaderAccessEmailRateLimit(email: string): Promise<void> {
  const client = requireRedis("Reader access links");
  await client.del(accessRateKey(email));
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
