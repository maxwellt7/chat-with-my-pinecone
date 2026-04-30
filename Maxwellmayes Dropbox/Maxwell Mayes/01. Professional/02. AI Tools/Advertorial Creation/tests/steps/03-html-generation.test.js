// tests/steps/03-html-generation.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runHtmlGeneration } from '../../steps/03-html-generation.js';

const DESIGN_SPEC = JSON.parse(readFileSync('tests/fixtures/design-spec.json', 'utf8'));
const COPY_MAP = JSON.parse(readFileSync('tests/fixtures/copy-map.json', 'utf8'));
const TMP = '/tmp/advertorial-test-step3';

const MOCK_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Test Advertorial</title></head>
<body>
  <section id="hero">
    <img src="GENERATE:hero-image" alt="Hero" />
    <h1>Stop Living With Joint Pain</h1>
  </section>
  <!-- GENERATE_SVG:trust-badge -->
</body>
</html>`;

test('runHtmlGeneration returns HTML string and writes advertorial.html', async () => {
  mkdirSync(TMP, { recursive: true });
  const orig = global.fetch;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ content: [{ type: 'text', text: MOCK_HTML }] })
  });

  const result = await runHtmlGeneration(DESIGN_SPEC, COPY_MAP, TMP);
  assert.match(result, /<!DOCTYPE html>/i);
  assert.match(result, /GENERATE:hero-image/);

  const written = readFileSync(join(TMP, 'advertorial.html'), 'utf8');
  assert.equal(written, MOCK_HTML);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});

test('runHtmlGeneration strips markdown fences if Claude wraps output', async () => {
  mkdirSync(TMP, { recursive: true });
  const orig = global.fetch;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      content: [{ type: 'text', text: '```html\n' + MOCK_HTML + '\n```' }]
    })
  });

  const result = await runHtmlGeneration(DESIGN_SPEC, COPY_MAP, TMP);
  assert.doesNotMatch(result, /```/);
  assert.match(result, /<!DOCTYPE html>/i);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});

test('runHtmlGeneration skips Claude if advertorial.html already exists', async () => {
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'advertorial.html'), MOCK_HTML);

  let called = false;
  const orig = global.fetch;
  global.fetch = async () => { called = true; return {}; };

  const result = await runHtmlGeneration(DESIGN_SPEC, COPY_MAP, TMP);
  assert.equal(called, false);
  assert.match(result, /<!DOCTYPE html>/i);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});
