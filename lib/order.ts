/**
 * Single source of truth for the standing payment-terms copy — consumed by
 * the WhatsApp message builder, the HTML email builder, and the JSX preview
 * in the admin composer, so all three always say exactly the same thing.
 */
export function paymentTermsLines(): string[] {
  return [
    "Your delivery slot is confirmed once payment clears.",
    "Cold-chain refrigerated delivery across NSW, frozen express courier nationwide.",
    "Reply to this email or WhatsApp us if anything needs changing.",
  ];
}

export function paymentTermsHtml(): string {
  return (
    `<ul style="margin:8px 0 0;padding-left:18px;font-family:system-ui,-apple-system,sans-serif;font-size:13px;color:#444">` +
    paymentTermsLines()
      .map((l) => `<li style="margin-bottom:4px">${l}</li>`)
      .join("") +
    `</ul>`
  );
}

/**
 * Wraps admin-pasted payment-detail text (bank/PayID/crypto specifics that
 * change per order and are never hardcoded) with the standing opening and
 * closing framing, so the admin only ever has to type the variable part.
 */
export function instructionsParts(opening: string, detail: string, closing: string): string {
  return [opening.trim(), detail.trim(), closing.trim()].filter(Boolean).join("\n\n");
}
