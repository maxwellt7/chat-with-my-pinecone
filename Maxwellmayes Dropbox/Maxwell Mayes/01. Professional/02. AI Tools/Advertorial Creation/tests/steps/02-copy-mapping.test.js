// tests/steps/02-copy-mapping.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runCopyMapping } from '../../steps/02-copy-mapping.js';

const DESIGN_SPEC = JSON.parse(readFileSync('tests/fixtures/design-spec.json', 'utf8'));
const COPY_MAP = JSON.parse(readFileSync('tests/fixtures/copy-map.json', 'utf8'));
const BRIEF = readFileSync('tests/fixtures/sample-brief.md', 'utf8');
const TMP = '/tmp/advertorial-test-step2';

test('runCopyMapping returns section map with image slots', async () => {
  mkdirSync(TMP, { recursive: true });
  const orig = global.fetch;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ content: [{ type: 'text', text: JSON.stringify(COPY_MAP) }] })
  });

  const result = await runCopyMapping(BRIEF, DESIGN_SPEC, TMP);
  assert.ok(Array.isArray(result.sections));
  assert.ok(result.sections.length > 0);
  const heroSection = result.sections.find(s => s.id === 'hero');
  assert.ok(heroSection, 'should have hero section');
  assert.ok(Array.isArray(heroSection.imageSlots));

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});

test('runCopyMapping skips Claude if copy-map.json already exists', async () => {
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'copy-map.json'), JSON.stringify(COPY_MAP));

  let called = false;
  const orig = global.fetch;
  global.fetch = async () => { called = true; return {}; };

  await runCopyMapping(BRIEF, DESIGN_SPEC, TMP);
  assert.equal(called, false);

  global.fetch = orig;
  rmSync(TMP, { recursive: true });
});
