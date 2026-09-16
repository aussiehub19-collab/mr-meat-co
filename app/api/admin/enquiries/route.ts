import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";
import { listEnquiries, isEnquiryStoreConfigured } from "@/lib/enquiryStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;

  if (!isEnquiryStoreConfigured()) {
    return NextResponse.json({ enquiries: [], configured: false });
  }
  const enquiries = await listEnquiries();
  return NextResponse.json({ enquiries, configured: true });
}
