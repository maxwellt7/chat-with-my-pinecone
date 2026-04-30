const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BODY_CHAR_LIMIT = 100_000;

export async function fetchPageHtml(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
  } catch (err) {
    throw new Error(`Scraper: Could not fetch ${url} — ${err.message}`);
  }
  if (!response.ok) {
    throw new Error(`Scraper: HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

export function truncateHtml(html) {
  // Remove all script tags and their content
  let clean = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Keep head (for styles/fonts) + truncated body
  const headMatch = clean.match(/<head[\s\S]*?<\/head>/i);
  const bodyMatch = clean.match(/<body[\s\S]*?<\/body>/i);
  const head = headMatch ? headMatch[0] : '';
  const body = bodyMatch ? bodyMatch[0].slice(0, BODY_CHAR_LIMIT) : clean.slice(0, BODY_CHAR_LIMIT);
  return `<html>${head}${body}</html>`;
}
