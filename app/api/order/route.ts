import { NextRequest, NextResponse } from "next/server";
import { SITE, FORMS, abs } from "@/config/site";
import { sendMail } from "@/lib/mailer";
import { buildEmailHtml, type EmailRow } from "@/lib/emailTemplate";
import {
  generateOrderNumber,
  isOrderStoreConfigured,
  saveOrder,
  type StoredOrder,
  type StoredOrderItem,
} from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface OrderPayload {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  items: StoredOrderItem[];
  subtotal: number;
  amountDue: number;
  paymentMethod: string;
  notes?: string;
  channel: "whatsapp" | "email";
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Partial<OrderPayload>;

    if (!data.customerName || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ success: false, message: "Missing order details." }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();
    const order: StoredOrder = {
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail || undefined,
      customerPhone: data.customerPhone || undefined,
      address: data.address || undefined,
      items: data.items,
      subtotal: Number(data.subtotal) || 0,
      amountDue: Number(data.amountDue) || 0,
      paymentMethod: data.paymentMethod || "Unspecified",
      notes: data.notes || undefined,
      status: "pending",
      channel: data.channel === "whatsapp" ? "whatsapp" : "email",
      createdAt: new Date().toISOString(),
    };

    if (isOrderStoreConfigured()) {
      try {
        await saveOrder(order);
      } catch (e) {
        console.error("[order] failed to save to order store:", (e as Error)?.message);
      }
    } else {
      console.error("[order] order store not configured (Upstash Redis env vars missing) — order not saved to dashboard.");
    }

    const itemRows: EmailRow[] = order.items.map((i) => ({
      label: i.name,
      value: `${i.quantity} × $${i.price.toFixed(2)} = $${(i.price * i.quantity).toFixed(2)} AUD`,
    }));

    const adminHtml = buildEmailHtml({
      title: `New order — ${order.orderNumber}`,
      intro: `${order.customerName} placed an order via ${order.channel === "whatsapp" ? "WhatsApp" : "the website"}.`,
      rows: [
        { label: "Order #", value: order.orderNumber, mono: true },
        { label: "Customer", value: order.customerName },
        ...(order.customerEmail ? [{ label: "Email", value: order.customerEmail }] : []),
        ...(order.customerPhone ? [{ label: "Phone", value: order.customerPhone }] : []),
        ...(order.address ? [{ label: "Address", value: order.address }] : []),
        ...itemRows,
        { label: "Subtotal", value: `$${order.subtotal.toFixed(2)} AUD` },
        { label: "Amount Due", value: `$${order.amountDue.toFixed(2)} AUD` },
        { label: "Payment Method", value: order.paymentMethod },
        ...(order.notes ? [{ label: "Notes", value: order.notes }] : []),
      ],
      cta: isOrderStoreConfigured()
        ? { label: "Reply in Dashboard →", url: abs(`/admin/orders/`) }
        : undefined,
      footer: `${SITE.name} order notification — ${SITE.domain}`,
    });

    const customerHtml = order.customerEmail
      ? buildEmailHtml({
          title: "We've received your order",
          intro: `Thanks, ${order.customerName} — your order ${order.orderNumber} has been received. Our butcher team will send you an order confirmation by email or WhatsApp shortly, with payment details and instructions to complete your order.`,
          rows: [
            { label: "Order #", value: order.orderNumber, mono: true },
            { label: "Amount Due", value: `$${order.amountDue.toFixed(2)} AUD` },
          ],
          footer: `${SITE.name} — ${SITE.domain}`,
        })
      : null;

    const [adminResult] = await Promise.all([
      sendMail({
        to: FORMS.orderEmail,
        subject: `New order ${order.orderNumber} — ${SITE.name}`,
        html: adminHtml,
        replyTo: order.customerEmail,
      }),
      customerHtml && order.customerEmail
        ? sendMail({
            to: order.customerEmail,
            subject: `Order received — ${order.orderNumber} — ${SITE.name}`,
            html: customerHtml,
          })
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      emailed: adminResult.sent,
      saved: isOrderStoreConfigured(),
    });
  } catch (err) {
    const error = err as Error;
    console.error("[order] failed:", error?.message);
    return NextResponse.json({ success: false, message: error.message || "Order failed" }, { status: 500 });
  }
}
