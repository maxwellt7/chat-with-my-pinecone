import { callClaude } from '../config/anthropic.js';
import { safeParseJSON, formatError, logAPICall } from '../utils/helpers.js';

export async function analyzeOfferRoute(req, res) {
  const startTime = Date.now();
  
  try {
    const offerData = req.body;

    const systemPrompt = `You are an expert in Todd Brown's E5 VSL methodology and the Irresistible Offer Equation. 
You analyze offers and provide detailed, actionable recommendations to improve conversion rates.
You also excel at deriving customer avatar insights from offer details.`;

    const userPrompt = `Analyze this offer and provide a comprehensive evaluation INCLUDING initial avatar insights:

TARGET MARKET: ${offerData.targetMarket}
PRESSING PROBLEM: ${offerData.pressingProblem}
DESIRED OUTCOME: ${offerData.desiredOutcome || 'N/A'}
PRODUCT/SERVICE: ${offerData.productDescription}
CORE PROMISE: ${offerData.productPromise || 'N/A'}
PROOF ELEMENTS: ${offerData.proofElements || 'N/A'}
PRICING: ${offerData.pricing || 'N/A'}
GUARANTEE: ${offerData.guarantee || 'N/A'}

Please provide your analysis in the following JSON format:
{
  "essentialComponents": {
    "massivePain": <score 1-10>,
    "purchasingPower": <score 1-10>,
    "easyToTarget": <score 1-10>,
    "growingMarket": <score 1-10>,
    "average": <calculated average>
  },
  "irresistibleEquation": {
    "promiseSize": <score 1-10>,
    "perceivedLikelihood": <score 1-10>,
    "timeDelay": <score 1-10, where 10 = instant, 1 = long delay>,
    "effortRequired": <score 1-10, where 10 = effortless, 1 = high effort>,
    "score": <calculated: (promiseSize * perceivedLikelihood) / (timeDelay * effortRequired)>
  },
  "recommendations": [
    {
      "id": 1,
      "title": "Recommendation title",
      "description": "What to do",
      "reasoning": "Why this will help",
      "componentImproved": "Which metric this improves",
      "scoreImpact": {
        "before": <current score>,
        "after": <projected score>,
        "change": <difference>
      },
      "implementation": {
        "timeRequired": "e.g., 2-3 weeks",
        "budgetRequired": "e.g., $5,000-$10,000"
      }
    }
    // ... generate 10 recommendations total
  ],
  "projectedImprovement": {
    "beforeScore": <current irresistible equation score>,
    "afterScore": <projected score after all improvements>,
    "improvement": <difference>,
    "improvementPercent": <percentage improvement>,
    "totalBudget": "e.g., $50,000-$75,000",
    "timeline": "e.g., 3-6 months"
  },
  "suggestedAvatar": {
    "demographics": {
      "age": "e.g., 35-50",
      "gender": "e.g., Male/Female/All",
      "location": "e.g., Urban USA",
      "income": "e.g., $75K-$150K/year",
      "education": "e.g., College degree",
      "occupation": "e.g., Business owners, Marketers"
    },
    "primaryWants": ["want 1", "want 2", "want 3"],
    "primaryEmotions": ["emotion 1", "emotion 2", "emotion 3"],
    "primaryBeliefs": ["belief 1", "belief 2", "belief 3"],
    "dominantEmotion": "Most powerful emotion",
    "primaryCurrency": "Time/Money/Status/Health/etc",
    "millionDollarMessage": "I help [AVATAR] achieve [GOAL], so they can [DREAM] without [PAIN]"
  }
}

Provide ONLY the JSON response, no additional text.`;

    const response = await callClaude(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 3000,
    });

    // Parse the JSON response
    const analysisData = safeParseJSON(response);
    
    logAPICall('POST /api/analyze/offer', Date.now() - startTime);

    res.json({
      success: true,
      data: analysisData,
    });
  } catch (error) {
    console.error('Offer analysis error:', error);
    logAPICall('POST /api/analyze/offer', Date.now() - startTime, false);
    res.status(500).json(formatError(error));
  }
}

