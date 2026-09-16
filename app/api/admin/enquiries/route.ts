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
  try {
    const enquiries = await listEnquiries();
    return NextResponse.json({ enquiries, configured: true });
  } catch (err) {
    const error = err as Error;
    console.error("[admin/enquiries] failed to list enquiries:", error?.message);
    return NextResponse.json(
      { enquiries: [], configured: true, error: error?.message || "Failed to load enquiries." },
      { status: 502 }
    );
  }
}
