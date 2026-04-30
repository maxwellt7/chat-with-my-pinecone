// tests/steps/07-deployment.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { runDeployment, parseVercelUrl } from '../../steps/07-deployment.js';

const TMP = '/tmp/advertorial-test-step7';

test('parseVercelUrl extracts URL from vercel CLI output with Production line', () => {
  const output = `
Vercel CLI 32.0.0
🔍  Inspect: https://vercel.com/team/project/abc123
✅  Production: https://advertorial-a1b2c3d4.vercel.app [3s]
  `;
  const url = parseVercelUrl(output);
  assert.equal(url, 'https://advertorial-a1b2c3d4.vercel.app');
});

test('parseVercelUrl extracts any vercel.app URL if no Production line', () => {
  const output = 'https://my-project-xyz.vercel.app\nSome other output';
  const url = parseVercelUrl(output);
  assert.equal(url, 'https://my-project-xyz.vercel.app');
});

test('runDeployment creates vercel.json, renames advertorial.html to index.html, returns URL', async () => {
  mkdirSync(TMP, { recursive: true });
  const { writeFileSync } = await import('node:fs');
  writeFileSync(join(TMP, 'advertorial.html'), '<html><body>Test</body></html>');

  const mockExec = (_cmd) => 'https://advertorial-test.vercel.app\n';

  const url = await runDeployment(TMP, 'testrunid', mockExec);
  assert.equal(url, 'https://advertorial-test.vercel.app');

  const vercelJson = JSON.parse(readFileSync(join(TMP, 'vercel.json'), 'utf8'));
  assert.equal(vercelJson.name, 'advertorial-testrunid');

  assert.ok(existsSync(join(TMP, 'index.html')));
  assert.ok(!existsSync(join(TMP, 'advertorial.html')));

  rmSync(TMP, { recursive: true });
});
