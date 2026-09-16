import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";
import { getEnquiry, deleteEnquiry } from "@/lib/enquiryStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ enquiry });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const { id } = await params;
  await deleteEnquiry(id);
  return NextResponse.json({ success: true });
}
