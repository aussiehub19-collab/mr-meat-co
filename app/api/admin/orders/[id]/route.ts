import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";
import { getOrder, deleteOrder, markOrderSent } from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const { id } = await params;
  await deleteOrder(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const { id } = await params;
  await markOrderSent(id);
  return NextResponse.json({ success: true });
}
