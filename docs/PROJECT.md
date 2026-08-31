# PROJECT STRATEGY & ARCHITECTURE — MR MEAT & CO

> Confidential Strategy Document — Internal Use Only. Never ship to public deployment directories.

## Executive Summary
Mr Meat & Co is a specialized, direct-to-consumer digital butchery platform serving Greater Sydney, Wollongong, and the Central Coast. By focusing on 100% Australian grass-fed beef mince, Wagyu cuts, and pasture-raised lamb, the business targets high-LTV households and meal-preppers seeking pure, unadulterated, preservative-free meat.

## Business & Logistics Framework
- **Legal entity**: Mr Meat & Co — ABN 71 635 847 908 (displayed in header strip + footer + Organization schema for client verification)
- **Domain**: `mrmeatandco.com.au` is a PLACEHOLDER — not registered. Site runs on its Vercel URL until a real domain is set in `SITE.domain`.
- **HQ & Butchery Workshop**: Alexandria, Sydney NSW 2015
- **Minimum Order Value**: $300 AUD
- **Shipping Policy**: Free refrigerated cold-chain courier delivery across Greater Sydney on orders $300 AUD and above.
- **Payment Strategy**: To avoid 2.9% credit card transaction fees, the store incentivizes PayID and Crypto (BTC, USDT) with an instant 10% discount. Order drafts are prepared via web cart and finalized via WhatsApp or direct transfer.

## Technical Architecture
- **Framework**: Next.js 15 App Router + React 19 + Tailwind CSS 4.
- **Data Layer**: Centralized state in `src/config/site.ts`.
- **Agent Integration**: Full level 2+ implementation supporting MCP HTTP streaming (`/api/mcp`), WebMCP browser execution, and RFC-compliant `.well-known` discovery standards.
