import fs from 'fs';
import path from 'path';

console.log('=== PRE-SHIP CROSSCHECK SCANNER (WebForge v9.1) ===');

let failures = 0;

function checkFileExists(relPath) {
  const fullPath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Required file missing: ${relPath}`);
    failures++;
    return false;
  }
  return true;
}

// B6: Check Agent files A-N
const agentFiles = [
  'public/robots.txt',
  'public/llms.txt',
  'public/auth.md',
  'public/.well-known/api-catalog',
  'public/.well-known/agent-skills/index.json',
  'public/.well-known/mcp/server-card.json',
  'public/.well-known/oauth-protected-resource',
  'public/.well-known/oauth-authorization-server',
  'public/.well-known/openid-configuration',
  'public/.well-known/acp.json',
  'public/.well-known/ucp',
  'public/js/webmcp.js',
];

console.log('Checking Agent-Ready files A-N...');
for (const file of agentFiles) {
  checkFileExists(file);
}

// Check UCP "ucp": "1.0" requirement
try {
  const ucpContent = fs.readFileSync(path.join(process.cwd(), 'public/.well-known/ucp'), 'utf8');
  const ucpJson = JSON.parse(ucpContent);
  if (ucpJson.ucp !== '1.0') {
    console.error('[FAIL] public/.well-known/ucp missing mandatory "ucp": "1.0" field!');
    failures++;
  } else {
    console.log('[PASS] public/.well-known/ucp has valid "ucp": "1.0" field.');
  }
} catch (e) {
  console.error('[FAIL] Failed to parse public/.well-known/ucp JSON:', e.message);
  failures++;
}

// Check Auth.md heading requirement
try {
  const authContent = fs.readFileSync(path.join(process.cwd(), 'public/auth.md'), 'utf8');
  if (!authContent.startsWith('# Auth.md')) {
    console.error('[FAIL] public/auth.md must start with exactly "# Auth.md" as first line!');
    failures++;
  } else {
    console.log('[PASS] public/auth.md has correct "# Auth.md" header.');
  }
} catch (e) {
  console.error('[FAIL] Failed to read public/auth.md:', e.message);
  failures++;
}

// Check compliance banned terms across source files
const bannedTerms = ['preservative 223', 'nitrogen flushing', 'water pumping', 'synthetic binders'];
console.log('Scanning codebase for compliance banned terms...');

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      scanDirectory(fullPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?|json|md|txt)$/.test(entry.name)) {
      if (fullPath.includes('CLAUDE.md') || fullPath.includes('crosscheck.mjs')) continue;
      const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
      for (const banned of bannedTerms) {
        if (content.includes(banned)) {
          console.error(`[FAIL - B7 Compliance] Banned term "${banned}" found in ${fullPath}`);
          failures++;
        }
      }
    }
  }
}

scanDirectory(path.join(process.cwd(), 'app'));
scanDirectory(path.join(process.cwd(), 'src'));

if (failures > 0) {
  console.error(`\n❌ CROSSCHECK FAILED with ${failures} error(s). Fix issues before shipping.`);
  process.exit(1);
} else {
  console.log('\n✅ ALL PRE-SHIP CROSSCHECK CHECKS PASSED PERFECTLY!');
  process.exit(0);
}
