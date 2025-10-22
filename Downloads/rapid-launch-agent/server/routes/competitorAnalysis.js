import { callClaude } from '../config/anthropic.js';
import { safeParseJSON, formatError, logAPICall } from '../utils/helpers.js';

export async function analyzeCompetitorsRoute(req, res) {
  const startTime = Date.now();
  
  try {
    const { industry, competitorUrls } = req.body;

    const systemPrompt = `You are an expert in competitive intelligence, market analysis, and strategic positioning.
You analyze competitors to identify market gaps, opportunities, and strategic positioning angles.`;

    const userPrompt = `Analyze this competitive landscape:

INDUSTRY/NICHE: ${industry}

COMPETITOR URLs:
${competitorUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

Based on common patterns in this industry, provide a comprehensive competitive analysis in the following JSON format:
{
  "competitors": [
    {
      "name": "Competitor name",
      "url": "URL",
      "revenueModel": "How they make money",
      "pricing": "Their pricing structure",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
      "funnelArchitecture": "Description of their funnel/customer journey"
    }
    // Analyze top 5-7 competitors
  ],
  "marketIntelligence": {
    "marketSize": "Estimated market size and TAM",
    "growthTrends": ["trend 1", "trend 2", "trend 3"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "threats": ["threat 1", "threat 2", "threat 3"]
  },
  "positioningAngles": [
    "Positioning angle 1 - describe a unique way to position against competitors",
    "Positioning angle 2 - another strategic angle",
    "Positioning angle 3 - a third differentiation strategy"
  ],
  "mvpFeatures": [
    "Must-have feature 1",
    "Must-have feature 2",
    "Must-have feature 3",
    "Must-have feature 4",
    "Must-have feature 5"
  ],
  "distributionStrategy": "Recommended distribution strategy for week 1, including specific channels and tactics"
}

Note: Since we don't have access to scrape these sites directly, provide your best analysis based on typical patterns 
in the ${industry} industry. Focus on actionable insights and strategic recommendations.

Provide ONLY the JSON response, no additional text.`;

    const response = await callClaude(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 3000,
    });

    const analysisData = safeParseJSON(response);
    
    logAPICall('POST /api/analyze/competitors', Date.now() - startTime);

    res.json({
      success: true,
      data: {
        industry,
        ...analysisData,
      },
    });
  } catch (error) {
    console.error('Competitor analysis error:', error);
    logAPICall('POST /api/analyze/competitors', Date.now() - startTime, false);
    res.status(500).json(formatError(error));
  }
}

