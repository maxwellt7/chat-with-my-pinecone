import { callClaude } from '../config/anthropic.js';

export async function queryRoute(req, res) {
  try {
    const { projectId, question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required',
      });
    }

    // In a production app, you would fetch the project data from a database
    // For now, we'll work with the data sent in the request
    const projectData = req.body.projectData;

    const systemPrompt = `You are an expert marketing consultant and copywriter. You help users work with their launch documents,
generate copy, provide recommendations, and answer questions about their marketing strategy.

You have access to the user's complete project data including:
- Offer analysis
- Avatar research
- Competitor intelligence
- Manifold insights
- Launch document

Provide helpful, actionable, specific answers. If asked to generate copy, provide multiple variations.
If asked for recommendations, explain the reasoning behind each suggestion.`;

    const contextData = projectData ? `
PROJECT CONTEXT:
${JSON.stringify(projectData, null, 2).substring(0, 3000)}...
` : '';

    const userPrompt = `${contextData}

USER QUESTION: ${question}

Please provide a comprehensive, actionable response.`;

    const response = await callClaude(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 2000,
    });

    res.json({
      success: true,
      data: {
        answer: response,
      },
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

