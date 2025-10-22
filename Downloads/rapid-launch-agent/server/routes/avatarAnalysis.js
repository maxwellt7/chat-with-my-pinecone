import { callClaude } from '../config/anthropic.js';
import { safeParseJSON, formatError, logAPICall } from '../utils/helpers.js';

export async function analyzeAvatarRoute(req, res) {
  const startTime = Date.now();
  
  try {
    const avatarData = req.body;

    const systemPrompt = `You are an expert in customer psychology, Todd Brown's WEB Analysis (Wants, Emotions, Beliefs), 
and deep avatar profiling. You help identify the primary emotional currency and craft compelling positioning messages.`;

    const userPrompt = `Analyze this avatar data and provide enhanced insights:

DEMOGRAPHICS:
- Age: ${avatarData.demographics.age}
- Gender: ${avatarData.demographics.gender}
- Location: ${avatarData.demographics.location}
- Income: ${avatarData.demographics.income}
- Education: ${avatarData.demographics.education}
- Occupation: ${avatarData.demographics.occupation}

WEB ANALYSIS:
Wants: ${avatarData.webAnalysis.wants.filter(w => w).join(', ')}
Emotions: ${avatarData.webAnalysis.emotions.filter(e => e).join(', ')}
Beliefs: ${avatarData.webAnalysis.beliefs.filter(b => b).join(', ')}
Dominant Emotion: ${avatarData.webAnalysis.dominantEmotion}

EMPATHY MAP:
Seeing: ${avatarData.empathyMap.seeing.filter(s => s).join(', ')}
Hearing: ${avatarData.empathyMap.hearing.filter(h => h).join(', ')}
Saying: ${avatarData.empathyMap.saying.filter(s => s).join(', ')}
Thinking: ${avatarData.empathyMap.thinking.filter(t => t).join(', ')}
Feeling: ${avatarData.empathyMap.feeling.filter(f => f).join(', ')}
Doing: ${avatarData.empathyMap.doing.filter(d => d).join(', ')}

GOALS GRID:
Pains & Frustrations: ${avatarData.goalsGrid.painsAndFrustrations.filter(p => p).join(', ')}
Fears & Implications: ${avatarData.goalsGrid.fearsAndImplications.filter(f => f).join(', ')}
Goals & Desires: ${avatarData.goalsGrid.goalsAndDesires.filter(g => g).join(', ')}
Dreams & Aspirations: ${avatarData.goalsGrid.dreamsAndAspirations.filter(d => d).join(', ')}

Current Primary Currency: ${avatarData.primaryCurrency}
Current Million Dollar Message: ${avatarData.millionDollarMessage}

Please provide enhanced analysis in the following JSON format:
{
  "primaryCurrency": "The most important value (Time/Money/Status/Health/etc) - provide your refined analysis",
  "millionDollarMessage": "An improved, compelling positioning statement that follows the pattern: I help [AVATAR] achieve [GOAL], so they can [DREAM] without [PAIN]",
  "insights": {
    "dominantEmotion": "The most powerful emotion driving this avatar",
    "coreDesire": "The deepest desire behind all their wants",
    "primaryFear": "The biggest fear holding them back",
    "identityStatement": "How they see themselves vs how they want to be seen",
    "buyingTriggers": ["trigger 1", "trigger 2", "trigger 3"]
  }
}

Provide ONLY the JSON response, no additional text.`;

    const response = await callClaude(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 1500,
    });

    const analysisData = safeParseJSON(response);
    
    logAPICall('POST /api/analyze/avatar', Date.now() - startTime);

    res.json({
      success: true,
      data: analysisData,
    });
  } catch (error) {
    console.error('Avatar analysis error:', error);
    logAPICall('POST /api/analyze/avatar', Date.now() - startTime, false);
    res.status(500).json(formatError(error));
  }
}

