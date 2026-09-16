import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  return NextResponse.json({ ok: true });
}
