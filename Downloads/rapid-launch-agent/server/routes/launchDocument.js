import { callClaude } from '../config/anthropic.js';

const LAUNCH_DOC_SECTIONS = [
  { id: 1, title: 'Prospect Analysis', key: 'prospectAnalysis' },
  { id: 2, title: 'Prospect WEB Analysis', key: 'webAnalysis' },
  { id: 3, title: 'Competitor Analysis', key: 'competitorAnalysis' },
  { id: 4, title: '10-Point Product Analysis', key: 'productAnalysis' },
  { id: 5, title: '3 Types of Benefits', key: 'benefitTypes' },
  { id: 6, title: 'Promise Exposure Spectrum', key: 'promiseSpectrum' },
  { id: 7, title: 'Prospect Awareness Pyramid', key: 'awarenessPyramid' },
  { id: 8, title: '3D Prospect Psyche Profile', key: 'psycheProfile' },
  { id: 9, title: 'Perfect Customer-Generating Product', key: 'perfectProduct' },
  { id: 10, title: 'Engineering the Perfect Offer', key: 'perfectOffer' },
  { id: 11, title: 'Type of Offer', key: 'offerType' },
  { id: 12, title: 'Deliverable, Feature, Why', key: 'deliverableFeature' },
  { id: 13, title: 'Price & Terms', key: 'priceTerms' },
  { id: 14, title: 'Risk Reversal', key: 'riskReversal' },
  { id: 15, title: 'Premiums/Bonuses', key: 'premiumsBonuses' },
  { id: 16, title: 'Reason to Respond Now', key: 'urgencyScarcity' },
  { id: 17, title: 'Close and Call to Action', key: 'closeCallToAction' },
  { id: 18, title: 'Perfect Marketing Thesis', key: 'marketingThesis' },
  { id: 19, title: 'Marketing Thesis Solution', key: 'thesisSolution' },
  { id: 20, title: 'The Big Idea', key: 'bigIdea' },
  { id: 21, title: 'Primary Promise', key: 'primaryPromise' },
  { id: 22, title: 'Unique Mechanism & Type', key: 'uniqueMechanism' },
  { id: 23, title: 'Relevant Metaphors', key: 'metaphors' },
  { id: 24, title: 'Front End Ascension Model', key: 'ascensionModel' },
  { id: 25, title: 'Open Loops', key: 'openLoops' },
  { id: 26, title: 'Headlines', key: 'headlines' },
  { id: 27, title: 'Perfect Lead', key: 'perfectLead' },
  { id: 28, title: 'Credibility', key: 'credibility' },
  { id: 29, title: '4 Beliefs', key: 'fourBeliefs' },
  { id: 30, title: 'EMBC (Emotional Marketing Blocks)', key: 'embc' },
  { id: 31, title: 'CPB Chunks', key: 'cpbChunks' },
  { id: 32, title: 'Minimum Viable Funnel', key: 'mvf' },
  { id: 33, title: 'Traffic Captivation Page', key: 'trafficPage' },
  { id: 34, title: 'Perfect Marketing/Sales Page', key: 'salesPage' },
  { id: 35, title: 'VSL Structure/Outline', key: 'vslStructure' },
  { id: 36, title: 'Order Form Elements', key: 'orderForm' },
  { id: 37, title: 'Perfect Upsell Sequence', key: 'upsellSequence' },
  { id: 38, title: 'Additional Optimizations', key: 'optimizations' },
];

async function generateSection(sectionData, context) {
  const systemPrompt = `You are an expert marketing strategist and copywriter trained in Todd Brown's E5 VSL methodology.
You create comprehensive, actionable marketing documentation.`;

  const userPrompt = `Generate the "${sectionData.title}" section for a launch document.

OFFER DATA:
Target Market: ${context.offer.targetMarket}
Problem: ${context.offer.pressingProblem}
Product: ${context.offer.productDescription}
Promise: ${context.offer.productPromise}
Pricing: ${context.offer.pricing}

AVATAR DATA:
Demographics: ${JSON.stringify(context.avatar.demographics)}
Primary Currency: ${context.avatar.primaryCurrency}
Million Dollar Message: ${context.avatar.millionDollarMessage}

${context.manifold ? `MANIFOLD INSIGHTS:
Core Wound: ${context.manifold.coreWound?.substring(0, 300)}...
Big Idea Hooks: ${context.manifold.hooks?.substring(0, 300)}...` : ''}

${context.competitors ? `COMPETITOR INSIGHTS:
Positioning Angles: ${context.competitors.positioningAngles?.join(', ')}` : ''}

Create a comprehensive, detailed section covering all aspects of ${sectionData.title}.
Include specific examples, frameworks, and actionable recommendations.
Format in clean markdown with headers, bullet points, and clear structure.
Aim for 300-600 words per section.`;

  const response = await callClaude(systemPrompt, userPrompt, {
    temperature: 0.7,
    maxTokens: 1500,
  });

  return response;
}

export async function generateLaunchDocRoute(req, res) {
  try {
    const { offer, avatar, competitors, manifold } = req.body;

    if (!offer || !avatar || !manifold) {
      return res.status(400).json({
        success: false,
        error: 'Offer, avatar, and manifold data are required',
      });
    }

    console.log('📄 Generating Launch Document...');

    const context = {
      offer,
      avatar,
      competitors,
      manifold,
    };

    const sections = [];

    // Generate each section
    for (let i = 0; i < LAUNCH_DOC_SECTIONS.length; i++) {
      const sectionData = LAUNCH_DOC_SECTIONS[i];
      console.log(`Generating section ${i + 1}/${LAUNCH_DOC_SECTIONS.length}: ${sectionData.title}`);

      const content = await generateSection(sectionData, context);

      sections.push({
        id: sectionData.id,
        title: sectionData.title,
        content,
      });
    }

    console.log('✅ Launch Document Generation Complete');

    res.json({
      success: true,
      data: {
        sections,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Launch document generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

