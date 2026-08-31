import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const DIR = path.join(process.cwd(), 'public/images');
const OUT = process.argv[2] || path.join(process.cwd(), 'docs/_contact-sheet.png');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.webp')).sort();

const THUMB = 200;
const COLS = 10;
const rows = Math.ceil(files.length / COLS);
const W = COLS * THUMB;
const H = rows * THUMB;

const composites = [];
for (let i = 0; i < files.length; i++) {
  const buf = await sharp(path.join(DIR, files[i]))
    .resize(THUMB, THUMB, { fit: 'contain', background: '#ffffff' })
    .toBuffer();
  composites.push({
    input: buf,
    left: (i % COLS) * THUMB,
    top: Math.floor(i / COLS) * THUMB,
  });
}

await sharp({
  create: { width: W, height: H, channels: 3, background: '#e5e5e5' },
})
  .composite(composites)
  .png()
  .toFile(OUT);

console.log(`contact sheet: ${OUT}  (${files.length} images, ${COLS}x${rows})`);
