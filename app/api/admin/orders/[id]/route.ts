import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";
import { getOrder, deleteOrder, markOrderSent } from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error?.message || "Failed to load order." }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    await deleteOrder(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error?.message || "Delete failed." }, { status: 502 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    await markOrderSent(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error?.message || "Update failed." }, { status: 502 });
  }
}
