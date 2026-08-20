import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, POSTS, SITE } from "@/config/site";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  if (!q) {
    return NextResponse.json({ products: [], posts: [] });
  }

  const matchingProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
  ).map((p) => ({
    ...p,
    currency: SITE.currency,
    url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
  }));

  const matchingPosts = POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q)
  ).map((post) => ({
    ...post,
    url: `https://${SITE.domain}/blog/${post.slug}/`,
  }));

  return NextResponse.json(
    { products: matchingProducts, posts: matchingPosts },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=120",
      },
    }
  );
}
