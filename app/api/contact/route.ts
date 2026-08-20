import { NextRequest, NextResponse } from "next/server";
import { FORMS } from "@/config/site";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // If key is pending or placeholder, simulate success so preview/forms don't crash
    if (!FORMS.web3formsKey || FORMS.web3formsKey.startsWith("pending") || FORMS.web3formsKey.startsWith("YOUR-")) {
      return NextResponse.json({
        success: true,
        message: "Key pending fallback: submission simulated successfully.",
      });
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: FORMS.web3formsKey,
        ...data,
      }),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || "Contact proxy failed" },
      { status: 500 }
    );
  }
}
