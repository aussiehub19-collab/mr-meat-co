/**
 * One-off: delete the deli-cured category + all its products, and the
 * Stir-Fry subcategory under ready-to-cook + its products.
 */
import fs from 'fs';
import path from 'path';
import process from 'node:process';

const CONFIG = path.join(process.cwd(), 'src/config/site.ts');
let text = fs.readFileSync(CONFIG, 'utf8');

const shouldDelete = (b) =>
  b.mainCategory === 'deli-cured' ||
  (b.mainCategory === 'ready-to-cook' && b.subcategory === 'Stir-Fry');

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
    let after = end + 1;
    const commaMatch = /^,\s*\n?/.exec(src.slice(after, after + 4));
    if (commaMatch) after += commaMatch[0].length;
    const block = src.slice(start, end + 1);
    const strings = [...block.matchAll(/"([^"]*)"/g)].map((x) => x[1]);
    blocks.push({
      start,
      end: after,
      name: strings[1],
      mainCategory: strings[2],
      subcategory: strings[3],
      slug: strings[4],
    });
  }
  return blocks;
}

const blocks = parseBlocks(text);
const toDelete = blocks.filter(shouldDelete).sort((a, b) => b.start - a.start);
for (const b of toDelete) {
  console.log(`DELETE ${b.slug.padEnd(26)} [${b.mainCategory}/${b.subcategory}] "${b.name}"`);
  text = text.slice(0, b.start) + text.slice(b.end);
}

// --- CATEGORIES edits ---
// 1. drop the whole deli-cured category object
text = text.replace(
  /\s*\{\s*slug: "deli-cured",[\s\S]*?image: "\/images\/categories\/deli-cured\.webp",\s*\},/,
  ''
);
// 2. remove Stir-Fry from ready-to-cook subcategories
text = text.replace(
  '["Schnitzels", "Marinated Cuts", "Kebabs", "Burger Patties", "Stir-Fry"]',
  '["Schnitzels", "Marinated Cuts", "Kebabs", "Burger Patties"]'
);
// 3. tidy ready-to-cook description
text = text.replace(
  'chicken schnitzels, crumbed steak, marinated chicken, kebabs, patties, and stir-fry.',
  'chicken schnitzels, crumbed steak, marinated cuts, kebabs, and burger patties.'
);

fs.writeFileSync(CONFIG, text, 'utf8');
console.log(`\nremoved ${toDelete.length} products + deli-cured category + Stir-Fry subcategory`);
