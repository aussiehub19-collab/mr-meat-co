/**
 * One-off product/subcategory deletions in src/config/site.ts.
 * Edit DELETE_IF and SUBCAT_REMOVALS, run, commit.
 */
import fs from 'fs';
import path from 'path';
import process from 'node:process';

const CONFIG = path.join(process.cwd(), 'src/config/site.ts');
let text = fs.readFileSync(CONFIG, 'utf8');

const DELETE_IF = (b) =>
  (b.mainCategory === 'seafood' && b.subcategory === 'Value Packs') ||
  (b.mainCategory === 'pet-food' && b.subcategory === 'Pet Packs');

// [categorySlug, "Subcategory Name"] pairs to strip from CATEGORIES[].subcategories
const SUBCAT_REMOVALS = [
  ['seafood', 'Value Packs'],
  ['pet-food', 'Pet Packs'],
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
    let after = end + 1;
    const cm = /^,\s*\n?/.exec(src.slice(after, after + 4));
    if (cm) after += cm[0].length;
    const block = src.slice(start, end + 1);
    const s = [...block.matchAll(/"([^"]*)"/g)].map((x) => x[1]);
    blocks.push({ start, end: after, name: s[1], mainCategory: s[2], subcategory: s[3], slug: s[4] });
  }
  return blocks;
}

const del = parseBlocks(text).filter(DELETE_IF).sort((a, b) => b.start - a.start);
for (const b of del) {
  console.log(`DELETE ${b.slug.padEnd(26)} [${b.mainCategory}/${b.subcategory}] "${b.name}"`);
  text = text.slice(0, b.start) + text.slice(b.end);
}

for (const [slug, sub] of SUBCAT_REMOVALS) {
  const catRe = new RegExp(`(slug: "${slug}",[\\s\\S]*?subcategories: \\[)([^\\]]*)(\\])`);
  text = text.replace(catRe, (full, pre, list, post) => {
    const items = list
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x && x.replace(/"/g, '') !== sub);
    console.log(`SUBCAT  ${slug}: removed "${sub}" -> [${items.join(', ')}]`);
    return pre + items.join(', ') + post;
  });
}

fs.writeFileSync(CONFIG, text, 'utf8');
console.log(`\nremoved ${del.length} products`);
