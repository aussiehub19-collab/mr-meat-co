import { NextResponse } from "next/server";
import { SITE, SHOP, CONTACT } from "@/config/site";

export async function GET() {
  return NextResponse.json(
    {
      ucp: "1.0",
      site: `https://${SITE.domain}`,
      services: [
        {
          id: "product-catalog",
          type: "catalog",
          url: `https://${SITE.domain}/shop/`,
          description: "Full fresh meat product catalog",
        },
        {
          id: "mcp-server",
          type: "mcp",
          url: `https://${SITE.domain}/api/mcp`,
          description: "Streamable HTTP MCP Server",
        },
        {
          id: "order",
          type: "commerce",
          url: `https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, "")}`,
          description: "Place butcher orders via WhatsApp or online draft",
        },
        {
          id: "wholesale",
          type: "b2b",
          url: `https://${SITE.domain}/wholesale/`,
          description: "Wholesale restaurant & bulk ordering",
        },
      ],
      currency: SITE.currency,
      minimumOrderAUD: SHOP.minOrder,
      paymentMethods: SHOP.paymentMethods,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    }
  );
}
