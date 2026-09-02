import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/
     * - .well-known/
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|\.well-known).*)',
  ],
};

export function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') || '';

  if (prefersMarkdownOverHtml(accept)) {
    const url = request.nextUrl;
    // Serve Markdown summary for agent markdown negotiation requests
    const mdContent = `# Mr Meat & Co — Sydney Grass-Fed Craft Butcher
Location: Alexandria, Sydney NSW, Australia
URL: https://mrmeatandco.com.au${url.pathname}

## Overview
100% Australian grass-fed beef mince, Wagyu steaks, pasture-raised lamb cutlets, and fresh poultry.
Ground fresh daily in Sydney with zero preservatives or fillers.
Refrigerated cold-chain van delivery across all of NSW (Sydney Metro + regional incl. Wollongong and Central Coast); rest of Australia shipped snap-frozen by express courier.

## Business
- Mr Meat & Co — ABN 71 635 847 908

## Key Services & Features
- Minimum Order: $300 AUD
- Free cold-chain delivery on NSW orders over $300 AUD; interstate orders over $300 pay a quoted frozen-courier freight fee
- 10% instant discount when paying with crypto (BTC, USDT); PayID and bank transfer also accepted
- Human-in-the-loop WhatsApp order preparation: +61420126562
- Public Agent MCP Server Endpoint: https://mrmeatandco.com.au/api/mcp
- API Catalog: https://mrmeatandco.com.au/.well-known/api-catalog
- LLMs Info: https://mrmeatandco.com.au/llms.txt
`;

    return new NextResponse(mdContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }

  return NextResponse.next();
}

function prefersMarkdownOverHtml(accept: string): boolean {
  let mdQ = -1;
  let htmlQ = -1;

  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().split(';').map((s) => s.trim());
    let q = 1;
    for (const p of params) {
      const m = /^q=([\d.]+)$/.exec(p);
      if (m) q = parseFloat(m[1]);
    }
    if (type === 'text/markdown') mdQ = Math.max(mdQ, q);
    if (type === 'text/html') htmlQ = Math.max(htmlQ, q);
  }

  return mdQ > -1 && mdQ > htmlQ;
}
