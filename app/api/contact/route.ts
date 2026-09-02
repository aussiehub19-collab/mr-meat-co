import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { FORMS, SITE } from "@/config/site";

// nodemailer needs the Node.js runtime (not edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const {
  EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT,
  EMAIL_SERVER_SECURE,
  EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD,
  EMAIL_FROM,
} = process.env;

const smtpConfigured = Boolean(
  EMAIL_SERVER_HOST && EMAIL_SERVER_USER && EMAIL_SERVER_PASSWORD
);

const LABELS: Record<string, string> = {
  contact: "Contact enquiry",
  order: "Website order",
  wholesale: "Wholesale application",
  bulk: "Bulk order enquiry",
};

// Fields that are plumbing, not content — kept out of the email body.
const HIDDEN = new Set(["access_key", "botcheck", "from_name", "formType", "subject"]);

function destFor(formType: string): string {
  if (formType === "order") return FORMS.orderEmail;
  if (formType === "wholesale" || formType === "bulk") return FORMS.wholesaleEmail;
  return FORMS.contactEmail;
}

function esc(s: string): string {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)
  );
}

function titleCase(k: string): string {
  return k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Record<string, unknown>;

    // Honeypot: a filled botcheck field means a bot — accept silently, send nothing.
    if (typeof data.botcheck === "string" && data.botcheck.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    const formType =
      typeof data.formType === "string" && LABELS[data.formType]
        ? data.formType
        : "contact";
    const label = LABELS[formType];
    const submitterEmail =
      typeof data.email === "string" && data.email.includes("@")
        ? data.email
        : undefined;

    const rows = Object.entries(data)
      .filter(([k, v]) => !HIDDEN.has(k) && v != null && String(v).trim() !== "")
      .map(([k, v]) => ({ key: titleCase(k), value: String(v) }));

    const subject =
      (typeof data.subject === "string" && data.subject.trim()) ||
      `${label} — ${SITE.name}`;

    const text =
      `${label} — ${SITE.name}\n\n` +
      rows.map((r) => `${r.key}: ${r.value}`).join("\n") +
      `\n\n— Sent from ${SITE.domain} (${formType} form)`;

    const html =
      `<h2>${esc(label)} — ${esc(SITE.name)}</h2>` +
      `<table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,-apple-system,sans-serif;font-size:14px">` +
      rows
        .map(
          (r) =>
            `<tr>` +
            `<td style="border:1px solid #ddd;font-weight:700;vertical-align:top">${esc(r.key)}</td>` +
            `<td style="border:1px solid #ddd;white-space:pre-wrap">${esc(r.value)}</td>` +
            `</tr>`
        )
        .join("") +
      `</table>` +
      `<p style="color:#888;font-size:12px">Sent from ${esc(SITE.domain)} (${esc(formType)} form)</p>`;

    // Pre-launch / preview fallback: no SMTP env vars → don't fail the form.
    if (!smtpConfigured) {
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "SMTP env vars not set — email not sent, form flow simulated.",
      });
    }

    const port = Number(EMAIL_SERVER_PORT) || 465;
    const secure =
      EMAIL_SERVER_SECURE != null
        ? String(EMAIL_SERVER_SECURE).toLowerCase() === "true"
        : port === 465;

    const transporter = nodemailer.createTransport({
      host: EMAIL_SERVER_HOST,
      port,
      secure,
      auth: { user: EMAIL_SERVER_USER, pass: EMAIL_SERVER_PASSWORD },
    });

    await transporter.sendMail({
      from: EMAIL_FROM || EMAIL_SERVER_USER,
      to: destFor(formType),
      replyTo: submitterEmail,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || "Send failed" },
      { status: 500 }
    );
  }
}
