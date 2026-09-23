import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { requireRedis } from "@/lib/redis";

const COOKIE_NAME = "adeseun_ebook_admin";
const SESSION_SECONDS = 60 * 60 * 12;
const SIGN_IN_WINDOW_SECONDS = 60 * 15;
const SIGN_IN_ATTEMPTS = 8;

function getAdminSecret(): string {
  const secret = process.env.EBOOK_ADMIN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("EBOOK_ADMIN_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

function signature(expiresAt: string): string {
  return createHmac("sha256", getAdminSecret()).update(expiresAt).digest("base64url");
}

export function verifyAdminSecret(candidate: string): boolean {
  const expected = Buffer.from(getAdminSecret());
  const actual = Buffer.from(candidate);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function canAttemptAdminSignIn(ipAddress: string): Promise<boolean> {
  const client = requireRedis("E-book publisher sign-in");
  const digest = createHmac("sha256", getAdminSecret()).update(ipAddress || "unknown").digest("hex");
  const bucket = Math.floor(Date.now() / (SIGN_IN_WINDOW_SECONDS * 1000));
  const key = `ebook:admin-sign-in:${digest}:${bucket}`;
  const attempts = await client.incr(key);
  if (attempts === 1) await client.expire(key, SIGN_IN_WINDOW_SECONDS + 60);
  return attempts <= SIGN_IN_ATTEMPTS;
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const store = await cookies();
  store.set(COOKIE_NAME, `${expiresAt}.${signature(expiresAt)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function hasAdminSession(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [expiresAt, supplied] = value.split(".");
  if (!expiresAt || !supplied || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  const expected = Buffer.from(signature(expiresAt));
  const actual = Buffer.from(supplied);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
