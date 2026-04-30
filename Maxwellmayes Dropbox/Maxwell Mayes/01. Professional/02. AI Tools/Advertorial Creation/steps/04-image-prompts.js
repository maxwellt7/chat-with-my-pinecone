// steps/04-image-prompts.js
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { callClaude, extractJson } from '../lib/claude.js';

const SYSTEM = `You are an expert at writing commercial image generation prompts and SVG icon design. Return ONLY valid JSON — no commentary, no markdown fences.`;

function buildPrompt(designSpec, copyMap) {
  const allSlots = copyMap.sections.flatMap(s => s.imageSlots);
  const colorPalette = Object.values(designSpec.colors).join(', ');

  return `Generate precise image prompts and inline SVGs for each image slot below.

Brand color palette: ${colorPalette}
Brand aesthetic: clean, trustworthy, health/wellness, warm and inviting

For each slot, return one of:
- Photo/lifestyle/portrait/infographic: { "id":"...", "type":"photo", "aspectRatio":"...", "prompt":"ultra-detailed commercial photography prompt", "negativePrompt":"blurry, text, watermark, cartoon", "outputFile":"advertorial_images/[id].jpg" }
- Icon/badge: { "id":"...", "type":"svg", "svgContent":"<svg ...complete inline SVG markup...>", "outputFile":null }

Rules:
- Photo prompts must be 20+ words, describing lighting, style, subject, mood
- SVG must be self-contained with xmlns, viewBox, width, height attributes
- Use brand colors in SVG elements where appropriate
- Wrap all slots in: { "slots": [...] }

Image slots to process:
${JSON.stringify(allSlots, null, 2)}`;
}

export async function runImagePrompts(designSpec, copyMap, outputDir) {
  const promptsPath = join(outputDir, 'image-prompts.json');
  if (existsSync(promptsPath)) {
    console.log('  [4] Image prompts: cached ✓');
    return JSON.parse(readFileSync(promptsPath, 'utf8'));
  }

  console.log('  [4] Image prompts: generating with Claude...');
  const rawResponse = await callClaude(SYSTEM, buildPrompt(designSpec, copyMap));
  const prompts = extractJson(rawResponse);

  writeFileSync(promptsPath, JSON.stringify(prompts, null, 2));
  console.log('  [4] Image prompts: done ✓');
  return prompts;
}
