# KEYWORD MAP — MR MEAT & CO (as built)

> Confidential keyword strategy — internal use only. Never published to the live site.
> Source: Semrush exports (`~/Desktop/the meat cart/keyword exports`, 76 CSVs, ~115k rows).
> Threshold rule (owner): keep transactional/commercial terms at **volume ≥ 20 and KD < 15**;
> plus head terms and Google "related searches". Every page = 1 primary + ≥5 supporting + FAQs.

The primary/supporting keywords and FAQ sets are implemented in `src/config/site.ts` →
`PAGE_SEO` (pages) and `POSTS[].primaryKeyword / secondaryKeywords / faqs` (blog). This file
is the human-readable index of that allocation.

---

## 0. Site-level targets & top-30 opportunity list (Semrush AU, 2026-09-03)

Ranked by **opportunity** (real volume × low difficulty). Intent: **T** = transactional,
**C** = commercial. Data: the 76 Semrush AU exports (2026-09-01/02), de-duped to ~115k
unique keywords, filtered to T/C intent + volume ≥ 20 + relevance ≥ 40, near-duplicates
collapsed.

### Main keyword
**`meat box`** — vol **2,400** · KD **24** · Commercial.
Describes the actual model (curated butcher boxes + build-a-box), commercial intent,
winnable in 6–12 months. Homepage currently targets the narrower `meat box delivery` (480) —
broaden to `meat box`, keep `meat box delivery` as the paired secondary.

_Aspirational primary (target at 12–18 months, do not build the homepage on these now):_
`meat delivery` (1,300 / KD 63), `online butcher` (1,000 / KD 59), `buy meat online`
(480 / KD 59) — all dominated by funded incumbents (Our Cow, ButcherCrowd, The Aussie Butcher).

### Secondary keywords (site level)

| keyword | vol | KD | intent |
|---|---|---|---|
| meat box delivery | 480 | 25 | C |
| meat subscription | 1,000 | 31 | C |
| extra lean beef mince | 2,400 | 11 | C |
| grass fed beef mince | 260 | 6 | C |
| bbq meat | 1,300 | 9 | C |
| chickens for sale | 2,900 | 12 | T |
| goat meat | 1,900 | 14 | C |
| raw dog food | 2,900 | 28 | C |
| venison near me | 390 | 12 | T |
| wholesale meat near me | 590 | 39 | T |
| buy beef online | 390 | 39 | T |
| buy game meat online | 110 | 3 | T |

### Top 30 opportunity keywords

| # | keyword | vol | KD | intent | target page |
|---|---|---|---|---|---|
| 1 | chickens for sale | 2,900 | 12 | T | /live-poultry/ |
| 2 | extra lean beef mince | 2,400 | 11 | C | /beef/mince-diced/ |
| 3 | goat meat | 1,900 | 14 | C | /specialty-meat/goat/ |
| 4 | bbq meat | 1,300 | 9 | C | /bbq-grill/ |
| 5 | pet mince | 1,000 | 6 | C | /pet-food/raw-mince/ |
| 6 | dog bones | 1,000 | 11 | C | /pet-food/bones/ |
| 7 | bbq skewers | 1,000 | 17 | C | /bbq-grill/skewers/ |
| 8 | hens for sale | 880 | 12 | T | /live-poultry/laying-hens/ |
| 9 | beef bones | 880 | 6 | C | /beef/bones-broth/ |
| 10 | fresh prawns | 720 | 17 | C | /seafood/prawns/ |
| 11 | chicken breast mince | 720 | 20 | C | /chicken/mince/ |
| 12 | pork sausage meat | 590 | 9 | C | /sausages/pork/ |
| 13 | bulk chicken breast | 390 | 14 | C | /wholesale/bulk-meat-orders/bulk-chicken/ |
| 14 | venison near me | 390 | 12 | T | /specialty-meat/game/ |
| 15 | kangaroo fillet | 320 | 10 | C | /specialty-meat/kangaroo/ |
| 16 | kangaroo meat near me | 320 | 11 | T | /specialty-meat/kangaroo/ |
| 17 | poultry for sale near me | 320 | 9 | T | /live-poultry/ |
| 18 | chicken wholesale | 320 | 16 | C | /wholesale/bulk-meat-orders/bulk-chicken/ |
| 19 | grass fed beef mince | 260 | 6 | C | /beef/mince-diced/ |
| 20 | wagyu eye fillet | 260 | 6 | C | /beef/steaks/ |
| 21 | bbq pack | 260 | 5 | C | /bbq-grill/ |
| 22 | prawns for sale | 210 | 9 | T | /seafood/prawns/ |
| 23 | lamb meat near me | 210 | 9 | T | /lamb/ |
| 24 | wholesale lamb | 170 | 6 | C | /wholesale/bulk-meat-orders/bulk-lamb/ |
| 25 | wholesale beef | 170 | 15 | C | /wholesale/bulk-meat-orders/bulk-beef/ |
| 26 | buy whole eye fillet | 140 | 9 | T | /beef/steaks/ |
| 27 | buy beef mince online | 140 | 6 | T | /beef/mince-diced/ |
| 28 | pork wholesale | 110 | 7 | C | /wholesale/bulk-meat-orders/bulk-pork/ |
| 29 | buy game meat online | 110 | 3 | T | /specialty-meat/game/ |
| 30 | barramundi for sale | 110 | 6 | T | /seafood/fish/ |

**High value, medium difficulty (target after the top 30 lands):**
`raw dog food` (2,900 / KD 28), `meat box` (2,400 / KD 24), `chicken sausage` (1,600 / KD 26),
`pork sausage` (1,000 / KD 21), `wholesale meat near me` (590 / KD 39), `buy beef online`
(390 / KD 39), `bulk meat packs near me` (320 / KD 27), `meat subscription` (1,000 / KD 31).

**Read of the data:** the winnable money volume clusters in **live poultry, beef mince
variants, pet food, BBQ, wholesale/bulk, and game/specialty** — every one of those already
has a page. Retail lamb, pork and chicken have thinner low-KD demand; they lean on
subcategory + long-tail. The "meat delivery / online butcher" positioning terms are all
KD 55+ and are a 12-month play, not a launch target.

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
