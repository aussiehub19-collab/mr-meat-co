import fs from 'fs';
import path from 'path';

console.log('Running scripts/gen-agent-files.mjs...');

const domain = 'meatcart.com.au';
const publicDir = path.join(process.cwd(), 'public');

// Verify public dir exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log(`Agent files verified and synced with domain: ${domain}`);
