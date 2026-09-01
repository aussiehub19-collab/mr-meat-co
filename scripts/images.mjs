/**
 * Product image pipeline for Mr Meat & Co.
 *
 * Source: an external folder of client product photos, organised
 *   <category>/<subcategory>/<Product Name>.<ext>
 * Output: public/images/<slug>.webp  — trimmed, centred on a white 4:3
 *   1600x1200 canvas, product filling ~90% of the frame, adaptive quality.
 *
 * Also rewrites the mainImage URL argument of each matched createProduct(...)
 * call in src/config/site.ts to "/images/<slug>.webp".
 *
 * Usage:
 *   node scripts/images.mjs "C:/Users/rtutc/Desktop/the meat cart/images/product images"
 *   node scripts/images.mjs            (uses DEFAULT_SOURCE below)
 */
import fs from 'fs';
import path from 'path';
import process from 'node:process';
import sharp from 'sharp';

const DEFAULT_SOURCE =
  'C:/Users/rtutc/Desktop/the meat cart/images/product images';

const SRC = process.argv[2] || DEFAULT_SOURCE;
const ROOT = process.cwd();
const CONFIG = path.join(ROOT, 'src/config/site.ts');
const OUT_DIR = path.join(ROOT, 'public/images');
// Kept deliberately modest: these files are served straight from the CDN
// (unoptimized) so the on-disk size IS the delivered size. 1200px wide is
// ~2x the largest slot they render in (the ~600px PDP image).
const CANVAS_W = 1200;
const CANVAS_H = 900;
const INNER_W = 1080; // ~90%
const INNER_H = 810;
const SIZE_BUDGET = 78 * 1024;
const EXT_RE = /\.(jpe?g|png|webp|avif|tiff?)$/i;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/* ---------- 1. collect source images ---------- */
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (EXT_RE.test(entry.name)) out.push(full);
  }
  return out;
}

if (!fs.existsSync(SRC)) {
  console.error(`[images] source folder not found: ${SRC}`);
  process.exit(1);
}
const sources = walk(SRC);
// strip trailing photo-descriptor words a client sometimes appends to a filename
const cleanBase = (s) =>
  s
    .replace(EXT_RE, '')
    .replace(/\b(raw|cooked)?\s*white background$/i, '')
    .replace(/\s+raw$/i, '')
    .trim();
const byName = new Map(); // normalised basename -> filepath (first wins)
for (const f of sources) {
  const base = path.basename(f);
  const variants = [
    norm(base.replace(EXT_RE, '')),
    norm(cleanBase(base)),
    // "full X share" and "whole X share" are used interchangeably by the client
    norm(cleanBase(base).replace(/\bfull\b/i, 'whole')),
  ];
  for (const key of variants) {
    if (key && !byName.has(key)) byName.set(key, f);
  }
}
console.log(`[images] ${sources.length} source files, ${byName.size} unique names`);

/* ---------- 2. parse products from site.ts ---------- */
const configText = fs.readFileSync(CONFIG, 'utf8');
const products = []; // { name, slug, blockStart, blockEnd }
const callRe = /createProduct\(\s*/g;
let m;
while ((m = callRe.exec(configText))) {
  const start = m.index;
  // find matching close paren
  let depth = 0;
  let i = configText.indexOf('(', start);
  let end = -1;
  for (; i < configText.length; i++) {
    const c = configText[i];
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) continue;
  const block = configText.slice(start, end + 1);
  const strings = [...block.matchAll(/"([^"]*)"/g)].map((x) => x[1]);
  // [id, name, mainCategory, subcategory, slug, ...]
  if (strings.length < 5) continue;
  products.push({ name: strings[1], slug: strings[4], start, end });
}
console.log(`[images] ${products.length} products parsed`);

/* ---------- 3. process + match ---------- */
fs.mkdirSync(OUT_DIR, { recursive: true });

async function processImage(srcFile, slug) {
  const input = sharp(srcFile, { failOn: 'none' }).flatten({ background: '#ffffff' });
  const meta = await input.metadata();
  const origW = meta.width || CANVAS_W;
  const origH = meta.height || CANVAS_H;

  let baseBuf;
  try {
    const trimmed = await input
      .clone()
      .trim({ threshold: 12 })
      .toBuffer({ resolveWithObject: true });
    if (
      trimmed.info.width >= origW * 0.12 &&
      trimmed.info.height >= origH * 0.12
    ) {
      baseBuf = trimmed.data;
    }
  } catch {
    /* trim can throw on uniform images — fall through */
  }
  if (!baseBuf) baseBuf = await input.toBuffer();

  // fit inside the inner box, enlarging small sources
  let fitted = await sharp(baseBuf)
    .resize(INNER_W, INNER_H, {
      fit: 'inside',
      kernel: 'lanczos3',
      withoutEnlargement: false,
    })
    .toBuffer({ resolveWithObject: true });

  const upscaled = fitted.info.width > (await sharp(baseBuf).metadata()).width * 1.1;
  if (upscaled) {
    fitted = await sharp(fitted.data).sharpen({ sigma: 1 }).toBuffer({ resolveWithObject: true });
  }

  const { width, height } = fitted.info;
  const left = Math.floor((CANVAS_W - width) / 2);
  const top = Math.floor((CANVAS_H - height) / 2);
  const canvas = sharp(fitted.data).extend({
    top,
    bottom: CANVAS_H - height - top,
    left,
    right: CANVAS_W - width - left,
    background: '#ffffff',
  });

  let q = 82;
  let buf = await canvas.clone().webp({ quality: q }).toBuffer();
  while (buf.length > SIZE_BUDGET && q > 40) {
    q -= 6;
    buf = await canvas.clone().webp({ quality: q }).toBuffer();
  }

  const outPath = path.join(OUT_DIR, `${slug}.webp`);
  for (let attempt = 0; ; attempt++) {
    try {
      fs.writeFileSync(outPath, buf);
      break;
    } catch (e) {
      if (attempt >= 4) throw e;
      await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
    }
  }
  return { q, kb: Math.round(buf.length / 1024), small: Math.min(origW, origH) < 500 };
}

const matched = [];
const unmatched = [];
const usedKeys = new Set();
const reshoot = [];

for (const p of products) {
  // slug first (more specific — disambiguates e.g. whole-beef-share-250kg),
  // then fall back to the display name
  const key = byName.has(norm(p.slug))
    ? norm(p.slug)
    : byName.has(norm(p.name))
    ? norm(p.name)
    : null;
  if (!key) {
    unmatched.push(p);
    continue;
  }
  usedKeys.add(key);
  try {
    const r = await processImage(byName.get(key), p.slug);
    matched.push({ slug: p.slug, ...r });
    if (r.small) reshoot.push(p.name);
    process.stdout.write('.');
  } catch (e) {
    console.error(`\n[images] FAILED ${p.slug}: ${e.message}`);
    unmatched.push(p);
  }
}
process.stdout.write('\n');

/* ---------- 4. rewrite site.ts ---------- */
const matchedSlugs = new Set(matched.map((x) => x.slug));
let outText = '';
let cursor = 0;
for (const p of products) {
  if (!matchedSlugs.has(p.slug)) continue;
  const block = configText.slice(p.start, p.end + 1);
  const replaced = block.replace(
    /"https?:\/\/[^"]+"/,
    `"/images/${p.slug}.webp"`
  );
  if (replaced === block) continue; // no URL literal present
  outText += configText.slice(cursor, p.start) + replaced;
  cursor = p.end + 1;
}
outText += configText.slice(cursor);
fs.writeFileSync(CONFIG, outText, 'utf8');

/* ---------- 5. report ---------- */
const unused = [...byName.keys()].filter((k) => !usedKeys.has(k));
console.log(`\n=== IMAGE PIPELINE REPORT ===`);
console.log(`matched + processed : ${matched.length}`);
console.log(`products unmatched  : ${unmatched.length}  (kept existing placeholder)`);
console.log(`source images unused: ${unused.length}`);
if (reshoot.length)
  console.log(`\nlow-res (reshoot candidates, <500px short side):\n  ${reshoot.join('\n  ')}`);
console.log(`\nunused source names:\n  ${unused.join('\n  ') || '(none)'}`);
console.log(`\nunmatched products:\n  ${unmatched.map((p) => `${p.name}  [${p.slug}]`).join('\n  ') || '(none)'}`);
