import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getRunId } from '../../lib/pipeline.js';

test('getRunId returns 8-char hex string', () => {
  const id = getRunId('https://example.com', 'some copy');
  assert.match(id, /^[a-f0-9]{8}$/);
});

test('getRunId is deterministic — same inputs same output', () => {
  const a = getRunId('https://example.com', 'copy text');
  const b = getRunId('https://example.com', 'copy text');
  assert.equal(a, b);
});

test('getRunId changes when URL changes', () => {
  const a = getRunId('https://site-a.com', 'same copy');
  const b = getRunId('https://site-b.com', 'same copy');
  assert.notEqual(a, b);
});

test('getRunId changes when copy changes', () => {
  const a = getRunId('https://example.com', 'copy A');
  const b = getRunId('https://example.com', 'copy B');
  assert.notEqual(a, b);
});
