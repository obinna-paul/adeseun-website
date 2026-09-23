import { NextResponse } from "next/server";
import { consumeReaderAccessToken } from "@/lib/ebooks";
import { setReaderSession } from "@/lib/reader-auth";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const grant = await consumeReaderAccessToken(token).catch((err) => {
    console.error("Reader access token lookup failed:", err);
    return null;
  });

  if (!grant) {
    return NextResponse.redirect(new URL("/read?error=expired", request.url));
  }

  await setReaderSession(grant.email, grant.name);
  return NextResponse.redirect(new URL(grant.nextPath, request.url));
}
