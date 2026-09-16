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
  /** Renders with a red-tinted background and larger bold text — use once, for the total. */
  highlight?: boolean;
}

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

// Matches the live site's own dark butcher theme (app/globals.css + Nav.tsx)
// exactly. Every colour here is a SOLID hex value — no CSS gradients and no
// rgba() transparency. Outlook's Word rendering engine (desktop + some
// Outlook.com paths) silently drops both, which is what was making these
// emails render as plain white cards instead of the intended dark theme.
const PAGE_BG = "#120D0D";
const CARD_BG = "#1C1414";
const HEADER_BG = "#140D0D";
const PANEL_BG = "#241717";
const BORDER = "#4A1E1E";
const BORDER_SOFT = "#331717";
const TEXT = "#F3EFEC";
const TEXT_MUTED = "#B8ADA5";
const RED = "#B91C1C";

/**
 * Shared branded HTML-email shell, styled to match the site's own dark-red
 * butcher theme (the header, buttons, serif brand name, ABN bar) rather than
 * a generic light template. Table-based inline CSS throughout, solid colours
 * only, for Outlook/Gmail/Apple Mail compatibility. Colours default to
 * SITE.primaryColor but a caller can override — never a hardcoded hex here.
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
  const primary = opts.primaryColor || SITE.primaryColor || RED;

  const rowsHtml = opts.rows
    .map((r, i) => {
      if (r.heading) {
        return (
          `<tr><td colspan="2" bgcolor="${CARD_BG}" style="padding:${i === 0 ? "0" : "18"}px 0 6px;background-color:${CARD_BG};font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#EF4444;border-bottom:2px solid ${BORDER_SOFT}">${escapeHtml(
            r.label
          )}</td></tr>`
        );
      }
      const val = r.html ?? (r.value != null ? escapeHtml(r.value) : "");
      if (r.highlight) {
        return (
          `<tr><td colspan="2" bgcolor="${PANEL_BG}" style="padding:16px 18px;background-color:${PANEL_BG};border:1px solid ${BORDER}">` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
          `<td bgcolor="${PANEL_BG}" style="background-color:${PANEL_BG};font-family:${SANS};font-size:13px;font-weight:700;color:${TEXT}">${escapeHtml(r.label)}</td>` +
          `<td align="right" bgcolor="${PANEL_BG}" style="background-color:${PANEL_BG};font-family:${MONO};font-size:21px;font-weight:700;color:#ffffff">${val}</td>` +
          `</tr></table></td></tr>` +
          `<tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};line-height:8px" colspan="2">&nbsp;</td></tr>`
        );
      }
      return (
        `<tr>` +
        `<td bgcolor="${CARD_BG}" style="padding:9px 6px;background-color:${CARD_BG};font-family:${SANS};font-size:12.5px;color:${TEXT_MUTED};white-space:nowrap;vertical-align:top">${escapeHtml(r.label)}</td>` +
        `<td align="right" bgcolor="${CARD_BG}" style="padding:9px 6px;background-color:${CARD_BG};font-family:${r.mono ? MONO : SANS};font-size:13.5px;color:${TEXT};font-weight:${r.mono ? 700 : 500};vertical-align:top;white-space:pre-wrap">${val}</td>` +
        `</tr>`
      );
    })
    .join("");

  const ctaHtml = opts.cta
    ? `<tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:26px 0 0" align="center">
        <a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;background-color:${primary};color:#fff;text-decoration:none;font-family:${SANS};font-weight:700;font-size:13.5px;letter-spacing:0.02em;padding:14px 30px;border-radius:10px">${escapeHtml(opts.cta.label)}</a>
      </td></tr>`
    : "";

  const secondaryCtaHtml = opts.secondaryCta
    ? `<tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:${opts.cta ? "12" : "26"}px 0 4px" align="center">
        <a href="${escapeHtml(opts.secondaryCta.url)}" style="display:inline-block;background-color:${CARD_BG};color:#f5d4d1;text-decoration:none;font-family:${SANS};font-weight:700;font-size:12.5px;letter-spacing:0.02em;padding:12px 26px;border-radius:10px;border:1px solid ${primary}">${escapeHtml(opts.secondaryCta.label)}</a>
      </td></tr>`
    : "";

  const refBadgeHtml = opts.refBadge
    ? `<span style="display:inline-block;margin-top:12px;background-color:${PANEL_BG};color:#f5e8c8;font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:0.03em;padding:6px 14px;border-radius:20px;border:1px solid ${BORDER}">${escapeHtml(opts.refBadge)}</span>`
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
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${CARD_BG}" style="max-width:560px;background-color:${CARD_BG};border-radius:16px;border:1px solid ${BORDER}">

        <!-- Header -->
        <tr><td bgcolor="${HEADER_BG}" style="background-color:${HEADER_BG};padding:26px 28px;text-align:center;border-bottom:1px solid ${BORDER}">
          <div style="font-family:${SERIF};font-weight:700;font-size:22px;color:#ffffff;letter-spacing:0.03em;text-transform:uppercase">${escapeHtml(SITE.name)}</div>
          <div style="font-family:${SANS};font-size:11px;font-weight:700;color:#EF4444;letter-spacing:0.08em;margin-top:8px">ABN ${escapeHtml(SITE.abn)}</div>
          <div style="font-family:${SANS};font-size:10.5px;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:0.14em;margin-top:4px">Craft Butcher &middot; Alexandria, Sydney</div>
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
        <tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:28px 28px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};border-top:1px solid ${BORDER_SOFT};padding-top:16px">
            <p style="margin:0;font-family:${SANS};font-size:11.5px;color:#7a736c;line-height:1.6">${opts.footer ? escapeHtml(opts.footer) : `${escapeHtml(SITE.name)} — ${escapeHtml(SITE.domain)}`}</p>
          </td></tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
