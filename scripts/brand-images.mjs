/**
 * Hero + category image pipeline for Mr Meat & Co.
 * Processes the large client JPGs into optimised webp and drops them into
 * public/images/hero/ and public/images/categories/.
 *
 *   node scripts/brand-images.mjs
 */
import fs from 'fs';
import path from 'path';
import process from 'node:process';
import sharp from 'sharp';

const BASE = process.argv[2] || 'C:/Users/rtutc/Desktop/the meat cart/images';
const ROOT = process.cwd();
const HERO_SRC = path.join(BASE, 'hero images');
const CAT_SRC = path.join(BASE, 'shop by category');
const HERO_OUT = path.join(ROOT, 'public/images/hero');
const CAT_OUT = path.join(ROOT, 'public/images/categories');

fs.mkdirSync(HERO_OUT, { recursive: true });
fs.mkdirSync(CAT_OUT, { recursive: true });

async function encodeUnder(pipeline, budgetKB, startQ = 82) {
  let q = startQ;
  let buf = await pipeline.clone().webp({ quality: q }).toBuffer();
  while (buf.length > budgetKB * 1024 && q > 38) {
    q -= 6;
    buf = await pipeline.clone().webp({ quality: q }).toBuffer();
  }
  return { buf, q };
}

function writeRetry(file, buf) {
  for (let a = 0; ; a++) {
    try { fs.writeFileSync(file, buf); return; }
    catch (e) { if (a >= 4) throw e; }
  }
}

/* ---- hero: 16:9 cover, 1600x900 ---- */
const heroMap = { 'hero 1': 1, 'hero 2': 2, 'hero 3': 3, 'hero 4': 4 };
for (const f of fs.readdirSync(HERO_SRC)) {
  const key = path.basename(f).replace(/\.[^.]+$/, '').toLowerCase();
  if (!(key in heroMap)) continue;
  const p = sharp(path.join(HERO_SRC, f), { failOn: 'none' })
    .resize(1600, 900, { fit: 'cover', position: 'attention' })
    .sharpen({ sigma: 0.6 });
  const { buf, q } = await encodeUnder(p, 150);
  const out = path.join(HERO_OUT, `hero-${heroMap[key]}.webp`);
  writeRetry(out, buf);
  console.log(`hero-${heroMap[key]}.webp  q${q}  ${(buf.length / 1024).toFixed(0)}KB`);
}

/* ---- category: 4:3 cover, 900x675 ---- */
const catMap = {
  'beef': 'beef', 'chicken': 'chicken', 'lamb': 'lamb', 'pork': 'pork',
  'sausages': 'sausages', 'bbq': 'bbq-grill', 'meat boxes': 'meat-boxes',
  'ready tp cook': 'ready-to-cook', 'ready to cook': 'ready-to-cook',
  'specialty meat': 'specialty-meat',
  'seafood': 'seafood', 'pet food': 'pet-food',
};
for (const f of fs.readdirSync(CAT_SRC)) {
  const key = path.basename(f).replace(/\.[^.]+$/, '').toLowerCase();
  const slug = catMap[key];
  if (!slug) { console.log(`(skip unmapped category source: ${f})`); continue; }
  const p = sharp(path.join(CAT_SRC, f), { failOn: 'none' })
    .resize(800, 600, { fit: 'cover', position: 'attention' })
    .sharpen({ sigma: 0.6 });
  const { buf, q } = await encodeUnder(p, 65);
  const out = path.join(CAT_OUT, `${slug}.webp`);
  writeRetry(out, buf);
  console.log(`categories/${slug}.webp  q${q}  ${(buf.length / 1024).toFixed(0)}KB`);
}

console.log('done');
