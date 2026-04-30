// tests/steps/04-image-prompts.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runImagePrompts } from '../../steps/04-image-prompts.js';

const DESIGN_SPEC = JSON.parse(readFileSync('tests/fixtures/design-spec.json', 'utf8'));
const COPY_MAP = JSON.parse(readFileSync('tests/fixtures/copy-map.json', 'utf8'));
const PROMPTS = JSON.parse(readFileSync('tests/fixtures/image-prompts.json', 'utf8'));
const TMP = '/tmp/advertorial-test-step4';

test('runImagePrompts returns slots with prompts and SVG content', async () => {
  mkdirSync(TMP, { recursive: true });
  const orig = global.fetch;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ content: [{ type: 'text', text: JSON.stringify(PROMPTS) }] })
  });

  const result = await runImagePrompts(DESIGN_SPEC, COPY_MAP, TMP);
  assert.ok(Array.isArray(result.slots));
  const photoSlot = result.slots.find(s => s.type === 'photo');
  assert.ok(photoSlot.prompt.length > 20, 'prompt should be descriptive');
  assert.ok(photoSlot.outputFile, 'photo slot should have outputFile');
  const svgSlot = result.slots.find(s => s.type === 'svg');
  assert.ok(svgSlot.svgContent.includes('<svg'), 'SVG slot should have inline SVG');
  assert.equal(svgSlot.outputFile, null);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});

test('runImagePrompts skips Claude if image-prompts.json already exists', async () => {
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'image-prompts.json'), JSON.stringify(PROMPTS));

  let called = false;
  const orig = global.fetch;
  global.fetch = async () => { called = true; return {}; };

  await runImagePrompts(DESIGN_SPEC, COPY_MAP, TMP);
  assert.equal(called, false);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});
