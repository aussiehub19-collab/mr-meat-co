import { SITE, CONTACT } from "@/config/site";

/** Bold site name — prepended to every WhatsApp message, either direction. */
export const WA_HEADER = `*${SITE.name}*`;

/** Normalise common AU phone formats to bare digits with country code (61...). */
export function toWhatsAppNumber(phone: string): string {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = "61" + digits.slice(1);
  if (!digits.startsWith("61") && digits.length === 9) digits = "61" + digits;
  return digits;
}

function joinBody(body: string | string[]): string {
  return Array.isArray(body) ? body.join("\n") : body;
}

/** Customer → business: a wa.me link to the site's own WhatsApp number. */
export function waLink(body: string | string[]): string {
  const text = `${WA_HEADER}\n${joinBody(body)}`;
  return `https://wa.me/${toWhatsAppNumber(CONTACT.whatsapp)}?text=${encodeURIComponent(text)}`;
}

export function waMessageText(body: string | string[]): string {
  return `${WA_HEADER}\n${joinBody(body)}`;
}

/** Admin → any customer number. */
export function waLinkTo(phone: string, body: string | string[]): string {
  const text = `${WA_HEADER}\n${joinBody(body)}`;
  return `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(text)}`;
}

export interface OrderSummaryItem {
  name: string;
  quantity: number;
  price: number;
}

/** New-order notification, business-bound (checkout → admin's own WhatsApp). */
export function waOrderLink(
  order: { orderNumber: string; items: OrderSummaryItem[]; amountDue: number; paymentMethod: string },
  customer: { name: string; phone?: string; address?: string }
): string {
  const itemLines = order.items.map((i) => `• ${i.name} (${i.quantity}x) — $${(i.price * i.quantity).toFixed(2)} AUD`);
  const body = [
    `🥩 NEW ORDER — ${order.orderNumber}`,
    `Customer: ${customer.name}`,
    customer.phone ? `Phone: ${customer.phone}` : "",
    customer.address ? `Address: ${customer.address}` : "",
    "",
    ...itemLines,
    "",
    `Total: $${order.amountDue.toFixed(2)} AUD (${order.paymentMethod})`,
  ].filter(Boolean);
  return waLink(body);
}

/** wa.me link pre-filled to open a payment-confirmation chat for a specific
 *  order — used wherever a customer is asked to send their payment
 *  screenshot via WhatsApp (payment-details email/message). */
export function waPaymentConfirmationLink(orderNumber: string): string {
  return waLink([`Hi, here's my payment confirmation for order ${orderNumber}.`]);
}

/** Admin → customer: payment details for a specific order. `termsLines`
 *  comes from lib/order.ts#paymentTermsLines — passed in rather than
 *  imported here to avoid a circular import (lib/order.ts's HTML variant
 *  doesn't depend on this file, but keeping the dependency one-directional
 *  either way makes it easier to reason about). */
export function waPaymentDetailsMessage(opts: {
  orderNumber: string;
  amountDue: number;
  instructions: string;
  termsLines: string[];
}): string[] {
  return [
    `Thanks for your order ${opts.orderNumber}!`,
    "",
    `Amount due: $${opts.amountDue.toFixed(2)} AUD`,
    "",
    opts.instructions,
    "",
    ...opts.termsLines.map((l) => `✅ ${l}`),
  ];
}

export function waPaymentDetailsLink(
  phone: string,
  opts: { orderNumber: string; amountDue: number; instructions: string; termsLines: string[] }
): string {
  return waLinkTo(phone, waPaymentDetailsMessage(opts));
}
