import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchPageHtml, truncateHtml } from '../../lib/scraper.js';

test('fetchPageHtml returns html string on 200', async () => {
  const orig = global.fetch;
  global.fetch = async (url, opts) => {
    assert.match(opts.headers['User-Agent'], /Mozilla/);
    return {
      ok: true,
      text: async () => '<html><body>Hello</body></html>'
    };
  };
  const html = await fetchPageHtml('https://example.com');
  assert.equal(html, '<html><body>Hello</body></html>');
  global.fetch = orig;
});

test('fetchPageHtml throws on non-200 response', async () => {
  const orig = global.fetch;
  global.fetch = async () => ({ ok: false, status: 403 });
  await assert.rejects(
    () => fetchPageHtml('https://example.com'),
    (err) => { assert.match(err.message, /403/); return true; }
  );
  global.fetch = orig;
});

test('truncateHtml strips script tags and limits body size', () => {
  const html = '<html><head><style>body{color:red}</style></head><body>' +
    '<script>alert(1)</script><p>' + 'x'.repeat(200000) + '</p></body></html>';
  const result = truncateHtml(html);
  assert.doesNotMatch(result, /<script/);
  assert.ok(result.length < 120000, `Expected <120000 chars, got ${result.length}`);
});
