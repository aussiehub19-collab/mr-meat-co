import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, CATEGORIES, SHOP, SITE, CONTACT } from "@/config/site";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, method, params } = body;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    if (method === "initialize") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: {
              name: SITE.name,
              version: "1.0.0",
            },
          },
        },
        { headers: corsHeaders }
      );
    }

    if (method === "tools/list") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "search_products",
                description: "Search products by keyword (e.g. beef mince), category, or max_price",
                inputSchema: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    category: { type: "string" },
                    max_price: { type: "number" },
                  },
                },
              },
              {
                name: "get_product",
                description: "Get full product details by slug",
                inputSchema: {
                  type: "object",
                  required: ["slug"],
                  properties: { slug: { type: "string" } },
                },
              },
              {
                name: "list_categories",
                description: "List all product categories and subcategories",
                inputSchema: { type: "object", properties: {} },
              },
              {
                name: "get_policies",
                description: "Get shipping, payment, returns, and minimum order policies",
                inputSchema: { type: "object", properties: {} },
              },
              {
                name: "create_order_draft",
                description: "Create prefilled order URL. Human completes — never captures payment directly.",
                inputSchema: {
                  type: "object",
                  properties: {
                    items: { type: "array" },
                    notes: { type: "string" },
                  },
                },
              },
            ],
          },
        },
        { headers: corsHeaders }
      );
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const args = params?.arguments || {};

      if (toolName === "search_products") {
        let results = [...PRODUCTS];
        if (args.query) {
          const q = args.query.toLowerCase();
          results = results.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.subcategory.toLowerCase().includes(q)
          );
        }
        if (args.category) {
          results = results.filter((p) => p.category === args.category);
        }
        if (typeof args.max_price === "number") {
          results = results.filter((p) => p.price !== null && p.price <= args.max_price);
        }

        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    results.map((r) => ({
                      slug: r.slug,
                      name: r.name,
                      price: `${r.price} AUD`,
                      category: r.category,
                      shortDescription: r.shortDescription,
                      url: `https://${SITE.domain}/shop/${r.category}/${r.slug}/`,
                    })),
                    null,
                    2
                  ),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      if (toolName === "get_product") {
        const product = PRODUCTS.find((p) => p.slug === args.slug);
        if (!product) {
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              error: { code: -32602, message: `Product '${args.slug}' not found` },
            },
            { headers: corsHeaders }
          );
        }
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      ...product,
                      url: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
                      currency: SITE.currency,
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      if (toolName === "list_categories") {
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    CATEGORIES.map((c) => ({
                      ...c,
                      url: `https://${SITE.domain}/shop/${c.slug}/`,
                      productCount: PRODUCTS.filter((p) => p.category === c.slug).length,
                    })),
                    null,
                    2
                  ),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      if (toolName === "get_policies") {
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      minimumOrder: `${SHOP.minOrder} AUD`,
                      freeShippingThreshold: `${SHOP.freeShippingThreshold} AUD`,
                      shippingFee: "Free Temperature-Controlled Cold-Chain Express Delivery Across Greater Sydney",
                      cryptoDiscount: `${SHOP.cryptoDiscount}% discount on PayID / Crypto direct payment`,
                      paymentMethods: SHOP.paymentMethods,
                      guarantee: "100% Australian Grass-Fed & Hormone-Free Beef",
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      if (toolName === "create_order_draft") {
        const textMessage = `New Order Draft for ${SITE.name}:\nItems: ${JSON.stringify(
          args.items || []
        )}\nNotes: ${args.notes || "None"}`;
        const whatsappUrl = `https://wa.me/${CONTACT.whatsapp.replace(
          /[^\d]/g,
          ""
        )}?text=${encodeURIComponent(textMessage)}`;
        const formUrl = `https://${SITE.domain}/contact/`;

        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      message: "Order draft prepared. Human customer must complete payment via PayID or WhatsApp.",
                      whatsappDraftUrl: whatsappUrl,
                      onlineFormUrl: formUrl,
                      minimumOrderMet: true,
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(
      { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } },
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: error.message || "Parse error" } },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
