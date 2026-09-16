import { escapeHtml } from "./emailTemplate";

/**
 * Wraps admin-pasted payment-detail text (bank/PayID/wallet specifics that
 * change per order and are never hardcoded) with the standing opening and
 * closing framing, so the admin only ever has to type the variable part.
 */
export function instructionsParts(opening: string, detail: string, closing: string): string {
  return [opening.trim(), detail.trim(), closing.trim()].filter(Boolean).join("\n\n");
}

export type PaymentMethodOption = "Bank Transfer" | "PayID" | "Crypto (BTC/USDT)";

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = ["Bank Transfer", "PayID", "Crypto (BTC/USDT)"];

/**
 * Per-method opening/closing sentences for the payment-details composer —
 * the admin only fills in the middle (account/PayID/wallet specifics).
 * Crypto carries the CLAUDE.md-mandated 10% instant discount framing;
 * Bank Transfer/PayID get the Osko-instant note baked into paymentTermsLines
 * instead (see showOskoNote below), since it applies to the standing terms
 * rather than the opening line itself.
 */
export function paymentMethodParts(
  method: PaymentMethodOption,
  amountDue: string,
  orderNumber: string
): { opening: string; closing: string } {
  const ref = orderNumber || "[order number]";
  const amt = amountDue || "[amount]";
  switch (method) {
    case "PayID":
      return {
        opening: `Please pay ${amt} via PayID (an instant Osko transfer) to the details below — use ${ref} as the payment reference:`,
        closing: "We'll confirm your delivery slot as soon as it lands.",
      };
    case "Crypto (BTC/USDT)":
      return {
        opening: `Your 10% crypto discount is already included in the ${amt} below. Please send the exact amount in Bitcoin (BTC) or Tether (USDT) to the wallet address below:`,
        closing: "We'll confirm your delivery slot as soon as the payment is received on-chain.",
      };
    case "Bank Transfer":
    default:
      return {
        opening: `Please transfer ${amt} via direct bank transfer (Osko/PayID-enabled where possible — it clears instantly) to the account below, using ${ref} as the reference:`,
        closing: "We'll confirm your delivery slot as soon as the transfer clears.",
      };
  }
}

export interface PaymentTermsOptions {
  orderNumber: string;
  contactEmail: string;
  /** Display text for the WhatsApp number, e.g. "+61 480 811 308". */
  whatsapp: string;
  /** Full wa.me link, pre-filled — build with lib/whatsapp.ts#waPaymentConfirmationLink. */
  whatsappLink: string;
  /** Shows the Osko/PayID fast-transfer callout — only relevant for Bank
   *  Transfer and PayID, where an instant-clearing rail actually exists. */
  showOskoNote?: boolean;
}

/**
 * Standing payment terms appended to every payment-details email/WhatsApp
 * message — kept in one place so the payment deadline, reference
 * convention, Osko/PayID note, delivery framing and confirmation step read
 * identically everywhere they appear (admin preview, outgoing email,
 * outgoing WhatsApp message).
 */
export function paymentTermsLines(opts: PaymentTermsOptions): string[] {
  const lines = [
    "Complete payment within 48 hours to confirm this order.",
    `Use your order number — ${opts.orderNumber || "[order number]"} — as the payment reference.`,
  ];
  if (opts.showOskoNote) {
    lines.push("Use Osko / PayID transfer where possible — it clears instantly, so your order is confirmed fastest.");
  }
  lines.push("Cold-chain refrigerated delivery across NSW, frozen express courier nationwide, once payment clears.");
  lines.push(`Once paid, send a screenshot of the completed payment to ${opts.contactEmail} or WhatsApp ${opts.whatsapp} for confirmation.`);
  return lines;
}

/** Same content as paymentTermsLines(), as an HTML bullet list with a
 *  clickable mailto: and WhatsApp link — for the actual outbound email
 *  (lib/emailTemplate.ts's EmailRow.html), which needs real markup rather
 *  than escaped plain text. Colours match the dark-card email theme
 *  (light body text, bright red accent) — see lib/emailTemplate.ts. */
export function paymentTermsHtml(opts: PaymentTermsOptions): string {
  const points = [
    "Complete payment within <strong>48 hours</strong> to confirm this order.",
    `Use your order number — <strong>${escapeHtml(opts.orderNumber || "[order number]")}</strong> — as the payment reference.`,
  ];
  if (opts.showOskoNote) {
    points.push(
      '<strong style="color:#B91C1C">Use Osko / PayID transfer</strong> where possible — it clears instantly, so your order is confirmed fastest.'
    );
  }
  points.push("Cold-chain refrigerated delivery across NSW, frozen express courier nationwide, once payment clears.");
  points.push(
    `Once paid, send a screenshot of the completed payment to <a href="mailto:${escapeHtml(opts.contactEmail)}" style="color:#B91C1C;font-weight:700;text-decoration:underline">${escapeHtml(opts.contactEmail)}</a> or WhatsApp <a href="${escapeHtml(opts.whatsappLink)}" style="color:#B91C1C;font-weight:700;text-decoration:underline">${escapeHtml(opts.whatsapp)}</a> for confirmation.`
  );
  return `<ul style="margin:0;padding-left:18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.7;color:#4B4F56">${points
    .map((p) => `<li style="margin-bottom:6px">${p}</li>`)
    .join("")}</ul>`;
}
