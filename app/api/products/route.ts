import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, SITE } from "@/config/site";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q");
  const limit = searchParams.get("limit");

  let list = [...PRODUCTS];

  if (category) {
    list = list.filter((p) => p.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
    );
  }

  if (limit) {
    const lim = parseInt(limit, 10);
    if (!isNaN(lim)) {
      list = list.slice(0, lim);
    }
  }

  const items = list.map((p) => ({
    ...p,
    currency: SITE.currency,
    url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
  }));

  return NextResponse.json(items, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300",
    },
  });
}
