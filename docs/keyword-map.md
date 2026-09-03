# KEYWORD MAP — MR MEAT & CO (as built)

> Confidential keyword strategy — internal use only. Never published to the live site.
> Source: Semrush exports (`~/Desktop/the meat cart/keyword exports`, 76 CSVs, ~115k rows).
> Threshold rule (owner): keep transactional/commercial terms at **volume ≥ 20 and KD < 15**;
> plus head terms and Google "related searches". Every page = 1 primary + ≥5 supporting + FAQs.

The primary/supporting keywords and FAQ sets are implemented in `src/config/site.ts` →
`PAGE_SEO` (pages) and `POSTS[].primaryKeyword / secondaryKeywords / faqs` (blog). This file
is the human-readable index of that allocation.

---

## 0. Site keyword targets — AS ASSIGNED (from `PAGE_SEO` in `src/config/site.ts`)

This is what the site is built to target right now. Volume / KD / intent are from the
Semrush AU exports (2026-09-01/02) where the exact term appears; `—` means the term was a
head term or Google "related search" pick with no standalone export row.

### Main keyword
**`meat box delivery`** — `PAGE_SEO["/"].primaryKeyword` — vol **480** · KD **25** · Commercial.

### Supporting keywords (homepage — `PAGE_SEO["/"].supportingKeywords`)

| keyword | vol | KD | intent |
|---|---|---|---|
| meat delivery sydney | 390 | 57 | C |
| meat subscription | 1,000 | 31 | C |
| online butcher australia | — | (≈ "online butcher" 1,000 / KD 59) | I/T |
| grass fed meat delivery | — | (≈ "grass fed meat subscription" 140 / KD 41) | C |
| butcher delivered sydney | — | (≈ "sydney butcher delivery" 140 / KD 61) | I |

### Top 30 — the assigned page primary keywords (priority order)

| # | page | primary keyword | vol | KD | intent |
|---|---|---|---|---|---|
| 1 | `/` | meat box delivery | 480 | 25 | C |
| 2 | `/shop/` | buy meat online | 480 | 59 | T |
| 3 | `/beef/` | buy beef online | 390 | 39 | T |
| 4 | `/chicken/` | free range chicken delivery | — | — | T |
| 5 | `/lamb/` | lamb meat near me | 210 | 9 | T |
| 6 | `/pork/` | pork meat near me | 110 | 20 | T |
| 7 | `/sausages/` | sausages | 5,400 | 17 | I |
| 8 | `/bbq-grill/` | bbq meat box | 40 | 2 | C |
| 9 | `/meat-boxes/` | meat box | 2,400 | 24 | C |
| 10 | `/ready-to-cook/` | ready to cook meat | 20 | — | T |
| 11 | `/specialty-meat/` | buy specialty meat online | — | — | T |
| 12 | `/seafood/` | prawns for sale | 210 | 9 | T |
| 13 | `/pet-food/` | raw dog food | 2,900 | 28 | C |
| 14 | `/live-poultry/` | live poultry for sale | — | — | T |
| 15 | `/christmas-ham/` | christmas ham | — | — | C |
| 16 | `/wholesale/bulk-meat-orders/` | wholesale meat near me | 590 | 39 | T |
| 17 | `.../bulk-beef/` | wholesale beef | 170 | 15 | C |
| 18 | `.../bulk-chicken/` | bulk chicken breast | 390 | 14 | C |
| 19 | `.../bulk-lamb/` | wholesale lamb | 170 | 6 | C |
| 20 | `.../bulk-pork/` | wholesale pork | 50 | 7 | C |
| 21 | `.../bulk-goat/` | wholesale goat meat | 20 | — | C |
| 22 | `.../bulk-sausages/` | bulk sausages | 20 | 10 | T |
| 23 | `.../bulk-veal/` | wholesale veal | — | — | C |
| 24 | `.../bulk-kangaroo/` | wholesale kangaroo meat | — | — | C |
| 25 | `.../bulk-game/` | wholesale game meat | — | — | C |
| 26 | `/beef/mince-diced/` | beef mince | 4,400 | 25 | I |
| 27 | `/beef/steaks/` | buy steak online | — | (≈ "buy steak" 70 / KD 16) | T |
| 28 | `/ready-to-cook/schnitzels/` | chicken schnitzel | 18,100 | 39 | I |
| 29 | `/lamb/chops-cutlets/` | lamb chops | 9,900 | 38 | I |
| 30 | `/pork/mince/` | pork mince | 2,400 | 26 | I |

Full per-page allocation (49 pages + 25 blog posts) is in sections 1–5 below.

---

## 0b. Opportunity re-rank (Semrush AU, 2026-09-03) — reference only

The assigned list above is what's live. This is a data re-check: T/C-intent terms, volume ≥ 20,
KD low, near-dups collapsed — i.e. where a new site can realistically win first.

**Best single strategic pick:** `meat box` (2,400 / KD 24, C) — broader than the assigned
`meat box delivery` (480) at the same difficulty. Consider swapping the homepage primary.

| # | keyword | vol | KD | intent |
|---|---|---|---|---|
| 1 | chickens for sale | 2,900 | 12 | T |
| 2 | extra lean beef mince | 2,400 | 11 | C |
| 3 | goat meat | 1,900 | 14 | C |
| 4 | bbq meat | 1,300 | 9 | C |
| 5 | pet mince | 1,000 | 6 | C |
| 6 | dog bones | 1,000 | 11 | C |
| 7 | bbq skewers | 1,000 | 17 | C |
| 8 | hens for sale | 880 | 12 | T |
| 9 | beef bones | 880 | 6 | C |
| 10 | fresh prawns | 720 | 17 | C |
| 11 | chicken breast mince | 720 | 20 | C |
| 12 | pork sausage meat | 590 | 9 | C |
| 13 | bulk chicken breast | 390 | 14 | C |
| 14 | venison near me | 390 | 12 | T |
| 15 | kangaroo fillet | 320 | 10 | C |
| 16 | kangaroo meat near me | 320 | 11 | T |
| 17 | poultry for sale near me | 320 | 9 | T |
| 18 | chicken wholesale | 320 | 16 | C |
| 19 | grass fed beef mince | 260 | 6 | C |
| 20 | wagyu eye fillet | 260 | 6 | C |
| 21 | bbq pack | 260 | 5 | C |
| 22 | prawns for sale | 210 | 9 | T |
| 23 | lamb meat near me | 210 | 9 | T |
| 24 | wholesale lamb | 170 | 6 | C |
| 25 | wholesale beef | 170 | 15 | C |
| 26 | buy whole eye fillet | 140 | 9 | T |
| 27 | buy beef mince online | 140 | 6 | T |
| 28 | pork wholesale | 110 | 7 | C |
| 29 | buy game meat online | 110 | 3 | T |
| 30 | barramundi for sale | 110 | 6 | T |

---

## 1. Core / hub pages

| URL | Primary | Supporting (≥5) |
|---|---|---|
| `/` | meat box delivery | meat delivery sydney · meat subscription · online butcher australia · grass fed meat delivery · butcher delivered sydney |
| `/shop/` | online butcher | buy meat online · meat delivery · butcher shop online · order meat online australia · online meat market |
| `/wholesale/bulk-meat-orders/` | wholesale meat near me | bulk meat near me · order meat in bulk · bulk meat packs near me · restaurant meat supplier · wholesale butcher sydney |

## 2. Category pages

| URL | Primary | Supporting |
|---|---|---|
| `/beef/` | buy beef online | grass fed beef · beef delivery · beef cuts · scotch fillet · beef mince (see subcats) |
| `/chicken/` | free range chicken delivery | buy chicken online · buy chicken breast australia · chicken thigh fillets · chicken mince · whole chicken delivery · bulk chicken breast |
| `/lamb/` | lamb meat near me | buy lamb online · australian grass fed lamb · lamb delivery · lamb cuts · lamb box |
| `/pork/` | pork meat near me | buy pork online · australian pork · pork belly · pork delivery · pork roast |
| `/sausages/` | sausages | buy sausages online · gourmet sausages · beef sausages · pork sausages · gluten free sausages |
| `/bbq-grill/` | bbq meat box | bbq meat packs · barbecue meat delivery · bbq pack · grill pack · bbq meat pack sydney |
| `/meat-boxes/` | meat box | meat box delivery · butcher box · meat hamper · family meat pack · meat bundle |
| `/ready-to-cook/` | ready to cook meat | ready made meals delivered · marinated meat delivery · oven ready meals · crumbed chicken · heat and eat meals |
| `/specialty-meat/` | buy specialty meat online | exotic meat australia · kangaroo meat · venison · rabbit meat · goat meat · wild meat delivery |
| `/seafood/` | prawns for sale | buy seafood online · seafood delivery sydney · fresh fish delivery · buy salmon online · barramundi fillets |
| `/pet-food/` | raw dog food | raw pet food · barf dog food · raw meat for dogs · raw feeding · dog bones |
| `/live-poultry/` | live poultry for sale | point of lay hens for sale · laying hens for sale sydney · pullets for sale · backyard chickens for sale · isa brown hens · live chickens near me |

## 3. Bespoke subcategory pages (full 1+5+FAQ set in PAGE_SEO)

| URL | Primary | Notes |
|---|---|---|
| `/beef/mince-diced/` | beef mince | lean/extra-lean, price per kg, buy online, diced, 1kg |
| `/beef/steaks/` | buy steak online | scotch fillet, porterhouse, eye fillet, whole eye fillet, rump, t-bone |
| `/beef/slow-cook/` | beef cuts for slow cooking | brisket, cheeks, gravy beef, osso buco, short ribs, chuck |
| `/beef/bones-broth/` | beef bones for broth | marrow bones, buy beef bones, soup bones, knuckle bones **(new subcat)** |
| `/lamb/chops-cutlets/` | lamb chops | cutlets, loin chops, forequarter, chump, price per kg, rack |
| `/lamb/mince-diced/` | lamb mince | lean lamb mince, minced lamb online, diced lamb, price, stir-fry strips |
| `/lamb/roasts/` | leg of lamb | bone-in / boneless leg, rolled shoulder, rack, roast price |
| `/lamb/slow-cook/` | lamb shanks | lamb ribs, neck chops, breast, diced, shoulder slow cook |
| `/pork/mince/` | pork mince | lean pork mince, buy online, price, diced pork, premium |
| `/pork/bacon-ham/` | buy ham online | sliced ham, smoked leg ham, nitrate free bacon, streaky bacon, christmas ham |
| `/pork/bones-broth/` | buy pork bones online | pork bones for broth, neck bones, trotters, hock bones, tonkotsu bones **(new subcat)** |
| `/ready-to-cook/schnitzels/` | chicken schnitzel | beef/pork/veal schnitzel, homemade, gluten free |
| `/bbq-grill/burgers/` | burger patties | beef patties, beef burger patties, wagyu patties, homemade, wholesale |
| `/bbq-grill/skewers/` | bbq skewers | kebab skewers, marinated chicken skewers, beef kebabs, lamb kofta, mixed pack |
| `/bbq-grill/ribs/` | pork ribs | american style pork ribs, beef short ribs, beef ribs for bbq, lamb ribs, bbq pork ribs |
| `/specialty-meat/kangaroo/` | kangaroo meat near me | buy kangaroo meat, kangaroo steak/mince/fillet/sausages, price per kg |
| `/specialty-meat/veal/` | veal | veal schnitzel, veal mince, osso buco, cutlets, buy veal mince, rose veal australia |
| `/specialty-meat/goat/` | where to buy goat meat | goat meat near me, buy goat meat online, curry pieces, diced goat, shoulder, ribs |
| `/specialty-meat/game/` | buy game meat online | venison near me, wild boar meat, buy rabbit meat, rabbit for sale, crocodile meat, game box |
| `/specialty-meat/rabbit/` | buy rabbit meat | rabbit meat for sale, near me, where to buy, whole rabbit, jointed rabbit **(new subcat)** |
| `/live-poultry/laying-hens/` | point of lay hens for sale | laying hens for sale (sydney), isa brown, australorp, pol hens, backyard laying hens |
| `/live-poultry/pullets/` | pullets for sale | young pullets, started pullets, grower pullets, 8 week old pullets, brown egg layer pullets |
| `/live-poultry/meat-birds/` | meat birds for sale | meat chickens for sale, table birds, cornish cross, dual purpose chickens, broiler chickens |
| `/live-poultry/bantams/` | bantams for sale | silkie chickens for sale, pekin bantams, bantam chickens near me, fancy chickens, pet chickens |

## 4. Landing pages

| URL | Primary | Supporting |
|---|---|---|
| `/christmas-ham/` | christmas ham | buy christmas ham · whole leg ham · half leg ham · christmas ham delivery sydney · boneless christmas ham **(new page)** |

## 5. Wholesale bulk subcategory pages — all 9 bespoke

| URL | Primary | Supporting |
|---|---|---|
| `.../bulk-beef/` | wholesale beef | bulk beef · wholesale/bulk beef mince · quarter beef share · half beef box · buy whole eye fillet |
| `.../bulk-lamb/` | wholesale lamb | bulk lamb · half lamb box · whole lamb share · buy half a lamb · bulk lamb mince · lamb carcass price |
| `.../bulk-pork/` | wholesale pork | bulk pork · half pig share · whole pork carcass · buy half a pig · bulk pork belly · bulk pork mince |
| `.../bulk-chicken/` | bulk chicken breast | chicken breast bulk · bulk chicken · wholesale chicken · bulk chicken thigh fillets · 5kg chicken carton |
| `.../bulk-goat/` | wholesale goat meat | bulk goat meat · half goat share · whole goat carcass · buy goat meat in bulk · goat curry cartons |
| `.../bulk-sausages/` | bulk sausages | wholesale sausages · bulk sausages for bbq · 5kg sausages · 10kg sausage carton · catering sausages |
| `.../bulk-veal/` | wholesale veal | bulk veal · veal schnitzel bulk · bulk veal mince · veal osso buco carton · rose veal wholesale |
| `.../bulk-kangaroo/` | wholesale kangaroo meat | bulk kangaroo meat · kangaroo mince bulk · 5kg kangaroo carton · kangaroo fillet wholesale · bulk kangaroo for dogs |
| `.../bulk-game/` | wholesale game meat | bulk venison · venison carcass share · wholesale venison · bulk game meat box · wild boar wholesale |

Each has 1 primary + 5–6 supporting + 4 FAQs in `PAGE_SEO`, rendered by
`app/wholesale/bulk-meat-orders/[subcategory]/page.tsx`.

## 6. Geo strategy

Hybrid. National AU is the primary target for head terms; the Sydney modifier is layered in only
where the exports show real "sydney" / "near me" volume (delivery, wholesale, live poultry,
christmas ham). No suburb pages.

## 7. Deferred / revisit (KD too high now, or volume unproven)

- `beef mince` head (KD high) — supported via subcategory + blog, not chased as a standalone.
- `wagyu` — hero mentions it; no page yet. Candidate for `/beef/wagyu/` if stock supports it.
- Deli / charcuterie (jerky, biltong, salami) — demand exists; category was deliberately removed. Not recommended unless the owner wants to restock.
