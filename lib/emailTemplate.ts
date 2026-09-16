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
}

/**
 * Shared branded HTML-email shell. Table-based inline CSS throughout for
 * Outlook/Gmail compatibility. Colours default to SITE.primaryColor but a
 * caller can override — never a hardcoded hex in this file — so this one
 * template serves every email the site sends.
 */
export function buildEmailHtml(opts: {
  title: string;
  preheader?: string;
  intro?: string;
  rows: EmailRow[];
  /** Extra trusted HTML rendered directly below the rows table (e.g. standing terms). */
  afterRows?: string;
  cta?: { label: string; url: string };
  footer?: string;
  primaryColor?: string;
  accentColor?: string;
}): string {
  const primary = opts.primaryColor || SITE.primaryColor || "#B91C1C";
  const accent = opts.accentColor || primary;

  const rowsHtml = opts.rows
    .map((r) => {
      const val = r.html ?? (r.value != null ? escapeHtml(r.value) : "");
      return (
        `<tr>` +
        `<td style="padding:10px 14px;border:1px solid #e5e5e5;font-weight:700;font-family:system-ui,-apple-system,sans-serif;font-size:13px;color:#222;vertical-align:top;background:#fafafa;white-space:nowrap">${escapeHtml(r.label)}</td>` +
        `<td style="padding:10px 14px;border:1px solid #e5e5e5;font-family:${r.mono ? "'IBM Plex Mono',ui-monospace,monospace" : "system-ui,-apple-system,sans-serif"};font-size:13px;color:#222;white-space:pre-wrap">${val}</td>` +
        `</tr>`
      );
    })
    .join("");

  const ctaHtml = opts.cta
    ? `<tr><td style="padding:24px 0 0" align="center">
        <a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;background:${primary};color:#fff;text-decoration:none;font-family:system-ui,-apple-system,sans-serif;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px">${escapeHtml(opts.cta.label)}</a>
      </td></tr>`
    : "";

  return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f2f0ec">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(opts.preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0ec;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5">
        <tr><td style="background:${accent};padding:20px 28px">
          <span style="font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:20px;color:#ffffff">${escapeHtml(SITE.name)}</span>
        </td></tr>
        <tr><td style="padding:28px 28px 8px">
          <h1 style="margin:0 0 12px;font-family:system-ui,-apple-system,sans-serif;font-size:20px;color:#111">${escapeHtml(opts.title)}</h1>
          ${opts.intro ? `<p style="margin:0 0 16px;font-family:system-ui,-apple-system,sans-serif;font-size:14px;color:#444;line-height:1.6">${escapeHtml(opts.intro)}</p>` : ""}
        </td></tr>
        <tr><td style="padding:0 28px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rowsHtml}</table>
          ${opts.afterRows || ""}
        </td></tr>
        ${ctaHtml ? `<tr><td style="padding:0 28px 8px">${ctaHtml}</td></tr>` : ""}
        <tr><td style="padding:24px 28px 28px">
          <p style="margin:0;font-family:system-ui,-apple-system,sans-serif;font-size:12px;color:#888;line-height:1.6">${opts.footer ? escapeHtml(opts.footer) : `Sent by ${escapeHtml(SITE.name)} — ${escapeHtml(SITE.domain)}`}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
