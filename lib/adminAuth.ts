import { NextRequest, NextResponse } from "next/server";

/**
 * Gate for every /api/admin/* route. Reads the passcode from a server-only
 * env var — never exposed to the browser — and checks it against the
 * X-Admin-Passcode request header. Call as the first statement in every
 * admin API route; a non-null return is the response to send immediately.
 */
export function checkAdminPasscode(request: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSCODE is not set on the server." },
      { status: 503 }
    );
  }
  const provided = request.headers.get("x-admin-passcode");
  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Invalid passcode." }, { status: 401 });
  }
  return null;
}
