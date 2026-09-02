# FAQ BANK — MR MEAT & CO

> Internal index. FAQs are implemented as data, not prose:
> - **Homepage**: `src/config/site.ts` → `FAQ[]` (6 questions), rendered on `app/page.tsx` + FAQPage JSON-LD.
> - **Every category / bespoke subcategory / landing page**: `PAGE_SEO[url].faqs` (3–6 each),
>   rendered by `components/SeoFaqSection.tsx` (visible block + FAQPage JSON-LD).
> - **Every blog post**: `POSTS[].faqs` (4–7 each), rendered on `app/blog/[slug]/page.tsx` + FAQPage JSON-LD.
> - **FAQ page** (`app/faq/page.tsx`): renders `FAQ_GROUPS` from `site.ts` — 9 themed
>   sections, ~52 Q&As, with an anchor-nav and one combined de-duplicated FAQPage JSON-LD
>   block (homepage `FAQ[]` + every group item).

## FAQ page — themed groups (`FAQ_GROUPS`)

| # | Group | Q count |
|---|---|---|
| 1 | Delivery, freshness & storage | 7 |
| 2 | Ordering, pricing & payment | 6 |
| 3 | Quality & provenance | 7 |
| 4 | Cuts & cooking | 7 |
| 5 | Kangaroo & specialty meat | 8 |
| 6 | Seafood | 4 |
| 7 | Wholesale & bulk orders | 6 |
| 8 | Live poultry | 5 |
| 9 | Raw pet feeding | 6 |

No halal references anywhere (owner instruction — "not halal, don't mention it").

## Homepage FAQ (FAQ[])

1. Do you deliver meat across Sydney?
2. What's the minimum order, and is delivery free?
3. Is all your meat 100% Australian and grass-fed?
4. How does the 10% crypto discount work? *(crypto BTC/USDT only — PayID & bank = fee-free, no discount)*
5. How do you keep the meat cold in transit?
6. Can I order wholesale or in bulk?

## Coverage by page (all have FAQPage JSON-LD)

| Page group | FAQ source | Count each |
|---|---|---|
| `/`, `/shop/` | FAQ[] / PAGE_SEO | 6 / 4 |
| 11 category pages + `/live-poultry/` | PAGE_SEO[url].faqs | 3–5 |
| 19 bespoke subcategory pages | PAGE_SEO[url].faqs | 3–4 |
| `/christmas-ham/` | PAGE_SEO + inline glaze section | 4 |
| `/wholesale/bulk-meat-orders/` + bulk-beef + bulk-chicken | PAGE_SEO[url].faqs | 3–5 |
| 25 blog posts | POSTS[].faqs | 4–7 |

## Themes represented

- **Delivery / cold chain**: areas served, minimum order, how cold-chain is maintained, not-home, frozen vs chilled.
- **Pricing / payment**: minimum, crypto-only discount, no card surcharge, price per kg.
- **Provenance**: Australian, grass-fed vs grain-fed, free-range chicken, no water/fillers/preservative, nitrate-free bacon cure.
- **Cuts & cooking**: chop vs cutlet, scotch vs porterhouse, best slow-cook cuts, crackling, fat ratios, per-kg yields.
- **Kangaroo & specialty**: healthy?, price vs beef, cooking tender, gamey?, veal ethics, where to buy goat/rabbit, cooking lean game.
- **Seafood**: raw/cooked prawns, prawn types, freezing at home, fish origin.
- **Wholesale & bulk**: minimum order, restaurant supply, what's in a share, freezer space, cut sheets, Australia-wide.
- **Raw pet feeding**: human vs pet grade, BARF proteins, daily amounts, safe bones, kangaroo for allergies.
- **Live poultry**: point-of-lay meaning, collection/delivery, vaccinated & sexed, minimum bird numbers, breeds, pullet vs POL.
- **Christmas ham**: when to order, what size, is it cooked, glazing.

## Compliance note

Answers never use the banned terms scanned by `scripts/crosscheck.mjs`
(`preservative 223`, `nitrogen flushing`, `water pumping`, `synthetic binders`, `imported beef trim`).
Phrase additive claims as "no artificial preservative numbers", "not water-pumped", etc.
