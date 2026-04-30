// lib/claude.js
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

export async function callClaude(systemPrompt, userMessage, maxTokens = 8192) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    let errBody = {};
    try { errBody = await response.json(); } catch {}
    throw new Error(`Claude API ${response.status}: ${errBody.error?.message ?? 'Unknown error'}`);
  }

  const data = await response.json();
  if (!data.content?.length) throw new Error('Claude API returned empty content');
  return data.content[0].text;
}

export function extractJson(text) {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenceMatch ? fenceMatch[1] : text;
  return JSON.parse(raw.trim());
}
