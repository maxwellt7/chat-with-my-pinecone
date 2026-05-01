import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runPipeline, getRunId } from './lib/pipeline.js';

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

  console.log(`\n🚀 Advertorial Pipeline`);
  console.log(`   Run ID:     ${runId}`);
  console.log(`   Reference:  ${args.reference}\n`);

  const { liveUrl, outputDir } = await runPipeline({
    copyContent,
    referenceUrl: args.reference,
    force: args.force
  });

  console.log(`\n✅ Done!`);
  console.log(`   Live URL: ${liveUrl}`);
  console.log(`   Output:   ${outputDir}\n`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
