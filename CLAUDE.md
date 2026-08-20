# The Meat Cart — Project Instructions

The Meat Cart is a Next.js App Router ecommerce store for 100% Australian grass-fed beef mince, Wagyu steaks, pasture-raised lamb cutlets, and butcher boxes in Sydney. Deployed via Vercel / GitHub.

## Non-negotiable Compliance
- Banned Terms: preservative 223, nitrogen flushing, water pumping, synthetic binders, imported beef trim.
- Required Framings: 100% Australian grass-fed, pasture-raised, zero artificial preservatives, ground fresh daily in Alexandria Sydney, cold-chain refrigerated delivery, instant 10% discount for PayID & Crypto.
- Prohibited Claims: Never claim organic certification unless audited; never claim same-day delivery outside Greater Sydney Metro.
- If a request would require breaking any of the above, stop and say so rather than complying.

## Architecture
`src/config/site.ts` is the single source of truth. Adding one entry to PRODUCTS / CATEGORIES / POSTS generates the page, route, meta, JSON-LD, sitemap entry and nav links. Never hand-write pages.
Never hand-edit generated files (`llms.txt`, `.well-known/*`, `vercel.json`) — edit `src/config/site.ts` and run `npm run gen` or `npm run build`.

## Rules
- `npm run build && npm run crosscheck` must pass before every push.
- Exactly one `<h1>` per page. Meta descriptions ~150 chars. Titles ≤60 chars.
- Product images: 4:3 white frame with `object-fit: contain`.
- Emails entity-encoded (`&#64;`) everywhere, including JSON-LD.
- Never commit `node_modules/`, `.next/`, `out/`, or secret API keys.
- Framework Preset on Vercel must be "Next.js".

## Live Placeholders
- Domain: `meatcart.com.au` (pending DNS propagation or live)
- Web3Forms Key: `pending` (falls back gracefully to thank-you pages)
- GSC Verification Code: `pending`

## Brand Facts
- Founded: 2021 in Alexandria, Sydney NSW, Australia
- Ships: Greater Sydney Metro, Wollongong, Central Coast (Refrigerated Cold-Chain Van)
- Minimum Order: $250 AUD (Free Refrigerated Delivery on orders $250+)
- Payment: PayID, Crypto (BTC, USDT - 10% instant discount), Bank Transfer, WhatsApp Order Draft
No invented statistics, awards, press, or named clients. Ever.
