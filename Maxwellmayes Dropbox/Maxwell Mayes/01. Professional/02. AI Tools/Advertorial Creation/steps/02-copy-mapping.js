// steps/02-copy-mapping.js
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { callClaude, extractJson } from '../lib/claude.js';

const SYSTEM = `You are a content strategist mapping marketing copy to webpage sections. Return ONLY valid JSON — no commentary, no markdown fences.`;

function buildPrompt(markdownContent, designSpec) {
  return `Map this markdown advertorial brief to the page sections defined in the design spec.

Design sections available: ${JSON.stringify(designSpec.sections)}
Design layout: ${designSpec.layoutPattern}

For each section of copy, identify:
1. Which design section it maps to
2. The exact content (headline, subheadline, body paragraphs, bullets, CTA, testimonials, stats)
3. What images are needed and where

Image slot types: hero (16:9), lifestyle (16:9 or 4:3), portrait (1:1 or 3:4), infographic (4:3), icon (1:1), badge (1:1)
Image slot IDs must be lowercase kebab-case, unique, and descriptive (e.g., "hero-main", "testimonial-mary-photo").

Return this exact schema:
{
  "sections": [
    {
      "id": "section-id",
      "designSection": "matching design section name",
      "headline": "...",
      "subheadline": "...",
      "body": ["paragraph 1", "paragraph 2"],
      "bullets": ["item 1", "item 2"],
      "cta": { "text": "...", "subtext": "..." } or null,
      "testimonials": [{ "quote": "...", "author": "...", "rating": 5 }],
      "stats": [{ "value": "...", "label": "..." }],
      "imageSlots": [
        {
          "id": "unique-kebab-id",
          "type": "hero|lifestyle|portrait|infographic|icon|badge",
          "aspectRatio": "16:9|4:3|3:4|1:1",
          "context": "what this image should depict",
          "placement": "where on the page"
        }
      ]
    }
  ]
}

Markdown brief:
${markdownContent}`;
}

export async function runCopyMapping(markdownContent, designSpec, outputDir) {
  const mapPath = join(outputDir, 'copy-map.json');
  if (existsSync(mapPath)) {
    console.log('  [2] Copy mapping: cached ✓');
    return JSON.parse(readFileSync(mapPath, 'utf8'));
  }

  console.log('  [2] Copy mapping: analyzing with Claude...');
  const rawResponse = await callClaude(SYSTEM, buildPrompt(markdownContent, designSpec));
  const copyMap = extractJson(rawResponse);

  writeFileSync(mapPath, JSON.stringify(copyMap, null, 2));
  console.log('  [2] Copy mapping: done ✓');
  return copyMap;
}
