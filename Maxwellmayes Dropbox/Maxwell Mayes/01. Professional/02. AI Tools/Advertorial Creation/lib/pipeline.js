import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createState } from './state.js';
import { runDesignForensics } from '../steps/01-design-forensics.js';
import { runCopyMapping } from '../steps/02-copy-mapping.js';
import { runHtmlGeneration } from '../steps/03-html-generation.js';
import { runImagePrompts } from '../steps/04-image-prompts.js';
import { runImageGeneration } from '../steps/05-image-generation.js';
import { runAssembly } from '../steps/06-assembly.js';
import { runDeployment } from '../steps/07-deployment.js';

export function getRunId(referenceUrl, copyContent) {
  return createHash('sha256')
    .update(referenceUrl + copyContent)
    .digest('hex')
    .slice(0, 8);
}

export async function runPipeline({ copyContent, referenceUrl, force = false, onStep = () => {} }) {
  const runId = getRunId(referenceUrl, copyContent);
  const outputDir = resolve(`output/${runId}`);

  mkdirSync(outputDir, { recursive: true });
  mkdirSync(`${outputDir}/advertorial_images`, { recursive: true });

  const state = createState(outputDir);

  if (force) {
    ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'].forEach(s => state.clearStep(s));
  }

  // Step 1
  onStep(1, 'Design Forensics');
  const designSpec = state.isStepDone('step1')
    ? state.getStepData('step1')
    : await runDesignForensics(referenceUrl, outputDir);
  if (!state.isStepDone('step1')) {
    if (!designSpec) throw new Error('Step 1 returned no design spec');
    state.markStepDone('step1', designSpec);
  }

  // Step 2
  onStep(2, 'Copy Mapping');
  const copyMap = state.isStepDone('step2')
    ? state.getStepData('step2')
    : await runCopyMapping(copyContent, designSpec, outputDir);
  if (!state.isStepDone('step2')) {
    if (!copyMap) throw new Error('Step 2 returned no copy map');
    state.markStepDone('step2', copyMap);
  }

  // Step 3
  onStep(3, 'HTML Generation');
  if (!state.isStepDone('step3')) {
    await runHtmlGeneration(designSpec, copyMap, outputDir);
    state.markStepDone('step3', { generated: true });
  } else {
    console.log('  [3] HTML generation: cached ✓');
  }

  // Step 4
  onStep(4, 'Image Prompts');
  const imagePrompts = state.isStepDone('step4')
    ? state.getStepData('step4')
    : await runImagePrompts(designSpec, copyMap, outputDir);
  if (!state.isStepDone('step4')) {
    if (!imagePrompts) throw new Error('Step 4 returned no image prompts');
    state.markStepDone('step4', imagePrompts);
  }

  // Step 5
  onStep(5, 'Image Generation');
  if (!state.isStepDone('step5')) {
    await runImageGeneration(imagePrompts, outputDir);
    state.markStepDone('step5', { generated: true });
  } else {
    console.log('  [5] Image generation: cached ✓');
  }

  // Step 6
  onStep(6, 'Assembly');
  const currentHtml = readFileSync(`${outputDir}/advertorial.html`, 'utf8');
  await runAssembly(currentHtml, imagePrompts, outputDir);
  state.markStepDone('step6', { assembled: true });

  // Step 7
  onStep(7, 'Deployment');
  let liveUrl;
  if (state.isStepDone('step7')) {
    liveUrl = state.getStepData('step7').url;
    console.log(`  [7] Deployment: cached ✓ → ${liveUrl}`);
  } else {
    liveUrl = await runDeployment(outputDir, runId);
    state.markStepDone('step7', { url: liveUrl });
  }

  return { liveUrl, outputDir, runId };
}
