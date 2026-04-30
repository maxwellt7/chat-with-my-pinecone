// tests/lib/claude.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callClaude } from '../../lib/claude.js';

test('callClaude returns text from successful API response', async () => {
  const orig = global.fetch;
  global.fetch = async (_url, opts) => {
    const body = JSON.parse(opts.body);
    assert.equal(body.model, 'claude-sonnet-4-6');
    assert.equal(body.system, 'You are helpful');
    return {
      ok: true,
      json: async () => ({ content: [{ type: 'text', text: 'Hello world' }] })
    };
  };
  const result = await callClaude('You are helpful', 'Say hi', 1024);
  assert.equal(result, 'Hello world');
  global.fetch = orig;
});

test('callClaude throws on non-OK HTTP status', async () => {
  const orig = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 529,
    json: async () => ({ error: { message: 'Overloaded' } })
  });
  await assert.rejects(
    () => callClaude('sys', 'user'),
    (err) => {
      assert.match(err.message, /529/);
      assert.match(err.message, /Overloaded/);
      return true;
    }
  );
  global.fetch = orig;
});

test('callClaude sends ANTHROPIC_API_KEY header', async () => {
  process.env.ANTHROPIC_API_KEY = 'test-key-123';
  const orig = global.fetch;
  let capturedHeaders;
  global.fetch = async (_url, opts) => {
    capturedHeaders = opts.headers;
    return { ok: true, json: async () => ({ content: [{ type: 'text', text: 'ok' }] }) };
  };
  await callClaude('sys', 'user');
  assert.equal(capturedHeaders['x-api-key'], 'test-key-123');
  global.fetch = orig;
});
