import { NextResponse } from "next/server";
import {
  canAttemptAdminSignIn,
  clearAdminSession,
  createAdminSession,
  verifyAdminSecret,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  let secret = "";
  try {
    const body = (await request.json()) as { secret?: unknown };
    secret = typeof body.secret === "string" ? body.secret : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ipAddress = forwarded || request.headers.get("x-real-ip") || "unknown";
    if (!(await canAttemptAdminSignIn(ipAddress))) {
      return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
    }
    if (!verifyAdminSecret(secret)) {
      return NextResponse.json({ error: "That publishing key is not valid." }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("E-book admin sign-in failed:", err);
    return NextResponse.json({ error: "Publishing access is not configured yet." }, { status: 503 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
