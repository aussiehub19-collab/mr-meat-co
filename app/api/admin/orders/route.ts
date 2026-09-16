import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";
import { listOrders, isOrderStoreConfigured } from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;

  if (!isOrderStoreConfigured()) {
    return NextResponse.json({ orders: [], configured: false });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders, configured: true });
}
