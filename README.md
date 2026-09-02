# Mr Meat & Co — 100% Australian Grass-Fed Sydney Butcher

Mr Meat & Co is a production-ready Next.js 15 App Router ecommerce site and AI-agent ready store for premium grass-fed beef mince, Wagyu steaks, pasture-raised lamb cutlets, and craft butcher boxes in Sydney.

## Features
- **Mobile-First & Responsive**: Tailored for 380px+ viewports with zero horizontal overflow.
- **Single Source of Truth**: All store data, categories, products, and blog posts are managed in `src/config/site.ts`.
- **AI-Agent Ready**: Native MCP Streamable HTTP endpoint (`/api/mcp`), WebMCP browser script (`/js/webmcp.js`), `llms.txt`, `auth.md`, `api-catalog`, `acp.json`, `ucp` (v1.0), and agent skills index.
- **Crypto Discount**: Automated 10% discount calculation for cryptocurrency (BTC, USDT) payments.
- **Human-in-the-Loop Ordering**: Instant WhatsApp order draft generation and direct form submissions.
- **SEO & Structured Data**: Dynamic Schema.org JSON-LD for `Store`, `Organization`, `Product`, `Offer`, `BreadcrumbList`, `FAQPage`, `BlogPosting`, and `AboutPage`.

## Quick Start
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Generate agent files from config
npm run gen

# Run pre-ship crosscheck verification
npm run crosscheck

# Production build
npm run build
```

## Deployment
1. Push to a GitHub repository.
2. Import repo into Vercel.
3. Ensure **Framework Preset** is set to **Next.js**.
4. Set optional environment variable `RESEND_API_KEY` if using Resend email provider.

## License
Private Commercial License — Mr Meat & Co Sydney.
