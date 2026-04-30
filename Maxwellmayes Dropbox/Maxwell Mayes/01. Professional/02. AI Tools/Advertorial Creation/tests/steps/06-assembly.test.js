// tests/steps/06-assembly.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runAssembly } from '../../steps/06-assembly.js';

const TMP = '/tmp/advertorial-test-step6';

const RAW_HTML = `<!DOCTYPE html>
<html>
<body>
  <img src="GENERATE:hero-image" alt="Hero" />
  <img src="GENERATE:testimonial-photo" alt="Mary" />
  <!-- GENERATE_SVG:trust-badge -->
  <p>Content here</p>
</body>
</html>`;

const PROMPTS = {
  slots: [
    { id: 'hero-image', type: 'photo', outputFile: 'advertorial_images/hero-image.jpg' },
    { id: 'testimonial-photo', type: 'photo', outputFile: 'advertorial_images/testimonial-photo.jpg' },
    { id: 'trust-badge', type: 'svg', svgContent: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45"/></svg>', outputFile: null }
  ]
};

test('runAssembly replaces GENERATE: src attributes with relative paths', async () => {
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'advertorial.html'), RAW_HTML);

  const result = await runAssembly(RAW_HTML, PROMPTS, TMP);
  assert.match(result, /src="advertorial_images\/hero-image\.jpg"/);
  assert.match(result, /src="advertorial_images\/testimonial-photo\.jpg"/);
  assert.doesNotMatch(result, /GENERATE:hero-image/);

  rmSync(TMP, { recursive: true });
});

test('runAssembly replaces GENERATE_SVG comments with inline SVG', async () => {
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'advertorial.html'), RAW_HTML);

  const result = await runAssembly(RAW_HTML, PROMPTS, TMP);
  assert.match(result, /<svg viewBox="0 0 100 100">/);
  assert.doesNotMatch(result, /GENERATE_SVG:trust-badge/);

  rmSync(TMP, { recursive: true });
});

test('runAssembly writes assembled HTML to disk', async () => {
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'advertorial.html'), RAW_HTML);

  await runAssembly(RAW_HTML, PROMPTS, TMP);
  const written = readFileSync(join(TMP, 'advertorial.html'), 'utf8');
  assert.match(written, /src="advertorial_images\/hero-image\.jpg"/);

  rmSync(TMP, { recursive: true });
});
