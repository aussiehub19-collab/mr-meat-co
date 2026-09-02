# BLOG PLAN — MR MEAT & CO (25 posts, as built)

> Internal. All 25 posts are live in `src/config/site.ts` → `POSTS`, each with markdown
> `content`, `primaryKeyword`, `secondaryKeywords[]`, 4–7 `faqs` (emitted as FAQPage JSON-LD)
> and a bottom `cta`. Renderer: `components/Article.tsx`. Schema: BlogPosting + BreadcrumbList
> + FAQPage on `app/blog/[slug]/page.tsx`.

## Published set

| # | Slug | Primary keyword | Links into | Funnel |
|---|---|---|---|---|
| 1 | beef-mince-fat-ratio-guide | beef mince | /beef/mince-diced/ | BOF |
| 2 | pork-mince-recipes-ideas | pork mince recipes | /pork/mince/ | MOF |
| 3 | chicken-schnitzel-method | chicken schnitzel recipe | /ready-to-cook/schnitzels/ | BOF |
| 4 | chicken-mince-weeknight-dinners | chicken mince recipes | /chicken/ | MOF |
| 5 | how-to-cook-lamb-chops | how to cook lamb chops | /lamb/chops-cutlets/ | BOF |
| 6 | homemade-burger-patty | burger patty recipe | /bbq-grill/burgers/ · /beef/mince-diced/ | MOF |
| 7 | lamb-ribs-low-and-slow | lamb ribs recipe | /lamb/slow-cook/ · /bbq-grill/ribs/ | MOF |
| 8 | kangaroo-meat-buyers-guide | kangaroo meat | /specialty-meat/kangaroo/ | **Pillar** |
| 9 | what-is-veal-how-to-cook-it | veal | /specialty-meat/veal/ | **Pillar** |
| 10 | beef-cuts-for-slow-cooking | beef cuts for slow cooking | /beef/slow-cook/ | BOF |
| 11 | king-vs-tiger-vs-banana-prawns | king vs tiger prawns | /seafood/ | MOF |
| 12 | how-much-meat-per-person | how much meat per person | /meat-boxes/ · /bbq-grill/ | TOF |
| 13 | buying-a-quarter-half-whole-beef | quarter beef share | /wholesale/bulk-meat-orders/bulk-beef/ | BOF |
| 14 | raw-feeding-dogs-starter-guide | raw dog food | /pet-food/ | **Pillar** |
| 15 | venison-and-game-meat-guide | how to cook venison | /specialty-meat/game/ | MOF |
| 16 | sausage-rolls-from-scratch | sausage roll recipe | /sausages/ | MOF |
| 17 | australian-beef-cuts-explained | australian beef cuts | /beef/ | TOF |
| 18 | cold-chain-meat-delivery-explained | meat delivery | / · /faq/ | BOF |
| 19 | perfect-pork-crackling | pork crackling | /pork/ (roasts) | MOF |
| 20 | how-to-roast-a-leg-of-lamb | how to roast a leg of lamb | /lamb/roasts/ | BOF |
| 21 | corned-beef-silverside-guide | how to cook corned beef | /beef/slow-cook/ | MOF |
| 22 | nitrate-free-bacon-explained | nitrate free bacon | /pork/bacon-ham/ | MOF |
| 23 | grass-fed-vs-grain-fed-beef | grass fed vs grain fed beef | /beef/ | TOF |
| 24 | bone-broth-from-beef-bones | bone broth from beef bones | /beef/bones-broth/ | BOF |
| 25 | christmas-ham-glaze-guide | christmas ham | /christmas-ham/ | BOF (seasonal) |

## Pillars & internal linking

- **Kangaroo (#8)**, **Veal (#9)**, **Raw Feeding (#14)** are the pillar posts — the category page
  and every related post link back to them.
- Secondary hubs: **Beef Mince (#1)**, **Schnitzel (#3)**, **Slow-Cook Beef (#10)**.
- Each recipe/technique post links to the matching subcategory page and at least one product.

## Overflow queue (next batch, not yet built)

chicken fillet recipes · lamb burger / kofta · beef & lamb kofta · pork belly braise ·
pink vs red snapper · goat curry cuts · rabbit with mustard & cream · emu vs beef nutrition ·
tonkotsu broth from pork bones · how to carve a leg ham · backyard hens starter guide
(links `/live-poultry/`).
