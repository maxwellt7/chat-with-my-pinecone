// steps/03-html-generation.js
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { callClaude } from '../lib/claude.js';

const SYSTEM = `You are a senior frontend engineer specializing in direct-response landing pages. Generate complete, production-quality single-file HTML. Return ONLY the raw HTML starting with <!DOCTYPE html> — no markdown, no explanation, no code fences.`;

function stripHtmlFences(text) {
  return text.replace(/^\s*```(?:html)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

function buildPrompt(designSpec, copyMap) {
  const imageSlotList = copyMap.sections
    .flatMap(s => s.imageSlots.map(img => `- ${img.id} (${img.type}, ${img.aspectRatio})`))
    .join('\n');

  return `Generate a complete advertorial HTML page with these requirements:

1. Single file, starts with <!DOCTYPE html>
2. Uses Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Defines CSS custom properties in :root for ALL design tokens from the spec
4. Uses the exact colors, fonts, spacing, border-radius values from the design spec
5. Contains every section and piece of copy from the content map — NO placeholder text
6. For photo/lifestyle/portrait/infographic image slots: <img src="GENERATE:[slot-id]" alt="[context]" class="w-full" />
7. For icon/badge image slots: <!-- GENERATE_SVG:[slot-id] -->
8. Fully responsive (mobile-first Tailwind classes)
9. Smooth fade-in on scroll using IntersectionObserver (inline <script> at bottom)
10. Hover/active states on all CTA buttons

Design specification:
${JSON.stringify(designSpec, null, 2)}

Content map (use ALL sections and copy exactly as written):
${JSON.stringify(copyMap, null, 2)}

Image slot IDs MUST exactly match these slot IDs from the content map:
${imageSlotList}`;
}

export async function runHtmlGeneration(designSpec, copyMap, outputDir) {
  const htmlPath = join(outputDir, 'advertorial.html');
  if (existsSync(htmlPath)) {
    console.log('  [3] HTML generation: cached ✓');
    return readFileSync(htmlPath, 'utf8');
  }

  console.log('  [3] HTML generation: generating with Claude (this may take 60s)...');
  const rawResponse = await callClaude(SYSTEM, buildPrompt(designSpec, copyMap), 16000);
  const html = stripHtmlFences(rawResponse);

  writeFileSync(htmlPath, html);
  console.log('  [3] HTML generation: done ✓');
  return html;
}
