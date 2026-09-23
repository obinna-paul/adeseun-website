import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { normalizeEmail } from "@/lib/ebooks";

const COOKIE_NAME = "adeseun_reader";
const SESSION_SECONDS = 60 * 60 * 24 * 30;

type ReaderSession = {
  email: string;
  name?: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.READER_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("READER_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

function sign(encodedPayload: string): string {
  return createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");
}

function serializeSession(session: ReaderSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function parseSession(value: string | undefined): ReaderSession | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ReaderSession;
    if (!parsed.email || !parsed.exp || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return { ...parsed, email: normalizeEmail(parsed.email) };
  } catch {
    return null;
  }
}

export async function getReaderSession(): Promise<ReaderSession | null> {
  const store = await cookies();
  return parseSession(store.get(COOKIE_NAME)?.value);
}

export async function setReaderSession(email: string, name?: string): Promise<void> {
  const store = await cookies();
  const session: ReaderSession = {
    email: normalizeEmail(email),
    name: name?.trim() || undefined,
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  };

  store.set(COOKIE_NAME, serializeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearReaderSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
