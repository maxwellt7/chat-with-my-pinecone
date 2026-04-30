// run.js
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--copy') args.copy = argv[++i];
    else if (argv[i] === '--reference') args.reference = argv[++i];
    else if (argv[i] === '--force') args.force = true;
  }
  return args;
}

function validateEnv() {
  const missing = ['ANTHROPIC_API_KEY', 'GEMINI_API_KEY'].filter(k => !process.env[k]);
  if (missing.length) {
    console.error(`Missing env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

function getRunId(referenceUrl, copyContent) {
  return createHash('sha256')
    .update(referenceUrl + copyContent)
    .digest('hex')
    .slice(0, 8);
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.copy || !args.reference) {
    console.error('Usage: node run.js --copy <file.md> --reference <url>');
    process.exit(1);
  }

  validateEnv();

  const copyPath = resolve(args.copy);
  if (!existsSync(copyPath)) {
    console.error(`Copy file not found: ${copyPath}`);
    process.exit(1);
  }

  const copyContent = readFileSync(copyPath, 'utf8');
  const runId = getRunId(args.reference, copyContent);
  const outputDir = resolve(`output/${runId}`);

  mkdirSync(outputDir, { recursive: true });
  mkdirSync(`${outputDir}/advertorial_images`, { recursive: true });

  console.log(`\n🚀 Advertorial Pipeline`);
  console.log(`   Run ID:     ${runId}`);
  console.log(`   Output dir: ${outputDir}`);
  console.log(`   Reference:  ${args.reference}\n`);

  // Steps wired in Task 13
}

main().catch(err => { console.error(err.message); process.exit(1); });
