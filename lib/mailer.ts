import nodemailer from "nodemailer";

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

export function isMailerConfigured(): boolean {
  return smtpConfigured;
}

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function transporter() {
  if (cachedTransporter) return cachedTransporter;
  const port = Number(EMAIL_SERVER_PORT) || 465;
  const secure =
    EMAIL_SERVER_SECURE != null
      ? String(EMAIL_SERVER_SECURE).toLowerCase() === "true"
      : port === 465;
  cachedTransporter = nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port,
    secure,
    auth: { user: EMAIL_SERVER_USER, pass: EMAIL_SERVER_PASSWORD },
  });
  return cachedTransporter;
}

/**
 * Lazy singleton send — returns {sent:false} instead of throwing when SMTP
 * env vars are absent, so a caller (an API route) can degrade gracefully
 * (log it, still respond 200) rather than crash the request.
 */
export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ sent: true } | { sent: false; reason: "not-configured" | "send-failed"; error?: string }> {
  if (!smtpConfigured) {
    console.error("[mailer] SMTP env vars missing — email NOT sent.");
    return { sent: false, reason: "not-configured" };
  }
  try {
    await transporter().sendMail({
      from: EMAIL_FROM || EMAIL_SERVER_USER,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return { sent: true };
  } catch (err) {
    const error = err as Error;
    console.error("[mailer] send failed:", error?.message);
    return { sent: false, reason: "send-failed", error: error?.message };
  }
}
