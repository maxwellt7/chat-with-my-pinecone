// tests/lib/imagen.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { generateImage } from '../../lib/imagen.js';

const TMP = '/tmp/advertorial-test-imagen';

// A minimal valid base64 PNG (1x1 pixel)
const FAKE_IMG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test('generateImage saves file from Imagen 4 primary response', async () => {
  mkdirSync(TMP, { recursive: true });
  process.env.GEMINI_API_KEY = 'test-gemini-key';
  const orig = global.fetch;
  global.fetch = async (url) => {
    assert.match(url, /imagen-4\.0-generate-001/);
    return {
      ok: true,
      json: async () => ({
        predictions: [{ bytesBase64Encoded: FAKE_IMG_B64, mimeType: 'image/jpeg' }]
      })
    };
  };

  const outPath = `${TMP}/test-image.jpg`;
  const success = await generateImage('A test prompt', '16:9', outPath);
  assert.equal(success, true);
  assert.ok(existsSync(outPath));

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});

test('generateImage falls back to nano-banana-pro on Imagen 4 failure', async () => {
  mkdirSync(TMP, { recursive: true });
  process.env.GEMINI_API_KEY = 'test-key';
  const orig = global.fetch;
  let callCount = 0;
  global.fetch = async (url) => {
    callCount++;
    if (url.includes('imagen-4')) {
      return { ok: false, status: 429, json: async () => ({ error: { message: 'quota' } }) };
    }
    assert.match(url, /nano-banana-pro/);
    return {
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [
              { text: 'Here is the image:' },
              { inlineData: { mimeType: 'image/jpeg', data: FAKE_IMG_B64 } }
            ]
          }
        }]
      })
    };
  };

  const outPath = `${TMP}/fallback-image.jpg`;
  const success = await generateImage('A test prompt', '1:1', outPath);
  assert.equal(success, true);
  assert.equal(callCount, 2);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});

test('generateImage returns false if both endpoints fail', async () => {
  const orig = global.fetch;
  global.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });

  const success = await generateImage('test', '16:9', '/tmp/nope.jpg');
  assert.equal(success, false);

  global.fetch = orig;
});

test('generateImage skips fetch if output file already exists', async () => {
  mkdirSync(TMP, { recursive: true });
  const { writeFileSync } = await import('node:fs');
  const outPath = `${TMP}/existing.jpg`;
  writeFileSync(outPath, Buffer.from('fake jpeg'));

  let called = false;
  const orig = global.fetch;
  global.fetch = async () => { called = true; return {}; };

  const success = await generateImage('test', '16:9', outPath);
  assert.equal(success, true);
  assert.equal(called, false);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});
