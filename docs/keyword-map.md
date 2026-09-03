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
**`meat box`** — `PAGE_SEO["/"].primaryKeyword` — vol **2,400** · KD **24** · Commercial.
_(Swapped from `meat box delivery` (480) on 2026-09-03 — same difficulty, 5× the volume, and
ranking for "meat box" captures "meat box delivery" traffic as a subset. Homepage title +
`<h1>` (HeroSlider slide 1) updated to lead with "Meat Boxes".)_

### Supporting keywords (homepage — `PAGE_SEO["/"].supportingKeywords`)

`meat box delivery` · `butcher box` · `meat subscription` · `grass fed meat delivery` · `online butcher australia`

### Top 30 — the assigned page primary keywords (priority order)

Focus keywords were re-cut on 2026-09-03 for a RankMath-clean on-page pass — each now
appears verbatim in the page title (front), meta description and first paragraph, plus an
FAQ H2. Awkward "…near me" forms were swapped for their natural head form; blog posts were
de-cannibalised from the money pages.

| # | page | primary keyword | vol | KD | intent |
|---|---|---|---|---|---|
| 1 | `/` | meat box | 2,400 | 24 | C |
| 2 | `/shop/` | buy meat online | 480 | 59 | T |
| — | `/wholesale/` | wholesale meat supplier | 90 | ~20 | C |
| 3 | `/beef/` | buy beef online | 390 | 39 | T |
| 4 | `/chicken/` | free range chicken | 390 | ~30 | C |
| 5 | `/lamb/` | buy lamb online | 90 | ~25 | T |
| 6 | `/pork/` | buy pork online | 110 | ~25 | T |
| 7 | `/sausages/` | butcher sausages | 110 | ~15 | C |
| 8 | `/bbq-grill/` | bbq meat pack | 90 | ~10 | C |
| 9 | `/meat-boxes/` | butcher box | 320 | ~20 | C |
| 10 | `/ready-to-cook/` | ready to cook meat | 20 | — | T |
| 11 | `/specialty-meat/` | buy specialty meat online | — | — | T |
| 12 | `/seafood/` | buy seafood online | 90 | ~20 | T |
| 13 | `/pet-food/` | raw dog food | 2,900 | 28 | C |
| 14 | `/live-poultry/` | live poultry for sale | 70 | ~12 | T |
| 15 | `/christmas-ham/` | christmas ham | 480 | ~35 | C |
| 16 | `/wholesale/bulk-meat-orders/` | wholesale meat | 720 | 51 | C |
| 17 | `…/bulk-beef/` | wholesale beef | 170 | 15 | C |
| 18 | `…/bulk-chicken/` | wholesale chicken | 170 | 8 | C |
| 19 | `…/bulk-lamb/` | wholesale lamb | 170 | 6 | C |
| 20 | `…/bulk-pork/` | wholesale pork | 50 | 7 | C |
| 21 | `…/bulk-goat/` | wholesale goat meat | 30 | ~10 | C |
| 22 | `…/bulk-sausages/` | bulk sausages | 20 | 10 | T |
| 23 | `…/bulk-veal/` | wholesale veal | — | — | C |
| 24 | `…/bulk-kangaroo/` | wholesale kangaroo meat | 20 | — | C |
| 25 | `…/bulk-game/` | wholesale game meat | — | — | C |
| 26 | `/beef/mince-diced/` | beef mince | 4,400 | 25 | I |
| 27 | `/beef/steaks/` | buy steak online | 70 | 16 | T |
| 28 | `/ready-to-cook/schnitzels/` | chicken schnitzel | 18,100 | 39 | I |
| 29 | `/lamb/chops-cutlets/` | lamb chops | 9,900 | 38 | I |
| 30 | `/pork/mince/` | pork mince | 2,400 | 26 | I |

Full per-page allocation (49 pages + 25 blog posts) is in sections 1–6 below. Some category
primaries (`sausages`, `chicken schnitzel`, `lamb chops`) are big but informational-dominant
and hard — they're anchored by subcategory + blog, not chased head-on.

---

## 0b. Opportunity re-rank (Semrush AU, 2026-09-03) — reference only

The assigned list above is what's live. This is a data re-check: T/C-intent terms, volume ≥ 20,
KD low, near-dups collapsed — i.e. where a new site can realistically win first.

**Done 2026-09-03:** homepage primary swapped to `meat box` (2,400 / KD 24, C) — see §0.

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

| URL | Primary | Supporting |
|---|---|---|
| `/` | meat box | meat box delivery · butcher box · meat subscription · grass fed meat delivery · online butcher australia |
| `/shop/` | buy meat online | meat online · online butcher · order meat online australia · fresh meat delivery · butcher box online |
| `/wholesale/` | wholesale meat supplier | restaurant meat supplier sydney · bulk meat supplier · trade meat supply · butcher wholesale · commercial meat supplier |
| `/wholesale/bulk-meat-orders/` | wholesale meat | bulk meat near me · order meat in bulk · bulk meat packs near me · restaurant meat supplier · wholesale butcher sydney |

## 2. Category pages

| URL | Primary | Supporting |
|---|---|---|
| `/beef/` | buy beef online | grass fed beef online · beef delivery sydney · wholesale beef · organic beef online · australian beef delivered |
| `/chicken/` | free range chicken | buy chicken online · buy chicken breast australia · chicken thigh fillets · chicken mince · whole chicken delivery · bulk chicken breast |
| `/lamb/` | buy lamb online | buy lamb online · australian lamb delivered · wholesale lamb · grass fed lamb · lamb delivered sydney |
| `/pork/` | buy pork online | buy pork online australia · pork wholesale · pork delivered sydney · australian pork · buy pork mince online |
| `/sausages/` | butcher sausages | sausage meat · butcher sausages near me · gourmet sausages · sausages in bulk · gluten free sausages |
| `/bbq-grill/` | bbq meat pack | bbq meat pack · bbq meat packs delivered · buy meat for bbq · family bbq pack · bbq meat delivery |
| `/meat-boxes/` | butcher box | meat box delivery · family meat box · meat subscription · value meat pack · premium steak box · build your own meat box |
| `/ready-to-cook/` | ready to cook meat | ready made meals delivered · marinated meat delivery · oven ready meals · crumbed chicken · heat and eat meals |
| `/specialty-meat/` | buy specialty meat online | exotic meat australia · kangaroo meat · venison · rabbit meat · goat meat · wild meat delivery |
| `/seafood/` | buy seafood online | buy prawns · buy salmon · barramundi for sale · seafood delivery sydney · fresh prawns |
| `/pet-food/` | raw dog food | raw dog food sydney · pet mince · raw meat dog food delivery · barf diet · kangaroo mince for dogs |
| `/live-poultry/` | live poultry for sale | point of lay hens for sale · laying hens for sale sydney · pullets for sale · backyard chickens for sale · isa brown hens · live chickens near me |

## 3. Subcategory & landing pages

| URL | Primary | Supporting |
|---|---|---|
| `/beef/mince-diced/` | beef mince | lean beef mince · extra lean beef mince · beef mince price per kg · buy beef mince online · diced beef · 1kg beef mince |
| `/beef/steaks/` | buy steak online | scotch fillet steak · porterhouse steak · eye fillet steak · buy whole eye fillet · rump steak · t-bone steak |
| `/beef/slow-cook/` | slow cook beef | beef brisket · beef cheeks · gravy beef · beef osso buco · beef short ribs · chuck steak slow cook |
| `/lamb/chops-cutlets/` | lamb chops | lamb cutlets · lamb loin chops · lamb forequarter chops · lamb chump chops · lamb chops price per kg · lamb rack |
| `/lamb/mince-diced/` | lamb mince | lean lamb mince · buy minced lamb online · diced lamb · lamb mince price · lamb stir-fry strips |
| `/lamb/roasts/` | leg of lamb | bone in leg of lamb · boneless leg of lamb · rolled lamb shoulder · lamb rack · lamb roast price |
| `/lamb/slow-cook/` | lamb shanks | lamb ribs · lamb neck chops · lamb breast · diced lamb · lamb shoulder slow cook |
| `/pork/mince/` | pork mince | lean pork mince · buy pork mince online · pork mince price · diced pork · premium pork mince |
| `/pork/bacon-ham/` | buy ham online | buy sliced ham online · buy smoked leg ham online · nitrate free bacon · streaky bacon · christmas ham |
| `/ready-to-cook/schnitzels/` | chicken schnitzel | beef schnitzel · homemade chicken schnitzel · gluten free chicken schnitzel · pork schnitzel · veal schnitzel |
| `/bbq-grill/burgers/` | burger patties | beef patties · beef burger patties · wagyu beef patties · homemade burger patties · wholesale beef patties |
| `/bbq-grill/skewers/` | bbq skewers | kebab skewers · marinated chicken skewers · beef kebabs · lamb kofta skewers · mixed bbq skewer pack |
| `/bbq-grill/ribs/` | pork ribs | american style pork ribs · beef short ribs · beef ribs for bbq · lamb ribs for bbq · bbq pork ribs |
| `/specialty-meat/kangaroo/` | buy kangaroo meat | buy kangaroo meat · kangaroo steak · kangaroo mince · kangaroo fillet · kangaroo sausages · kangaroo meat price per kg |
| `/specialty-meat/veal/` | buy veal online | veal schnitzel · veal mince · veal osso buco · veal cutlets · buy veal mince · rose veal australia |
| `/specialty-meat/goat/` | buy goat meat | goat meat near me · buy goat meat online · goat curry pieces · diced goat · goat shoulder · goat ribs |
| `/specialty-meat/game/` | buy game meat online | venison near me · wild boar meat · buy rabbit meat · rabbit meat for sale · crocodile meat · game meat box |
| `/specialty-meat/rabbit/` | buy rabbit meat | rabbit meat for sale · rabbit meat near me · where to buy rabbit meat · whole rabbit · jointed rabbit |
| `/beef/bones-broth/` | beef bones for broth | beef marrow bones · buy beef bones · bones for bone broth · soup bones · beef knuckle bones · where to buy beef bones |
| `/pork/bones-broth/` | buy pork bones online | pork bones for broth · pork neck bones · pork trotters · where can i buy pork bones · pork hock bones · tonkotsu bones |
| `/live-poultry/laying-hens/` | point of lay hens for sale | laying hens for sale · laying hens for sale sydney · isa brown hens for sale · australorp hens · pol hens · backyard laying hens |
| `/live-poultry/pullets/` | pullets for sale | young pullets for sale · started pullets · grower pullets · 8 week old pullets · brown egg layer pullets |
| `/live-poultry/meat-birds/` | meat birds for sale | meat chickens for sale · table birds · cornish cross chickens · dual purpose chickens · broiler chickens for sale |
| `/live-poultry/bantams/` | bantams for sale | silkie chickens for sale · pekin bantams for sale · bantam chickens near me · fancy chickens for sale · pet chickens |
| `/christmas-ham/` | christmas ham | buy christmas ham · whole leg ham · half leg ham · christmas ham delivery sydney · boneless christmas ham |

## 5. Wholesale bulk subcategory pages

| URL | Primary | Supporting |
|---|---|---|
| `/wholesale/bulk-meat-orders/bulk-beef/` | wholesale beef | bulk beef · wholesale beef mince · bulk beef mince · quarter beef share · half beef box · buy whole eye fillet |
| `/wholesale/bulk-meat-orders/bulk-chicken/` | wholesale chicken | chicken breast bulk · bulk chicken · wholesale chicken · bulk chicken thigh fillets · 5kg chicken carton |
| `/wholesale/bulk-meat-orders/bulk-lamb/` | wholesale lamb | bulk lamb · half lamb box · whole lamb share · buy half a lamb · bulk lamb mince · lamb carcass price |
| `/wholesale/bulk-meat-orders/bulk-pork/` | wholesale pork | bulk pork · half pig share · whole pork carcass · buy half a pig · bulk pork belly · bulk pork mince |
| `/wholesale/bulk-meat-orders/bulk-goat/` | wholesale goat meat | bulk goat meat · half goat share · whole goat carcass · buy goat meat in bulk · goat curry cartons · goat meat wholesale australia |
| `/wholesale/bulk-meat-orders/bulk-sausages/` | bulk sausages | wholesale sausages · bulk sausages for bbq · 5kg sausages · 10kg sausage carton · sausages in bulk · catering sausages |
| `/wholesale/bulk-meat-orders/bulk-veal/` | wholesale veal | bulk veal · veal schnitzel bulk · bulk veal mince · veal osso buco carton · rose veal wholesale · restaurant veal supplier |
| `/wholesale/bulk-meat-orders/bulk-kangaroo/` | wholesale kangaroo meat | bulk kangaroo meat · kangaroo mince bulk · 5kg kangaroo carton · kangaroo fillet wholesale · bulk kangaroo for dogs · kangaroo meat supplier |
| `/wholesale/bulk-meat-orders/bulk-game/` | wholesale game meat | bulk venison · venison carcass share · wholesale venison · bulk game meat box · wild boar wholesale · game meat supplier australia |

## 6. Blog posts (informational — de-cannibalised from the money pages)

| slug | Primary keyword |
|---|---|
| beef-mince-fat-ratio-guide | beef mince fat ratio |
| pork-mince-recipes-ideas | pork mince recipes |
| chicken-schnitzel-method | chicken schnitzel recipe |
| chicken-mince-weeknight-dinners | chicken mince recipes |
| how-to-cook-lamb-chops | how to cook lamb chops |
| homemade-burger-patty | burger patty recipe |
| lamb-ribs-low-and-slow | lamb ribs recipe |
| kangaroo-meat-buyers-guide | kangaroo meat |
| what-is-veal-how-to-cook-it | what is veal |
| beef-cuts-for-slow-cooking | slow cooker beef cuts |
| king-vs-tiger-vs-banana-prawns | king vs tiger prawns |
| how-much-meat-per-person | how much meat per person |
| buying-a-quarter-half-whole-beef | quarter beef share |
| raw-feeding-dogs-starter-guide | raw feeding for dogs |
| venison-and-game-meat-guide | how to cook venison |
| sausage-rolls-from-scratch | sausage roll recipe |
| australian-beef-cuts-explained | australian beef cuts |
| cold-chain-meat-delivery-explained | meat delivery |
| perfect-pork-crackling | pork crackling |
| how-to-roast-a-leg-of-lamb | how to roast a leg of lamb |
| corned-beef-silverside-guide | how to cook corned beef |
| nitrate-free-bacon-explained | nitrate free bacon |
| grass-fed-vs-grain-fed-beef | grass fed vs grain fed beef |
| bone-broth-from-beef-bones | bone broth from beef bones |
| christmas-ham-glaze-guide | christmas ham glaze |

## 7. Geo strategy

Hybrid. National AU is the primary target for head terms; the Sydney modifier is layered in only
where the exports show real "sydney" / "near me" volume (delivery, wholesale, live poultry,
christmas ham). No suburb pages.

## 8. Deferred / revisit (KD too high now, or volume unproven)

- `beef mince` head (KD high) — supported via subcategory + blog, not chased as a standalone.
- `wagyu` — hero mentions it; no page yet. Candidate for `/beef/wagyu/` if stock supports it.
- Deli / charcuterie (jerky, biltong, salami) — demand exists; category was deliberately removed. Not recommended unless the owner wants to restock.
