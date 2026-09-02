# KEYWORD MAP — MR MEAT & CO (as built)

> Confidential keyword strategy — internal use only. Never published to the live site.
> Source: Semrush exports (`~/Desktop/the meat cart/keyword exports`, 76 CSVs, ~115k rows).
> Threshold rule (owner): keep transactional/commercial terms at **volume ≥ 20 and KD < 15**;
> plus head terms and Google "related searches". Every page = 1 primary + ≥5 supporting + FAQs.

The primary/supporting keywords and FAQ sets are implemented in `src/config/site.ts` →
`PAGE_SEO` (pages) and `POSTS[].primaryKeyword / secondaryKeywords / faqs` (blog). This file
is the human-readable index of that allocation.

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
