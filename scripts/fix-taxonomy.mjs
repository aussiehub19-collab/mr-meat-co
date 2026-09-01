/**
 * One-off: fix duplicate product slugs in src/config/site.ts.
 *
 * - Remove the cross-listed copies that duplicate a slug, keeping ONE canonical
 *   entry per slug (see KEEP map below).
 * - Rename the ready-to-cook "BBQ Beef Kebabs" entry (currently slug beef-kebabs)
 *   to bbq-beef-kebabs so it is a distinct product.
 */
import fs from 'fs';
import path from 'path';
import process from 'node:process';

const CONFIG = path.join(process.cwd(), 'src/config/site.ts');
let text = fs.readFileSync(CONFIG, 'utf8');

// slug -> the ONE (mainCategory/subcategory) we keep; all other createProduct
// calls with that slug are deleted.
const KEEP = {
  'beef-burger-patties': 'bbq-grill/Burgers',
  'beef-kebabs': 'bbq-grill/Skewers',
  'lamb-burger-patties': 'bbq-grill/Burgers',
  'lamb-skewers': 'bbq-grill/Skewers',
  'lamb-kofta-skewers': 'bbq-grill/Skewers',
  'lamb-ribs-for-bbq': 'bbq-grill/Ribs',
  'pork-spare-ribs': 'pork/Belly & Ribs',
};
// slug (with a specific category) -> new slug
const RENAME = [
  { slug: 'beef-kebabs', cat: 'ready-to-cook', sub: 'Kebabs', to: 'bbq-beef-kebabs' },
];

function parseBlocks(src) {
  const blocks = [];
  const re = /createProduct\(\s*/g;
  let m;
  while ((m = re.exec(src))) {
    const start = m.index;
    let depth = 0;
    let end = -1;
    for (let i = src.indexOf('(', start); i < src.length; i++) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')') {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    if (end === -1) continue;
    // include a trailing comma + newline if present
    let after = end + 1;
    const tail = src.slice(after, after + 3);
    const commaMatch = /^,\s*\n?/.exec(tail);
    if (commaMatch) after += commaMatch[0].length;
    const block = src.slice(start, end + 1);
    const strings = [...block.matchAll(/"([^"]*)"/g)].map((x) => x[1]);
    blocks.push({
      start,
      end: after,
      id: strings[0],
      name: strings[1],
      mainCategory: strings[2],
      subcategory: strings[3],
      slug: strings[4],
    });
  }
  return blocks;
}

let blocks = parseBlocks(text);

// --- rename pass (do before delete so indices from a fresh parse) ---
for (const r of RENAME) {
  const b = blocks.find(
    (x) => x.slug === r.slug && x.mainCategory === r.cat && x.subcategory === r.sub
  );
  if (!b) { console.log(`RENAME: not found ${r.slug} in ${r.cat}/${r.sub}`); continue; }
  const block = text.slice(b.start, b.end);
  // replace the 5th quoted string (slug) only
  let seen = 0;
  const newBlock = block.replace(/"([^"]*)"/g, (mm, val) => {
    seen++;
    return seen === 5 ? `"${r.to}"` : mm;
  });
  text = text.slice(0, b.start) + newBlock + text.slice(b.end);
  console.log(`RENAME: ${r.slug} [${r.cat}/${r.sub}] -> ${r.to}`);
}

// re-parse after rename (offsets shifted)
blocks = parseBlocks(text);

// --- delete pass: collect ranges of blocks to remove ---
const toDelete = [];
for (const b of blocks) {
  const keep = KEEP[b.slug];
  if (!keep) continue;
  const key = `${b.mainCategory}/${b.subcategory}`;
  if (key !== keep) {
    toDelete.push(b);
  }
}
// sort desc by start so slicing does not disturb earlier offsets
toDelete.sort((a, b) => b.start - a.start);
for (const b of toDelete) {
  console.log(`DELETE: ${b.slug} [${b.mainCategory}/${b.subcategory}] "${b.name}" (${b.id})`);
  text = text.slice(0, b.start) + text.slice(b.end);
}

fs.writeFileSync(CONFIG, text, 'utf8');
console.log(`\nremoved ${toDelete.length} duplicate product entries, renamed ${RENAME.length}`);
