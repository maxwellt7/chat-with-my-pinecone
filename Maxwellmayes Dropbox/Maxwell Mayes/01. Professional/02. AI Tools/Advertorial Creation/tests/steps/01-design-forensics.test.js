// tests/steps/01-design-forensics.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runDesignForensics } from '../../steps/01-design-forensics.js';

const FIXTURE = JSON.parse(readFileSync('tests/fixtures/design-spec.json', 'utf8'));
const TMP = '/tmp/advertorial-test-step1';

test('runDesignForensics returns design spec and writes design-spec.json', async () => {
  mkdirSync(TMP, { recursive: true });
  const origFetch = global.fetch;
  let fetchCallCount = 0;
  global.fetch = async (url, opts) => {
    fetchCallCount++;
    if (url.includes('anthropic')) {
      return {
        ok: true,
        json: async () => ({ content: [{ type: 'text', text: JSON.stringify(FIXTURE) }] })
      };
    }
    // scraper call
    return { ok: true, text: async () => '<html><body>test page</body></html>' };
  };

  const result = await runDesignForensics('https://example.com', TMP);
  assert.equal(result.colors.primary, '#2563eb');
  assert.ok(Array.isArray(result.sections));
  assert.equal(fetchCallCount, 2); // one scrape + one Claude call

  const written = JSON.parse(readFileSync(join(TMP, 'design-spec.json'), 'utf8'));
  assert.deepEqual(written, FIXTURE);

  global.fetch = origFetch;
  rmSync(TMP, { recursive: true });
});

test('runDesignForensics skips scrape+Claude if design-spec.json already exists', async () => {
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'design-spec.json'), JSON.stringify(FIXTURE));

  let fetchCalled = false;
  const orig = global.fetch;
  global.fetch = async () => { fetchCalled = true; return {}; };

  const result = await runDesignForensics('https://example.com', TMP);
  assert.equal(fetchCalled, false);
  assert.equal(result.colors.primary, '#2563eb');

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});
