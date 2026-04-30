// steps/01-design-forensics.js
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fetchPageHtml, truncateHtml } from '../lib/scraper.js';
import { callClaude, extractJson } from '../lib/claude.js';

const SYSTEM = `You are a CSS and design systems analyst. Analyze an HTML page and extract a complete design specification. Return ONLY valid JSON — no commentary, no markdown fences.`;

function buildPrompt(html) {
  return `Analyze this HTML page's visual design and extract all design tokens into the following JSON schema. Be precise about exact values found in CSS.

Return this exact schema (fill in all values from the HTML):
{
  "colors": { "primary":"#hex","secondary":"#hex","background":"#hex","surface":"#hex","text":"#hex","textMuted":"#hex","accent":"#hex" },
  "typography": {
    "headingFont":"font-stack","bodyFont":"font-stack",
    "h1":{"size":"Xpx","weight":"700","lineHeight":"1.2"},
    "h2":{"size":"Xpx","weight":"700","lineHeight":"1.3"},
    "h3":{"size":"Xpx","weight":"600","lineHeight":"1.4"},
    "body":{"size":"Xpx","weight":"400","lineHeight":"1.6"},
    "small":{"size":"Xpx","weight":"400"}
  },
  "layout":{"maxWidth":"Xpx","contentPadding":"Xpx","sectionPadding":"Xpx Xpx"},
  "borderRadius":{"small":"Xpx","medium":"Xpx","large":"Xpx"},
  "shadows":{"card":"...","button":"..."},
  "components":{
    "ctaButton":{"background":"#hex","color":"#hex","borderRadius":"Xpx","padding":"Xpx Xpx","fontSize":"Xpx","fontWeight":"700","textTransform":"uppercase|none"},
    "testimonialCard":{"background":"#hex","borderRadius":"Xpx","padding":"Xpx","border":"..."},
    "calloutBox":{"background":"#hex","border":"...","borderRadius":"Xpx","padding":"Xpx"}
  },
  "sections":["ordered","list","of","section","ids","found"],
  "layoutPattern":"single-column"
}

HTML source:
${html}`;
}

export async function runDesignForensics(referenceUrl, outputDir) {
  const specPath = join(outputDir, 'design-spec.json');
  if (existsSync(specPath)) {
    console.log('  [1] Design forensics: cached ✓');
    return JSON.parse(readFileSync(specPath, 'utf8'));
  }

  console.log('  [1] Design forensics: fetching reference URL...');
  const rawHtml = await fetchPageHtml(referenceUrl);
  const html = truncateHtml(rawHtml);

  console.log('  [1] Design forensics: analyzing with Claude...');
  const rawResponse = await callClaude(SYSTEM, buildPrompt(html));
  const spec = extractJson(rawResponse);

  writeFileSync(specPath, JSON.stringify(spec, null, 2));
  console.log('  [1] Design forensics: done ✓');
  return spec;
}
