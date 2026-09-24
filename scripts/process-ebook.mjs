import { createReadStream, createWriteStream } from "node:fs";
import { createHash } from "node:crypto";
import { mkdtemp, rm, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Redis } from "@upstash/redis";
import sharp from "sharp";

const execFile = promisify(execFileCallback);

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function required(name, value) {
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function parseRecord(value) {
  if (!value) return null;
  return typeof value === "string" ? JSON.parse(value) : value;
}

const bookId = required("--book-id", argument("--book-id"));
const sourceKey = required("--source-key", argument("--source-key"));
const accountId = required("R2_ACCOUNT_ID", process.env.R2_ACCOUNT_ID);
const accessKeyId = required("R2_ACCESS_KEY_ID", process.env.R2_ACCESS_KEY_ID);
const secretAccessKey = required("R2_SECRET_ACCESS_KEY", process.env.R2_SECRET_ACCESS_KEY);
const bucket = required("R2_BUCKET", process.env.R2_BUCKET);
const callbackUrl = process.env.EBOOK_STATUS_CALLBACK_URL;
const callbackSecret = process.env.EBOOK_PROCESSOR_SECRET;
const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? process.env.ADESEUN_WEBSITE_KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ??
  process.env.KV_REST_API_TOKEN ??
  process.env.ADESEUN_WEBSITE_KV_REST_API_TOKEN;
if ((!callbackUrl || !callbackSecret) && (!redisUrl || !redisToken)) {
  throw new Error("Either the protected status callback or Redis credentials are required.");
}
const prefix = (process.env.R2_PREFIX ?? "ebooks").replace(/^\/+|\/+$/g, "");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
const publicationKey = `ebook:publication:${bookId}`;

async function updatePublication(update) {
  if (callbackUrl && callbackSecret) {
    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${callbackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, sourceKey, update }),
    });
    if (response.status === 409) {
      console.log(`[ebook] skipped stale publication update for ${bookId}: ${sourceKey}`);
      return false;
    }
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      throw new Error(`Publication callback returned ${response.status}: ${detail}`);
    }
    return true;
  }

  if (!redis) throw new Error("Redis is not configured.");
  const current = parseRecord(await redis.get(publicationKey));
  if (!current) throw new Error(`No publication record exists for ${bookId}.`);
  if (current.sourceKey !== sourceKey) {
    console.log(`[ebook] skipped stale publication update for ${bookId}: ${sourceKey}`);
    return false;
  }
  await redis.set(publicationKey, JSON.stringify({ ...current, ...update, updatedAt: new Date().toISOString() }));
  return true;
}

async function main() {
  const workDir = await mkdtemp(join(tmpdir(), "adeseun-ebook-"));
  const pdfPath = join(workDir, "source.pdf");
  const version = createHash("sha256").update(sourceKey).digest("hex").slice(0, 16);
  const editionPrefix = `${prefix}/books/${bookId}/versions/${version}`;
  const pageKeyPattern = `${editionPrefix}/pages/{page}.webp`;
  const manifestKey = `${editionPrefix}/manifest.json`;

  try {
    console.log(`[ebook] downloading ${sourceKey}`);
    const source = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: sourceKey }));
    if (!source.Body) throw new Error("The source PDF has no body.");
    await pipeline(source.Body, createWriteStream(pdfPath));

    const { stdout } = await execFile("pdfinfo", [pdfPath], { maxBuffer: 2 * 1024 * 1024 });
    const pagesMatch = stdout.match(/^Pages:\s+(\d+)$/m);
    const pageCount = Number(pagesMatch?.[1]);
    if (!Number.isInteger(pageCount) || pageCount < 1) throw new Error("Could not determine the PDF page count.");

    console.log(`[ebook] rendering ${pageCount} pages for ${bookId}`);
    for (let page = 1; page <= pageCount; page += 1) {
      const padded = String(page).padStart(4, "0");
      const renderBase = join(workDir, `page-${padded}`);
      const jpegPath = `${renderBase}.jpg`;
      const webpPath = `${renderBase}.webp`;

      await execFile("pdftoppm", [
        "-f",
        String(page),
        "-l",
        String(page),
        "-singlefile",
        "-jpeg",
        "-jpegopt",
        "quality=92",
        "-r",
        "150",
        pdfPath,
        renderBase,
      ]);

      await sharp(jpegPath)
        .rotate()
        .resize({ width: 1800, withoutEnlargement: true })
        .webp({ quality: 84, effort: 4 })
        .toFile(webpPath);

      const key = pageKeyPattern.replace("{page}", padded);
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: createReadStream(webpPath),
          ContentType: "image/webp",
          CacheControl: "private, no-store",
        }),
      );
      await Promise.all([unlink(jpegPath), unlink(webpPath)]);
      console.log(`[ebook] uploaded page ${page}/${pageCount}: ${basename(key)}`);
    }

    const manifest = {
      version: 1,
      bookId,
      pageCount,
      pageFormat: "webp",
      pageKeyPattern,
      generatedAt: new Date().toISOString(),
    };
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: manifestKey,
        Body: JSON.stringify(manifest),
        ContentType: "application/json",
        CacheControl: "private, no-store",
      }),
    );

    const published = await updatePublication({
      status: "published",
      manifestKey,
      publishedAt: new Date().toISOString(),
      error: undefined,
    });
    if (published) {
      console.log(`[ebook] published ${bookId} with ${pageCount} pages`);
      if (process.env.DELETE_SOURCE_AFTER_PROCESSING === "true") {
        await s3
          .send(new DeleteObjectCommand({ Bucket: bucket, Key: sourceKey }))
          .then(() => console.log(`[ebook] deleted source PDF to conserve R2 storage: ${sourceKey}`))
          .catch((error) => console.warn(`[ebook] could not delete source PDF: ${error}`));
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ebook] processing failed for ${bookId}:`, error);
    await updatePublication({ status: "failed", error: message }).catch(() => undefined);
    process.exitCode = 1;
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

await main();
