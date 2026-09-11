# PRODUCT / CATEGORY GAPS — MR MEAT & CO

> Internal. Status of the gaps identified from the Semrush exports.

## Built in this pass (owner-approved)

| Gap | What was added | Where |
|---|---|---|
| **Rabbit** | `Rabbit` subcategory + 3 products (Whole Rabbit, Rabbit Portions Jointed, Rabbit Loin Fillets) | `specialty-meat` › Rabbit; `/specialty-meat/rabbit/` PAGE_SEO |
| **Crocodile** | 2 products (Crocodile Tail Fillet, Crocodile Boneless Portions) | `specialty-meat` › Game |
| **Emu** | 2 products (Emu Fillet, Emu Mince) | `specialty-meat` › Game |
| **Christmas ham** | 3 SKUs (Whole Bone-In, Half Leg, Boneless — all `Pre-Order`, `from_price`) + seasonal landing page | `pork` › Bacon & Ham; `/christmas-ham/` page + PAGE_SEO + Nav link + blog #25 |
| **Bone broth / stock bones (human-grade)** | `Bones & Broth` subcategory on beef and pork. Beef: Marrow Bones (moved from Offal), Knuckle & Joint, Meaty Shin. Pork: Neck Bones, Split Trotters | `/beef/bones-broth/`, `/pork/bones-broth/` PAGE_SEO + blog #24 |
| **Live poultry** (owner: "will stock live chickens") | New `live-poultry` category, 4 subcats (Laying Hens, Pullets, Meat Birds, Bantams), 5 products. Pickup / local-delivery only, welfare notice, `Seasonal` stock, excluded from cold-chain delivery | `/live-poultry/` + 4 subcat PAGE_SEO entries; custom render branch in `app/[category]/page.tsx`; llms.txt |
| **Wagyu** (owner confirmed genuine F1 Wagyu sourcing, 2026-09-11) | Hero copy claimed "Wagyu & Dry-Aged Steaks" with zero Wagyu SKUs on site. New `Wagyu` subcategory under Beef — scotch fillet $79.99/kg, porterhouse $69.99/kg, rump $49.99/kg, mince $26.99/kg (AU market-reference pricing — owner to confirm against real supplier cost); plus a `Bulk Wagyu` wholesale subcategory (mince carton + whole rump). | `/beef/wagyu/` + PAGE_SEO; `/wholesale/bulk-meat-orders/bulk-wagyu/` + PAGE_SEO; `what-is-wagyu-beef` blog post; 6 new PRODUCTS entries |
| **Angus** (owner confirmed beef is genuinely Angus/Angus-cross, 2026-09-11) | Site made no breed claims despite the beef being Angus. No new SKUs — same cattle as existing beef range. | `/beef/` intro + FAQ + supporting keyword; `wholesale/bulk-meat-orders/bulk-beef/` copy; `what-is-angus-beef` blog post |

## Demand noted, NOT actioned

| Item | Reason |
|---|---|
| **Deli / charcuterie** (jerky, biltong, salami, kabana) | Category was deliberately deleted earlier. Real demand exists (~6k combined) but out of current scope. Flag only. |
| **Marrow bones for roasting (standalone)** | Now covered under `/beef/bones-broth/`. |
| **Barramundi / snapper "for sale"** | Volume is mostly recreational-fishing intent. Existing seafood pages are enough. |

## Decisions recorded

- **Halal**: not halal — do not mention halal anywhere. (Owner.)
- **Geo**: hybrid — national AU primary, Sydney modifier only where volume exists. (Owner.)
- **Product pages**: template + bespoke hybrid. Bespoke SEO for hub/category/bespoke-subcategory
  pages via `PAGE_SEO`; the ~230 standard products use the generated title/description from
  `createProduct()` plus their own on-page copy.
- **Keyword threshold**: transactional/commercial terms kept at volume ≥ 20, KD < 15, plus head
  terms and Google related searches.
