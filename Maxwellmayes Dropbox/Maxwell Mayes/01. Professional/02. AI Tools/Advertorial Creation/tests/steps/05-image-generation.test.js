// tests/steps/05-image-generation.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runImageGeneration } from '../../steps/05-image-generation.js';

const PROMPTS = {
  slots: [
    { id: 'hero-image', type: 'photo', aspectRatio: '16:9', prompt: 'A happy couple', negativePrompt: 'blurry', outputFile: 'advertorial_images/hero-image.jpg' },
    { id: 'trust-badge', type: 'svg', svgContent: '<svg></svg>', outputFile: null }
  ]
};
const TMP = '/tmp/advertorial-test-step5';
const FAKE_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test('runImageGeneration generates JPEGs for photo slots and skips SVG slots', async () => {
  mkdirSync(`${TMP}/advertorial_images`, { recursive: true });
  process.env.GEMINI_API_KEY = 'test-key';
  const orig = global.fetch;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ predictions: [{ bytesBase64Encoded: FAKE_B64 }] })
  });

  const results = await runImageGeneration(PROMPTS, TMP);
  assert.ok(results['hero-image'], 'photo slot should succeed');
  assert.equal(results['trust-badge'], undefined, 'SVG slot should not be in results');
  assert.ok(existsSync(join(TMP, 'advertorial_images/hero-image.jpg')));

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});

test('runImageGeneration skips slots where output file already exists', async () => {
  mkdirSync(`${TMP}/advertorial_images`, { recursive: true });
  writeFileSync(join(TMP, 'advertorial_images/hero-image.jpg'), Buffer.from('existing'));

  let fetchCalled = false;
  const orig = global.fetch;
  global.fetch = async () => { fetchCalled = true; return {}; };

  await runImageGeneration(PROMPTS, TMP);
  assert.equal(fetchCalled, false);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});
