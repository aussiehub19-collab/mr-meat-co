import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";
import { sendMail } from "@/lib/mailer";
import { buildEmailHtml } from "@/lib/emailTemplate";
import { paymentTermsHtml } from "@/lib/order";
import { getOrder, markOrderSent } from "@/lib/orderStore";
import { SITE } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      orderNumber: string;
      customerEmail: string;
      amountDue: number;
      instructions: string;
    };

    if (!body.customerEmail || !body.instructions) {
      return NextResponse.json({ error: "Missing customerEmail or instructions." }, { status: 400 });
    }

    const html = buildEmailHtml({
      title: `Payment details for your order`,
      intro: `Here's how to complete payment for order ${body.orderNumber}.`,
      rows: [
        { label: "Order #", value: body.orderNumber, mono: true },
        { label: "Amount Due", value: `$${Number(body.amountDue || 0).toFixed(2)} AUD` },
        { label: "How to pay", html: body.instructions.replace(/\n/g, "<br>") },
      ],
      afterRows: paymentTermsHtml(),
      footer: `${SITE.name} — ${SITE.domain}`,
    });

    const result = await sendMail({
      to: body.customerEmail,
      subject: `Payment details — order ${body.orderNumber} — ${SITE.name}`,
      html,
    });

    if (result.sent && body.orderNumber) {
      await markOrderSent(body.orderNumber);
    }

    return NextResponse.json({ success: result.sent, ...result });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
