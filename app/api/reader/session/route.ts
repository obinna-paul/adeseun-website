import { NextResponse } from "next/server";
import { clearReaderSession } from "@/lib/reader-auth";

export async function DELETE() {
  await clearReaderSession();
  return NextResponse.json({ ok: true });
}
