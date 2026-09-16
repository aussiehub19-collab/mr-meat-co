import { SITE, CONTACT } from "@/config/site";

export function escapeHtml(s: string): string {
  return String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)
  );
}

export interface EmailRow {
  label: string;
  /** Plain text, auto-escaped. */
  value?: string;
  /** Pre-built trusted HTML — bypasses escaping. Use for links or styled text. */
  html?: string;
  /** Monospace — for exact-copy fields (order numbers, amounts). */
  mono?: boolean;
  /** Renders as a small uppercase section divider instead of a label/value row. */
  heading?: boolean;
  /** Renders larger and bold with a red top border — use once, for the total. */
  highlight?: boolean;
  /** Renders as a full-width, left-aligned block instead of a label/value
   *  row — for multi-line paragraph content (payment instructions, a reply
   *  message) where right-aligning a value column reads badly. `label` is
   *  ignored when this is set. */
  block?: boolean;
}

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

// LIGHT, bulletproof transactional theme — a white card with a dark brand
// header band and red accents, mirroring the site's black/red palette.
// Light-background emails render consistently across Gmail, Outlook, Zoho and
// Apple Mail: dark-mode readers invert DARK backgrounds unpredictably (which
// is what broke the earlier dark-card version in Zoho), but leave light emails
// alone. So this uses plain table-based inline styles — no color-scheme hacks,
// no !important overrides, no MSO VML — the approach proven on our sister site.
const PAGE_BG = "#F4F0EA"; // warm light page behind the card
const CARD_BG = "#FFFFFF"; // white card body
const HEADER_BG = "#141010"; // near-black brand header band
const FOOTER_BG = "#F7F4F0"; // light footer
const BORDER = "#EAE3DC"; // light hairline between rows
const TEXT = "#1A1414"; // near-black body text
const TEXT_MUTED = "#6F665F"; // muted intro / row labels
const ACCENT = "#B91C1C"; // brand red — section headings, links, totals, CTA
const HEADER_NAME = "#FFFFFF"; // wordmark on the dark header
const HEADER_MUTED = "#A79E97"; // tagline on the dark header

/**
 * Shared branded HTML-email shell. White card body under a dark brand header
 * band, with red section headings, borders and buttons. Table-based inline CSS
 * throughout for Outlook/Gmail/Zoho/Apple Mail compatibility. The button colour
 * defaults to SITE.primaryColor but a caller can override.
 */
export function buildEmailHtml(opts: {
  title: string;
  preheader?: string;
  intro?: string;
  /** Shown as a bold badge under the title — e.g. the order/enquiry reference. */
  refBadge?: string;
  rows: EmailRow[];
  afterRows?: string;
  cta?: { label: string; url: string };
  /** A second, outlined button under the primary CTA — e.g. "Contact Us". */
  secondaryCta?: { label: string; url: string };
  footer?: string;
  primaryColor?: string;
}): string {
  const primary = opts.primaryColor || SITE.primaryColor || "#B91C1C";

  const rowsHtml = opts.rows
    .map((r, i) => {
      if (r.heading) {
        return (
          `<tr><td colspan="2" style="padding:${i === 0 ? "0" : "22"}px 0 8px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${ACCENT};border-bottom:2px solid ${BORDER}">${escapeHtml(
            r.label
          )}</td></tr>`
        );
      }
      const val = r.html ?? (r.value != null ? escapeHtml(r.value) : "");
      if (r.block) {
        return (
          `<tr><td colspan="2" style="padding:8px 0 14px;border-bottom:1px solid ${BORDER};font-family:${SANS};font-size:13.5px;line-height:1.65;color:${TEXT};text-align:left;white-space:pre-wrap">${val}</td></tr>`
        );
      }
      if (r.highlight) {
        return (
          `<tr><td colspan="2" style="padding:16px 0 0;border-top:2px solid ${primary}">` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
          `<td style="font-family:${SANS};font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:${TEXT};vertical-align:middle">${escapeHtml(r.label)}</td>` +
          `<td align="right" style="font-family:${MONO};font-size:24px;font-weight:700;color:${ACCENT}">${val}</td>` +
          `</tr></table></td></tr>`
        );
      }
      return (
        `<tr>` +
        `<td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${SANS};font-size:12.5px;color:${TEXT_MUTED};vertical-align:top;width:42%">${escapeHtml(r.label)}</td>` +
        `<td align="right" style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${r.mono ? MONO : SANS};font-size:13.5px;color:${TEXT};font-weight:${r.mono ? 700 : 600};vertical-align:top;white-space:pre-wrap">${val}</td>` +
        `</tr>`
      );
    })
    .join("");

  const ctaHtml = opts.cta
    ? `<tr><td style="padding:26px 0 0" align="center">
        <a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;background-color:${primary};color:#ffffff;text-decoration:none;font-family:${SANS};font-weight:700;font-size:13.5px;letter-spacing:0.02em;padding:14px 30px;border-radius:10px">${escapeHtml(opts.cta.label)}</a>
      </td></tr>`
    : "";

  const secondaryCtaHtml = opts.secondaryCta
    ? `<tr><td style="padding:${opts.cta ? "12" : "26"}px 0 4px" align="center">
        <a href="${escapeHtml(opts.secondaryCta.url)}" style="display:inline-block;background-color:#ffffff;color:${primary};text-decoration:none;font-family:${SANS};font-weight:700;font-size:12.5px;letter-spacing:0.02em;padding:12px 26px;border-radius:10px;border:1px solid ${primary}">${escapeHtml(opts.secondaryCta.label)}</a>
      </td></tr>`
    : "";

  const refBadgeHtml = opts.refBadge
    ? `<span style="display:inline-block;margin-top:12px;color:${ACCENT};font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:0.03em;padding:5px 14px;border-radius:20px;border:1px solid ${primary}">${escapeHtml(opts.refBadge)}</span>`
    : "";

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${PAGE_BG}">${escapeHtml(opts.preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${CARD_BG};border-radius:16px;overflow:hidden;">

          <!-- Dark brand header band -->
          <tr>
            <td style="background:${HEADER_BG};padding:26px 32px;text-align:center;border-bottom:3px solid ${primary};">
              <div style="font-family:${SERIF};font-weight:700;font-size:22px;color:${HEADER_NAME};letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(SITE.name)}</div>
              <div style="font-family:${SANS};font-size:11px;font-weight:700;color:${ACCENT};letter-spacing:0.08em;margin-top:8px;">ABN ${escapeHtml(SITE.abn)}</div>
              <div style="font-family:${SANS};font-size:10.5px;color:${HEADER_MUTED};text-transform:uppercase;letter-spacing:0.14em;margin-top:4px;">Craft Butcher &middot; Alexandria, Sydney</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 8px;">
              <h1 style="margin:0;font-family:${SERIF};font-weight:700;font-size:21px;color:${TEXT};line-height:1.3;">${escapeHtml(opts.title)}</h1>
              ${refBadgeHtml}
              ${opts.intro ? `<p style="margin:16px 0 0;font-family:${SANS};font-size:14px;color:${TEXT_MUTED};line-height:1.65;">${escapeHtml(opts.intro)}</p>` : ""}
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rowsHtml}</table>
              ${opts.afterRows || ""}
            </td>
          </tr>

          ${ctaHtml || secondaryCtaHtml ? `<tr><td style="padding:0 32px 8px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${ctaHtml}${secondaryCtaHtml}</table></td></tr>` : ""}

          <!-- Footer -->
          <tr>
            <td style="background:${FOOTER_BG};padding:20px 32px;border-top:1px solid ${BORDER};">
              <p style="margin:0;font-family:${SANS};font-size:11.5px;color:#9A928B;line-height:1.6;">${
                opts.footer
                  ? escapeHtml(opts.footer)
                  : `${escapeHtml(SITE.name)} &middot; ABN ${escapeHtml(SITE.abn)}<br>${escapeHtml(CONTACT.address)}`
              }</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
