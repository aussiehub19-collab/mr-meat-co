import { SITE } from "@/config/site";

export function escapeHtml(s: string): string {
  return s.replace(
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

// The site's own black/red theme: a dark card body with a clean WHITE header
// band on top. Every background is a solid hex value declared BOTH as the
// bgcolor HTML attribute AND as an inline background-color — the bgcolor
// attribute is the most robust across sanitising webmail readers (Zoho, Gmail,
// Outlook) that drop CSS backgrounds, so the dark fill survives where earlier
// CSS-only attempts washed out to white.
const PAGE_BG = "#0F0A0A";
const CARD_BG = "#1A1212";
const HEADER_BG = "#FFFFFF";
const FOOTER_BG = "#140D0D";
const BORDER = "#3D2020"; // dark red hairline on the dark card
const HEADER_BORDER = "#B91C1C"; // red rule under the white header
const HEADER_TEXT = "#1A1212"; // dark name on the white header
const HEADER_MUTED = "#6B6259"; // muted location on the white header
const TEXT = "#F5EFEC"; // light body text on dark
const TEXT_MUTED = "#B8ADA5"; // muted labels on dark
const ACCENT = "#EF4444"; // bright red — readable on dark for headings/links

/**
 * Shared branded HTML-email shell — the site's dark black/red theme: a dark
 * card body carrying red accent headings, borders and buttons, under a clean
 * white header band. Table-based inline CSS + bgcolor attributes throughout
 * for Outlook/Gmail/Zoho/Apple Mail compatibility. The button colour defaults
 * to SITE.primaryColor but a caller can override — never a hardcoded hex here.
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
          `<tr><td colspan="2" bgcolor="${CARD_BG}" style="padding:${i === 0 ? "0" : "20"}px 0 8px;background-color:${CARD_BG};font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${ACCENT};border-bottom:2px solid ${BORDER}">${escapeHtml(
            r.label
          )}</td></tr>`
        );
      }
      const val = r.html ?? (r.value != null ? escapeHtml(r.value) : "");
      if (r.block) {
        return (
          `<tr><td colspan="2" bgcolor="${CARD_BG}" style="padding:8px 0 14px;background-color:${CARD_BG};border-bottom:1px solid ${BORDER};font-family:${SANS};font-size:13.5px;line-height:1.65;color:${TEXT};text-align:left;white-space:pre-wrap">${val}</td></tr>`
        );
      }
      if (r.highlight) {
        return (
          `<tr><td colspan="2" bgcolor="${CARD_BG}" style="padding:16px 0 0;background-color:${CARD_BG};border-top:2px solid ${primary}">` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
          `<td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};font-family:${SANS};font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:${TEXT};vertical-align:middle">${escapeHtml(r.label)}</td>` +
          `<td align="right" bgcolor="${CARD_BG}" style="background-color:${CARD_BG};font-family:${MONO};font-size:24px;font-weight:700;color:${ACCENT}">${val}</td>` +
          `</tr></table></td></tr>`
        );
      }
      return (
        `<tr>` +
        `<td bgcolor="${CARD_BG}" style="padding:10px 0;background-color:${CARD_BG};border-bottom:1px solid ${BORDER};font-family:${SANS};font-size:12.5px;color:${TEXT_MUTED};vertical-align:top;width:55%">${escapeHtml(r.label)}</td>` +
        `<td align="right" bgcolor="${CARD_BG}" style="padding:10px 0;background-color:${CARD_BG};border-bottom:1px solid ${BORDER};font-family:${r.mono ? MONO : SANS};font-size:13.5px;color:${TEXT};font-weight:${r.mono ? 700 : 600};vertical-align:top;white-space:pre-wrap">${val}</td>` +
        `</tr>`
      );
    })
    .join("");

  const ctaHtml = opts.cta
    ? `<tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:26px 0 0" align="center">
        <a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;background-color:${primary};color:#ffffff;text-decoration:none;font-family:${SANS};font-weight:700;font-size:13.5px;letter-spacing:0.02em;padding:14px 30px;border-radius:10px">${escapeHtml(opts.cta.label)}</a>
      </td></tr>`
    : "";

  const secondaryCtaHtml = opts.secondaryCta
    ? `<tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:${opts.cta ? "12" : "26"}px 0 4px" align="center">
        <a href="${escapeHtml(opts.secondaryCta.url)}" style="display:inline-block;background-color:${CARD_BG};color:${ACCENT};text-decoration:none;font-family:${SANS};font-weight:700;font-size:12.5px;letter-spacing:0.02em;padding:12px 26px;border-radius:10px;border:1px solid ${primary}">${escapeHtml(opts.secondaryCta.label)}</a>
      </td></tr>`
    : "";

  const refBadgeHtml = opts.refBadge
    ? `<span style="display:inline-block;margin-top:12px;color:${ACCENT};font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:0.03em;padding:5px 14px;border-radius:20px;border:1px solid ${primary}">${escapeHtml(opts.refBadge)}</span>`
    : "";

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG}">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(opts.preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${PAGE_BG}" style="background-color:${PAGE_BG};padding:36px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${CARD_BG}" style="max-width:560px;background-color:${CARD_BG};border-radius:16px;overflow:hidden;border:1px solid ${BORDER}">

        <!-- White header band -->
        <tr><td bgcolor="${HEADER_BG}" style="background-color:${HEADER_BG};padding:28px 28px 22px;text-align:center;border-bottom:3px solid ${HEADER_BORDER}">
          <div style="font-family:${SERIF};font-weight:700;font-size:22px;color:${HEADER_TEXT};letter-spacing:0.03em;text-transform:uppercase">${escapeHtml(SITE.name)}</div>
          <div style="font-family:${SANS};font-size:11px;font-weight:700;color:${HEADER_BORDER};letter-spacing:0.08em;margin-top:8px">ABN ${escapeHtml(SITE.abn)}</div>
          <div style="font-family:${SANS};font-size:10.5px;color:${HEADER_MUTED};text-transform:uppercase;letter-spacing:0.14em;margin-top:4px">Craft Butcher &middot; Alexandria, Sydney</div>
        </td></tr>

        <!-- Body -->
        <tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:32px 28px 8px">
          <h1 style="margin:0;font-family:${SERIF};font-weight:700;font-size:21px;color:#ffffff;line-height:1.3">${escapeHtml(opts.title)}</h1>
          ${refBadgeHtml}
          ${opts.intro ? `<p style="margin:16px 0 0;font-family:${SANS};font-size:14px;color:${TEXT_MUTED};line-height:1.65">${escapeHtml(opts.intro)}</p>` : ""}
        </td></tr>

        <tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:18px 28px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rowsHtml}</table>
          ${opts.afterRows || ""}
        </td></tr>

        ${ctaHtml || secondaryCtaHtml ? `<tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:0 28px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${ctaHtml}${secondaryCtaHtml}</table></td></tr>` : ""}

        <!-- Footer -->
        <tr><td bgcolor="${FOOTER_BG}" style="background-color:${FOOTER_BG};padding:20px 28px;border-top:1px solid ${BORDER}">
          <p style="margin:0;font-family:${SANS};font-size:11.5px;color:#8A7F77;line-height:1.6">${opts.footer ? escapeHtml(opts.footer) : `${escapeHtml(SITE.name)} — ${escapeHtml(SITE.domain)}`}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
