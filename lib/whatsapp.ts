import { SITE, CONTACT } from "@/config/site";
import { paymentTermsLines } from "./order";

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

/** Admin → customer: payment details for a specific order. */
export function waPaymentDetailsMessage(opts: {
  orderNumber: string;
  amountDue: number;
  instructions: string;
}): string[] {
  return [
    `Thanks for your order ${opts.orderNumber}!`,
    "",
    `Amount due: $${opts.amountDue.toFixed(2)} AUD`,
    "",
    opts.instructions,
    "",
    ...paymentTermsLines().map((l) => `✅ ${l}`),
  ];
}

export function waPaymentDetailsLink(
  phone: string,
  opts: { orderNumber: string; amountDue: number; instructions: string }
): string {
  return waLinkTo(phone, waPaymentDetailsMessage(opts));
}
