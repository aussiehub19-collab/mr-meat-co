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
}

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

// A fully light card — no dark background anywhere, including the header —
// so the admin (Zoho Mail) and customer (Gmail) copies render identically
// everywhere instead of depending on how each client happens to handle a
// dark fill. Brand colour comes through red accent text, borders and
// buttons only. This is the same underlying lesson as the header-band
// version that preceded it (see git history): the fewer background-color
// declarations an email relies on, the more consistently it renders.
const PAGE_BG = "#F4F1EA";
const CARD_BG = "#FFFFFF";
const BORDER = "#E5E1DB";
const FOOTER_BG = "#F7F5F1";
const FOOTER_BORDER = "#EDE9E1";
const TEXT = "#231F1D";
const TEXT_MUTED = "#6B6259";
const ACCENT = "#991B1B";

/**
 * Shared branded HTML-email shell — a light card (guaranteed to render
 * identically everywhere) carrying the site's red/black branding through
 * red accent text, borders and buttons only, never a background fill.
 * Table-based inline CSS throughout for Outlook/Gmail/Zoho/Apple Mail
 * compatibility. Colours default to SITE.primaryColor but a caller can
 * override — never a hardcoded hex here.
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
  const primary = opts.primaryColor || SITE.primaryColor || ACCENT;

  const rowsHtml = opts.rows
    .map((r, i) => {
      if (r.heading) {
        return (
          `<tr><td colspan="2" style="padding:${i === 0 ? "0" : "20"}px 0 8px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${ACCENT};border-bottom:2px solid ${BORDER}">${escapeHtml(
            r.label
          )}</td></tr>`
        );
      }
      const val = r.html ?? (r.value != null ? escapeHtml(r.value) : "");
      if (r.highlight) {
        return (
          `<tr><td colspan="2" style="padding:16px 0 0;border-top:2px solid ${primary}">` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
          `<td style="font-family:${SANS};font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:${TEXT};vertical-align:middle">${escapeHtml(r.label)}</td>` +
          `<td align="right" style="font-family:${MONO};font-size:24px;font-weight:700;color:${primary}">${val}</td>` +
          `</tr></table></td></tr>`
        );
      }
      return (
        `<tr>` +
        `<td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${SANS};font-size:12.5px;color:${TEXT_MUTED};vertical-align:top;width:55%">${escapeHtml(r.label)}</td>` +
        `<td align="right" style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${r.mono ? MONO : SANS};font-size:13.5px;color:${TEXT};font-weight:${r.mono ? 700 : 600};vertical-align:top;white-space:pre-wrap">${val}</td>` +
        `</tr>`
      );
    })
    .join("");

  const ctaHtml = opts.cta
    ? `<tr><td style="padding:26px 0 0" align="center">
        <a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;background-color:${primary};color:#fff;text-decoration:none;font-family:${SANS};font-weight:700;font-size:13.5px;letter-spacing:0.02em;padding:14px 30px;border-radius:10px">${escapeHtml(opts.cta.label)}</a>
      </td></tr>`
    : "";

  const secondaryCtaHtml = opts.secondaryCta
    ? `<tr><td style="padding:${opts.cta ? "12" : "26"}px 0 4px" align="center">
        <a href="${escapeHtml(opts.secondaryCta.url)}" style="display:inline-block;background-color:transparent;color:${primary};text-decoration:none;font-family:${SANS};font-weight:700;font-size:12.5px;letter-spacing:0.02em;padding:12px 26px;border-radius:10px;border:1px solid ${primary}">${escapeHtml(opts.secondaryCta.label)}</a>
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
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAGE_BG};padding:36px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${CARD_BG};border-radius:16px;overflow:hidden">

        <!-- Header -->
        <tr><td style="padding:28px 28px 22px;text-align:center;border-bottom:2px solid ${primary}">
          <div style="font-family:${SERIF};font-weight:700;font-size:22px;color:${TEXT};letter-spacing:0.03em;text-transform:uppercase">${escapeHtml(SITE.name)}</div>
          <div style="font-family:${SANS};font-size:11px;font-weight:700;color:${ACCENT};letter-spacing:0.08em;margin-top:8px">ABN ${escapeHtml(SITE.abn)}</div>
          <div style="font-family:${SANS};font-size:10.5px;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:0.14em;margin-top:4px">Craft Butcher &middot; Alexandria, Sydney</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 28px 8px">
          <h1 style="margin:0;font-family:${SERIF};font-weight:700;font-size:21px;color:${TEXT};line-height:1.3">${escapeHtml(opts.title)}</h1>
          ${refBadgeHtml}
          ${opts.intro ? `<p style="margin:16px 0 0;font-family:${SANS};font-size:14px;color:${TEXT_MUTED};line-height:1.65">${escapeHtml(opts.intro)}</p>` : ""}
        </td></tr>

        <tr><td style="padding:18px 28px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rowsHtml}</table>
          ${opts.afterRows || ""}
        </td></tr>

        ${ctaHtml || secondaryCtaHtml ? `<tr><td style="padding:0 28px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${ctaHtml}${secondaryCtaHtml}</table></td></tr>` : ""}

        <!-- Footer -->
        <tr><td style="background-color:${FOOTER_BG};padding:20px 28px;border-top:1px solid ${FOOTER_BORDER}">
          <p style="margin:0;font-family:${SANS};font-size:11.5px;color:#9A9488;line-height:1.6">${opts.footer ? escapeHtml(opts.footer) : `${escapeHtml(SITE.name)} — ${escapeHtml(SITE.domain)}`}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
