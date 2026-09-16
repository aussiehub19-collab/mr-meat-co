import { SITE, abs } from "@/config/site";

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
// exactly, rather than a generic light email card.
const PAGE_BG = "#0A0606";
const CARD_BG = "#1C1414";
const BORDER = "rgba(153,27,27,0.4)";
const BORDER_SOFT = "rgba(153,27,27,0.25)";
const TEXT = "#F3EFEC";
const TEXT_MUTED = "#a89f97";

/**
 * Shared branded HTML-email shell, styled to match the site's own dark-red
 * butcher theme (the header, gradient buttons, serif brand name, ABN bar)
 * rather than a generic light template. Table-based inline CSS throughout
 * for Outlook/Gmail compatibility. Colours default to SITE.primaryColor but
 * a caller can override — never a hardcoded hex in this file.
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
  accentColor?: string;
}): string {
  const primary = opts.primaryColor || SITE.primaryColor || "#B91C1C";
  const accent = opts.accentColor || "#7F1D1D";
  const gradient = `linear-gradient(135deg,#DC2626 0%,${primary} 50%,${accent} 100%)`;

  const rowsHtml = opts.rows
    .map((r, i) => {
      if (r.heading) {
        return (
          `<tr><td colspan="2" style="padding:${i === 0 ? "0" : "18"}px 0 6px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#f2726b;border-bottom:2px solid ${BORDER_SOFT}">${escapeHtml(
            r.label
          )}</td></tr>`
        );
      }
      const val = r.html ?? (r.value != null ? escapeHtml(r.value) : "");
      if (r.highlight) {
        return (
          `<tr><td colspan="2" style="padding:16px 18px;background:rgba(153,27,27,0.16);border-radius:12px;border:1px solid rgba(153,27,27,0.45)">` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
          `<td style="font-family:${SANS};font-size:13px;font-weight:700;color:${TEXT}">${escapeHtml(r.label)}</td>` +
          `<td align="right" style="font-family:${MONO};font-size:21px;font-weight:700;color:#ffffff">${val}</td>` +
          `</tr></table></td></tr>` +
          `<tr><td style="line-height:8px" colspan="2">&nbsp;</td></tr>`
        );
      }
      return (
        `<tr>` +
        `<td style="padding:9px 6px;font-family:${SANS};font-size:12.5px;color:${TEXT_MUTED};white-space:nowrap;vertical-align:top">${escapeHtml(r.label)}</td>` +
        `<td align="right" style="padding:9px 6px;font-family:${r.mono ? MONO : SANS};font-size:13.5px;color:${TEXT};font-weight:${r.mono ? 700 : 500};vertical-align:top;white-space:pre-wrap">${val}</td>` +
        `</tr>`
      );
    })
    .join("");

  const ctaHtml = opts.cta
    ? `<tr><td style="padding:26px 0 0" align="center">
        <a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;background:${gradient};color:#fff;text-decoration:none;font-family:${SANS};font-weight:700;font-size:13.5px;letter-spacing:0.02em;padding:14px 30px;border-radius:12px;box-shadow:0 2px 10px rgba(153,27,27,0.45)">${escapeHtml(opts.cta.label)}</a>
      </td></tr>`
    : "";

  const secondaryCtaHtml = opts.secondaryCta
    ? `<tr><td style="padding:${opts.cta ? "12" : "26"}px 0 4px" align="center">
        <a href="${escapeHtml(opts.secondaryCta.url)}" style="display:inline-block;background:transparent;color:#f5d4d1;text-decoration:none;font-family:${SANS};font-weight:700;font-size:12.5px;letter-spacing:0.02em;padding:12px 26px;border-radius:12px;border:1px solid rgba(220,38,38,0.55)">${escapeHtml(opts.secondaryCta.label)}</a>
      </td></tr>`
    : "";

  const refBadgeHtml = opts.refBadge
    ? `<span style="display:inline-block;margin-top:12px;background:rgba(153,27,27,0.22);color:#f5e8c8;font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:0.03em;padding:6px 14px;border-radius:20px;border:1px solid rgba(153,27,27,0.5)">${escapeHtml(opts.refBadge)}</span>`
    : "";

  return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${PAGE_BG}">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(opts.preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE_BG};padding:36px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD_BG};border-radius:20px;overflow:hidden;border:1px solid ${BORDER};box-shadow:0 4px 28px rgba(0,0,0,0.5)">

        <!-- Header -->
        <tr><td style="background:${gradient};padding:30px 28px 26px;text-align:center">
          <img src="${escapeHtml(abs("/images/logo.png"))}" width="60" height="60" alt="${escapeHtml(SITE.name)}" style="display:inline-block;border-radius:16px;border:2px solid rgba(255,255,255,0.4);margin-bottom:14px">
          <div style="font-family:${SERIF};font-weight:700;font-size:22px;color:#ffffff;letter-spacing:0.03em;text-transform:uppercase">${escapeHtml(SITE.name)}</div>
          <div style="font-family:${SANS};font-size:11px;font-weight:700;color:rgba(255,255,255,0.8);letter-spacing:0.08em;margin-top:6px">ABN ${escapeHtml(SITE.abn)}</div>
          <div style="font-family:${SANS};font-size:10.5px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.14em;margin-top:4px">Craft Butcher &middot; Alexandria, Sydney</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 28px 8px">
          <h1 style="margin:0;font-family:${SERIF};font-weight:700;font-size:21px;color:#ffffff;line-height:1.3">${escapeHtml(opts.title)}</h1>
          ${refBadgeHtml}
          ${opts.intro ? `<p style="margin:16px 0 0;font-family:${SANS};font-size:14px;color:${TEXT_MUTED};line-height:1.65">${escapeHtml(opts.intro)}</p>` : ""}
        </td></tr>

        <tr><td style="padding:18px 28px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rowsHtml}</table>
          ${opts.afterRows || ""}
        </td></tr>

        ${ctaHtml || secondaryCtaHtml ? `<tr><td style="padding:0 28px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${ctaHtml}${secondaryCtaHtml}</table></td></tr>` : ""}

        <!-- Footer -->
        <tr><td style="padding:28px 28px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${BORDER_SOFT};padding-top:16px">
            <p style="margin:0;font-family:${SANS};font-size:11.5px;color:#7a736c;line-height:1.6">${opts.footer ? escapeHtml(opts.footer) : `${escapeHtml(SITE.name)} — ${escapeHtml(SITE.domain)}`}</p>
          </td></tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
