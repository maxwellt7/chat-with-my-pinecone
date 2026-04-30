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

  const { createState } = await import('./lib/state.js');
  const { runDesignForensics } = await import('./steps/01-design-forensics.js');
  const { runCopyMapping } = await import('./steps/02-copy-mapping.js');
  const { runHtmlGeneration } = await import('./steps/03-html-generation.js');
  const { runImagePrompts } = await import('./steps/04-image-prompts.js');
  const { runImageGeneration } = await import('./steps/05-image-generation.js');
  const { runAssembly } = await import('./steps/06-assembly.js');
  const { runDeployment } = await import('./steps/07-deployment.js');

  const state = createState(outputDir);

  if (args.force) {
    console.log('  --force: clearing all cached state\n');
    ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'].forEach(s => state.clearStep(s));
  }

  // Step 1
  const designSpec = state.isStepDone('step1')
    ? state.getStepData('step1')
    : await runDesignForensics(args.reference, outputDir);
  if (!state.isStepDone('step1')) state.markStepDone('step1', designSpec);

  // Step 2
  const copyMap = state.isStepDone('step2')
    ? state.getStepData('step2')
    : await runCopyMapping(copyContent, designSpec, outputDir);
  if (!state.isStepDone('step2')) state.markStepDone('step2', copyMap);

  // Step 3
  const html = state.isStepDone('step3')
    ? await import('node:fs').then(fs => fs.readFileSync(`${outputDir}/advertorial.html`, 'utf8'))
    : await runHtmlGeneration(designSpec, copyMap, outputDir);
  if (!state.isStepDone('step3')) state.markStepDone('step3', { generated: true });

  // Step 4
  const imagePrompts = state.isStepDone('step4')
    ? state.getStepData('step4')
    : await runImagePrompts(designSpec, copyMap, outputDir);
  if (!state.isStepDone('step4')) state.markStepDone('step4', imagePrompts);

  // Step 5 — always run (imagen.js skips already-generated files internally)
  if (!state.isStepDone('step5')) {
    await runImageGeneration(imagePrompts, outputDir);
    state.markStepDone('step5', { generated: true });
  } else {
    console.log('  [5] Image generation: cached ✓');
  }

  // Step 6 — always re-run (idempotent, fast, picks up any newly generated images)
  const { readFileSync } = await import('node:fs');
  const currentHtml = readFileSync(`${outputDir}/advertorial.html`, 'utf8');
  await runAssembly(currentHtml, imagePrompts, outputDir);

  // Step 7
  let liveUrl;
  if (state.isStepDone('step7')) {
    liveUrl = state.getStepData('step7').url;
    console.log(`  [7] Deployment: cached ✓ → ${liveUrl}`);
  } else {
    liveUrl = await runDeployment(outputDir, runId);
    state.markStepDone('step7', { url: liveUrl });
  }

  console.log(`\n✅ Done!`);
  console.log(`   Live URL: ${liveUrl}`);
  console.log(`   Output:   ${outputDir}\n`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
