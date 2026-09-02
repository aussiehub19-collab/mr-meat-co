// Generates public/images/logo.png — the Organization/publisher logo used in
// BlogPosting + Organization JSON-LD (Google requires an accessible raster logo).
// Run: node scripts/brand-logo.mjs
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync(path.join(process.cwd(), 'public', 'icon.svg'), 'utf8');

// 512x512, badge centred on a white ground (Google renders it in a light box).
const W = 512;
const badge = await sharp(Buffer.from(src)).resize(360, 360).png().toBuffer();
const out = path.join(process.cwd(), 'public', 'images', 'logo.png');

await sharp({
  create: { width: W, height: W, channels: 4, background: '#ffffff' },
})
  .composite([{ input: badge, top: (W - 360) / 2, left: (W - 360) / 2 }])
  .png()
  .toFile(out);

console.log('wrote', out);
