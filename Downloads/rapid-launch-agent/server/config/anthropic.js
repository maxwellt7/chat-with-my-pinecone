import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('⚠️  ANTHROPIC_API_KEY not set. AI features will not work.');
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
export const CLAUDE_TEMPERATURE = parseFloat(process.env.CLAUDE_TEMPERATURE || '0.7');

/**
 * Call Claude with a prompt and return the response
 */
export async function callClaude(systemPrompt, userPrompt, options = {}) {
  const {
    model = CLAUDE_MODEL,
    temperature = CLAUDE_TEMPERATURE,
    maxTokens = 4000,
  } = options;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Anthropic API Error:', error.message);
    throw new Error(`Anthropic API call failed: ${error.message}`);
  }
}

/**
 * Call Claude with streaming for long-running tasks
 */
export async function callClaudeStreaming(systemPrompt, userPrompt, onChunk, options = {}) {
  const {
    model = CLAUDE_MODEL,
    temperature = CLAUDE_TEMPERATURE,
    maxTokens = 4000,
  } = options;

  try {
    const stream = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      stream: true,
    });

    let fullContent = '';
    
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.text) {
        const text = event.delta.text;
        fullContent += text;
        if (onChunk) {
          onChunk(text);
        }
      }
    }

    return fullContent;
  } catch (error) {
    console.error('Anthropic Streaming API Error:', error.message);
    throw new Error(`Anthropic streaming call failed: ${error.message}`);
  }
}

