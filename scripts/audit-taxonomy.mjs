import process from 'node:process';
const m = await import('../src/config/site.ts');
const { CATEGORIES, PRODUCTS } = m;

const slugify = (s) =>
  s.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-');

const catBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));
const validCatSlugs = new Set(CATEGORIES.map((c) => c.slug));

// special main_category values that are intentionally not in CATEGORIES
const SPECIAL = new Set(['wholesale']);

console.log(`CATEGORIES (${CATEGORIES.length}):`);
for (const c of CATEGORIES) console.log(`  ${c.slug.padEnd(16)} subs: ${c.subcategories.join(' | ')}`);

console.log(`\nPRODUCTS: ${PRODUCTS.length}`);

// 1. main_category distribution
const byCat = {};
for (const p of PRODUCTS) byCat[p.main_category] = (byCat[p.main_category] || 0) + 1;
console.log('\nmain_category counts:');
for (const [k, v] of Object.entries(byCat).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(k).padEnd(18)} ${v}${validCatSlugs.has(k) || SPECIAL.has(k) ? '' : '   <-- NOT A VALID CATEGORY'}`);

// 2. bad main_category
const badCat = PRODUCTS.filter((p) => !validCatSlugs.has(p.main_category) && !SPECIAL.has(p.main_category));
console.log(`\n[A] products with invalid main_category: ${badCat.length}`);
for (const p of badCat) console.log(`  ${p.slug}  main_category="${p.main_category}"`);

// 3. subcategory not in the category's canonical list (exact, case-insensitive) -> breaks ShopFilterClient
console.log(`\n[B] subcategory NOT matching category's canonical list (breaks shop filter dropdown):`);
let bCount = 0;
const bBySuggestion = [];
for (const p of PRODUCTS) {
  if (SPECIAL.has(p.main_category)) continue;
  const cat = catBySlug.get(p.main_category);
  if (!cat) continue;
  const canon = cat.subcategories;
  const exact = canon.find((s) => s.toLowerCase() === (p.subcategory || '').toLowerCase());
  if (exact) continue;
  bCount++;
  // best guess: slug match, or startsWith, or word overlap
  const bySlug = canon.find((s) => slugify(s) === slugify(p.subcategory || ''));
  const byContains = canon.find(
    (s) =>
      s.toLowerCase().includes((p.subcategory || '').toLowerCase()) ||
      (p.subcategory || '').toLowerCase().includes(s.toLowerCase())
  );
  const guess = bySlug || byContains || '???';
  bBySuggestion.push({ slug: p.slug, cat: p.main_category, have: p.subcategory, want: guess });
}
console.log(`  total: ${bCount}`);
for (const r of bBySuggestion)
  console.log(`  [${r.cat}] ${r.slug.padEnd(40)} have="${r.have}"  ->  "${r.want}"`);

// 4. subcategory-slug round trip: does product resolve on /[category]/[subcategory]/ page?
console.log(`\n[C] products that would NOT appear on their own /[category]/[subcategory]/ page:`);
let cCount = 0;
for (const p of PRODUCTS) {
  if (SPECIAL.has(p.main_category)) continue;
  const cat = catBySlug.get(p.main_category);
  if (!cat) continue;
  const targetSubSlugs = cat.subcategories.map(slugify);
  const pSubSlug = slugify(p.subcategory || '');
  const matchPrimary = targetSubSlugs.includes(pSubSlug);
  const matchSecondary = (p.secondary_subcategories || []).some((s) => targetSubSlugs.includes(slugify(s)));
  const matchCollection = (p.collections || []).some((c) =>
    targetSubSlugs.some((ts) => slugify(c).includes(ts))
  );
  if (!matchPrimary && !matchSecondary && !matchCollection) {
    cCount++;
    console.log(`  [${p.main_category}] ${p.slug.padEnd(40)} sub="${p.subcategory}" (slug "${pSubSlug}" not in [${targetSubSlugs.join(', ')}])`);
  }
}
console.log(`  total: ${cCount}`);

// 5. duplicate slugs -> product detail route collisions
console.log(`\n[D] duplicate product slugs (break product detail routing):`);
const bySlug = {};
for (const p of PRODUCTS) (bySlug[p.slug] ||= []).push(p);
let dCount = 0;
for (const [s, arr] of Object.entries(bySlug)) {
  if (arr.length > 1) {
    dCount++;
    console.log(`  "${s}" x${arr.length}: ${arr.map((p) => `${p.product_name} [${p.main_category}/${p.subcategory}]`).join('  ||  ')}`);
  }
}
console.log(`  total dup slugs: ${dCount}`);

// 6. unused canonical subcategories (a filter option that returns nothing)
console.log(`\n[E] canonical subcategories with ZERO products (empty filter options):`);
for (const cat of CATEGORIES) {
  for (const sub of cat.subcategories) {
    const n = PRODUCTS.filter(
      (p) => p.main_category === cat.slug && (p.subcategory || '').toLowerCase() === sub.toLowerCase()
    ).length;
    if (n === 0) console.log(`  [${cat.slug}] "${sub}"  (0 products)`);
  }
}

console.log('\ndone');
