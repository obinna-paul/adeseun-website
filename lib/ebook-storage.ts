import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
  UploadPartCommand,
  type CompletedPart,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { EbookManifest } from "@/lib/ebook-types";

export class EbookStorageNotConfiguredError extends Error {
  constructor() {
    super("R2 storage is not configured.");
    this.name = "EbookStorageNotConfiguredError";
  }
}

export class EbookSourceMissingError extends Error {
  constructor(message = "The uploaded source PDF is missing from storage. Upload the PDF again.") {
    super(message);
    this.name = "EbookSourceMissingError";
  }
}

export class EbookSourceSizeMismatchError extends Error {
  constructor() {
    super("The stored source PDF does not match the completed upload. Upload the PDF again.");
    this.name = "EbookSourceSizeMismatchError";
  }
}

let client: S3Client | null = null;

function storageConfig() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new EbookStorageNotConfiguredError();
  }
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function getClient(): { client: S3Client; bucket: string } {
  const config = storageConfig();
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  return { client, bucket: config.bucket };
}

export async function createSourceMultipartUpload(key: string, contentType: string) {
  const { client, bucket } = getClient();
  const result = await client.send(
    new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: "private, no-store",
    }),
  );
  if (!result.UploadId) throw new Error("R2 did not return a multipart upload id.");
  return result.UploadId;
}

export async function signSourceUploadPart(input: {
  key: string;
  uploadId: string;
  partNumber: number;
}) {
  const { client, bucket } = getClient();
  return getSignedUrl(
    client,
    new UploadPartCommand({
      Bucket: bucket,
      Key: input.key,
      UploadId: input.uploadId,
      PartNumber: input.partNumber,
    }),
    { expiresIn: 60 * 60 },
  );
}

export async function completeSourceMultipartUpload(input: {
  key: string;
  uploadId: string;
  parts: CompletedPart[];
  expectedBytes: number;
}) {
  const { client, bucket } = getClient();
  await client.send(
    new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: input.key,
      UploadId: input.uploadId,
      MultipartUpload: { Parts: input.parts },
    }),
  );

  await assertSourceObject(input.key, input.expectedBytes);
}

export async function assertSourceObject(key: string, expectedBytes: number) {
  const { client, bucket } = getClient();
  try {
    const result = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    if (result.ContentLength !== expectedBytes) throw new EbookSourceSizeMismatchError();
  } catch (error) {
    if (
      error instanceof EbookSourceSizeMismatchError ||
      (error instanceof Error && (error.name === "NoSuchKey" || error.name === "NotFound")) ||
      (typeof error === "object" && error !== null && "$metadata" in error && error.$metadata &&
        typeof error.$metadata === "object" && "httpStatusCode" in error.$metadata && error.$metadata.httpStatusCode === 404)
    ) {
      if (error instanceof EbookSourceSizeMismatchError) throw error;
      throw new EbookSourceMissingError();
    }
    throw error;
  }
}

export async function abortSourceMultipartUpload(key: string, uploadId: string) {
  const { client, bucket } = getClient();
  await client.send(new AbortMultipartUploadCommand({ Bucket: bucket, Key: key, UploadId: uploadId }));
}

export async function getPrivateObject(key: string): Promise<Buffer> {
  const { client, bucket } = getClient();
  const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!result.Body) throw new Error(`R2 object "${key}" had no body.`);
  return Buffer.from(await result.Body.transformToByteArray());
}

export async function getEbookManifest(key: string): Promise<EbookManifest> {
  const raw = await getPrivateObject(key);
  const manifest = JSON.parse(raw.toString("utf8")) as Partial<EbookManifest>;
  if (
    manifest.version !== 1 ||
    !manifest.bookId ||
    !Number.isInteger(manifest.pageCount) ||
    Number(manifest.pageCount) < 1 ||
    manifest.pageFormat !== "webp" ||
    !manifest.pageKeyPattern?.includes("{page}")
  ) {
    throw new Error(`Invalid e-book manifest at "${key}".`);
  }
  return manifest as EbookManifest;
}

export function pageKeyFromManifest(manifest: EbookManifest, page: number): string {
  return manifest.pageKeyPattern.replace("{page}", String(page).padStart(4, "0"));
}
