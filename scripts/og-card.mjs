// Generates public/og-card.png — the default 1200x630 social card.
// Run: node scripts/og-card.mjs
import sharp from 'sharp';
import path from 'path';

const W = 1200, H = 630;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1A1210"/>
      <stop offset="1" stop-color="#0D0A09"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="10" fill="#B91C1C"/>
  <rect x="0" y="${H - 10}" width="${W}" height="10" fill="#B91C1C"/>

  <text x="90" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="96" font-weight="700" fill="#F7F3EE" letter-spacing="1">MR MEAT &amp; CO</text>
  <text x="94" y="315" font-family="Georgia, serif" font-size="34" fill="#E4635F" letter-spacing="6">CRAFT BUTCHER · DIRECT TO DOOR</text>

  <text x="92" y="430" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#C9BEB4">100% Australian grass-fed beef, pasture-raised lamb, free-range</text>
  <text x="92" y="478" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#C9BEB4">poultry &amp; craft cuts — ground fresh daily in Alexandria, Sydney.</text>

  <text x="92" y="560" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#8A7F76">Cold-chain across NSW · frozen courier Australia-wide · mrmeatandco.com.au</text>
</svg>`;

const out = path.join(process.cwd(), 'public', 'og-card.png');
await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(out);
console.log('wrote', out);
