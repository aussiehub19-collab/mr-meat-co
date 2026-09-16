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

/**
 * Shared branded HTML-email shell, styled to match the site's own dark-red
 * butcher theme (the gradient button colours, the serif headings) rather
 * than a generic light template. Table-based inline CSS throughout for
 * Outlook/Gmail compatibility. Colours default to SITE.primaryColor but a
 * caller can override — never a hardcoded hex in this file.
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
  footer?: string;
  primaryColor?: string;
  accentColor?: string;
}): string {
  const primary = opts.primaryColor || SITE.primaryColor || "#B91C1C";
  const accent = opts.accentColor || "#7F1D1D";

  const rowsHtml = opts.rows
    .map((r, i) => {
      if (r.heading) {
        return (
          `<tr><td colspan="2" style="padding:${i === 0 ? "0" : "18"}px 0 6px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#a33327;border-bottom:2px solid #f0d8d4">${escapeHtml(
            r.label
          )}</td></tr>`
        );
      }
      const val = r.html ?? (r.value != null ? escapeHtml(r.value) : "");
      if (r.highlight) {
        return (
          `<tr><td colspan="2" style="padding:14px 16px;background:linear-gradient(135deg,#fdf1ef,#fbe7e3);border-radius:10px;border:1px solid #f3d4cd">` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
          `<td style="font-family:${SANS};font-size:13px;font-weight:700;color:#5a2a24">${escapeHtml(r.label)}</td>` +
          `<td align="right" style="font-family:${MONO};font-size:20px;font-weight:700;color:${accent}">${val}</td>` +
          `</tr></table></td></tr>` +
          `<tr><td style="line-height:8px" colspan="2">&nbsp;</td></tr>`
        );
      }
      return (
        `<tr>` +
        `<td style="padding:9px 6px;font-family:${SANS};font-size:12.5px;color:#8a8580;white-space:nowrap;vertical-align:top">${escapeHtml(r.label)}</td>` +
        `<td align="right" style="padding:9px 6px;font-family:${r.mono ? MONO : SANS};font-size:13.5px;color:#2a2622;font-weight:${r.mono ? 700 : 500};vertical-align:top;white-space:pre-wrap">${val}</td>` +
        `</tr>`
      );
    })
    .join("");

  const ctaHtml = opts.cta
    ? `<tr><td style="padding:26px 0 4px" align="center">
        <a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,${primary} 55%,${accent});color:#fff;text-decoration:none;font-family:${SANS};font-weight:700;font-size:13.5px;letter-spacing:0.02em;padding:14px 30px;border-radius:12px;box-shadow:0 2px 6px rgba(179,49,39,0.35)">${escapeHtml(opts.cta.label)}</a>
      </td></tr>`
    : "";

  const refBadgeHtml = opts.refBadge
    ? `<span style="display:inline-block;margin-top:10px;background:#231f1d;color:#f5e8c8;font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:0.03em;padding:6px 14px;border-radius:20px">${escapeHtml(opts.refBadge)}</span>`
    : "";

  return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#efece6">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(opts.preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efece6;padding:36px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e8e3da;box-shadow:0 4px 24px rgba(35,31,29,0.08)">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#dc2626,${primary} 55%,${accent});padding:26px 28px;text-align:center">
          <div style="font-family:${SERIF};font-weight:700;font-size:22px;color:#ffffff;letter-spacing:0.01em">${escapeHtml(SITE.name)}</div>
          <div style="font-family:${SANS};font-size:11px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:0.12em;margin-top:3px">Craft Butcher · Alexandria, Sydney</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 28px 8px">
          <h1 style="margin:0;font-family:${SERIF};font-weight:700;font-size:21px;color:#231f1d;line-height:1.3">${escapeHtml(opts.title)}</h1>
          ${refBadgeHtml}
          ${opts.intro ? `<p style="margin:16px 0 0;font-family:${SANS};font-size:14px;color:#5b564f;line-height:1.65">${escapeHtml(opts.intro)}</p>` : ""}
        </td></tr>

        <tr><td style="padding:18px 28px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rowsHtml}</table>
          ${opts.afterRows || ""}
        </td></tr>

        ${ctaHtml ? `<tr><td style="padding:0 28px 8px">${ctaHtml}</td></tr>` : ""}

        <!-- Footer -->
        <tr><td style="padding:28px 28px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #efe8dd;padding-top:16px">
            <p style="margin:0;font-family:${SANS};font-size:11.5px;color:#a29b8f;line-height:1.6">${opts.footer ? escapeHtml(opts.footer) : `${escapeHtml(SITE.name)} — ${escapeHtml(SITE.domain)}`}</p>
          </td></tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
