import { callClaude } from '../config/anthropic.js';

const MANIFOLD_NODES = [
  {
    id: 'buildABuyer',
    name: 'Build A Buyer',
    prompt: (context) => `Based on this offer and avatar data, create a comprehensive buyer psychology profile.

OFFER:
Target Market: ${context.offer.targetMarket}
Problem: ${context.offer.pressingProblem}
Product: ${context.offer.productDescription}

AVATAR:
Demographics: ${JSON.stringify(context.avatar.demographics)}
Wants: ${context.avatar.webAnalysis.wants.join(', ')}
Emotions: ${context.avatar.webAnalysis.emotions.join(', ')}
Beliefs: ${context.avatar.webAnalysis.beliefs.join(', ')}

Create a deep buyer psychology profile covering:
1. Who they are at their core
2. Their worldview and identity
3. What drives their decisions
4. Their relationship with the problem
5. Why they buy (or don't buy)

Provide a comprehensive analysis (500-800 words).`,
  },
  {
    id: 'painMatrix',
    name: 'Pain Matrix',
    prompt: (context) => `Create a comprehensive Pain Matrix analyzing 10 dimensions of pain for this avatar.

CONTEXT:
${context.buildABuyer}

Analyze pain across these 10 dimensions:
1. Financial pain
2. Time/productivity pain
3. Emotional/psychological pain
4. Social/status pain
5. Physical pain
6. Relationship pain
7. Identity/self-image pain
8. Security/safety pain
9. Growth/potential pain
10. Meaning/purpose pain

For each dimension, describe:
- The specific pain they experience
- How intense it is (1-10)
- How aware they are of it
- The triggers that activate it

Format as a detailed analysis (600-800 words).`,
  },
  {
    id: 'coreWound',
    name: 'Core Wound',
    prompt: (context) => `Identify the Core Wound - the fundamental fear or pain at the root of all surface-level problems.

PAIN MATRIX:
${context.painMatrix}

The Core Wound is the deepest emotional/psychological pain that drives everything else. It's often:
- Rooted in identity or self-worth
- Connected to a fundamental fear
- Something they may not consciously recognize
- The "wound" that all surface pains stem from

Identify and explain:
1. What is their Core Wound?
2. How did it likely form?
3. How does it manifest in their daily life?
4. How does it drive their behavior and decisions?
5. Why addressing this is the key to transformation

Provide a deep, empathetic analysis (400-600 words).`,
  },
  {
    id: 'benefitMatrix',
    name: 'Benefit Matrix',
    prompt: (context) => `Create a Benefit Matrix by reversing each pain into its corresponding benefit.

PAIN MATRIX:
${context.painMatrix}

For each of the 10 pain dimensions, identify:
- The inverse benefit (what they gain when pain is removed)
- The emotional payoff
- How their life transforms
- The specific outcome they experience

Also categorize benefits into:
- Features (what it is)
- Advantages (what it does)
- Benefits (what it means for them)
- Emotional benefits (how they feel)
- Identity benefits (who they become)

Provide comprehensive benefit analysis (600-800 words).`,
  },
  {
    id: 'desireDaisyChain',
    name: 'Desire Daisy Chain',
    prompt: (context) => `Create 3 Desire Daisy Chains showing progression from surface desire to core wound resolution.

BENEFIT MATRIX:
${context.benefitMatrix}

CORE WOUND:
${context.coreWound}

A Desire Daisy Chain shows: "I want X, so that Y, so that Z, so that [Core Wound Resolution]"

Create 3 chains:
1. Starting from most obvious/surface-level desire
2. Starting from emotional benefit
3. Starting from identity transformation

For each chain, show:
- 5-7 steps of progression
- How each "so that" goes deeper
- How it ultimately resolves the core wound
- The logical flow of desires

Format as clear progressions with explanation (500-700 words).`,
  },
  {
    id: 'resonanceHierarchy',
    name: 'Resonance Hierarchy',
    prompt: (context) => `Create the Resonance Hierarchy: Experiences → Beliefs → Values → Identity

CONTEXT:
${context.buildABuyer}

Map the hierarchy:

1. EXPERIENCES (What happened to them)
   - Past experiences that shaped them
   - Failures and frustrations
   - Attempts to solve the problem

2. BELIEFS (What they concluded)
   - Beliefs about themselves
   - Beliefs about the problem
   - Beliefs about solutions
   - Limiting beliefs

3. VALUES (What matters to them)
   - Core values driving decisions
   - What they prioritize
   - What they're unwilling to compromise

4. IDENTITY (Who they see themselves as)
   - Current identity
   - Desired identity
   - Identity conflicts
   - Identity transformation needed

Provide detailed analysis of each level (700-900 words).`,
  },
  {
    id: 'rhConstraints',
    name: 'RH Constraints',
    prompt: (context) => `Identify the Resonance Hierarchy Constraints - perceived limitations at each level.

RESONANCE HIERARCHY:
${context.resonanceHierarchy}

For each level, identify constraints:

1. EXPERIENCE CONSTRAINTS
   - Past failures that limit them
   - Bad experiences creating fear
   - "Proof" that change is impossible

2. BELIEF CONSTRAINTS
   - Limiting beliefs blocking action
   - False narratives they tell themselves
   - Beliefs about what's possible

3. VALUE CONSTRAINTS
   - Value conflicts preventing action
   - What they think they must sacrifice
   - Values misalignment

4. IDENTITY CONSTRAINTS
   - Who they think they are (limiting)
   - Who they think they can't be
   - Identity misalignment with desired outcome

For each constraint, explain:
- What it is
- How it limits them
- Where it came from
- Why it feels true to them

Provide comprehensive analysis (600-800 words).`,
  },
  {
    id: 'dissolution',
    name: 'Dissolution Frameworks',
    prompt: (context) => `Create Dissolution Frameworks to dissolve each constraint identified.

CONSTRAINTS:
${context.rhConstraints}

For each major constraint, provide:

1. REFRAME
   - New perspective on the constraint
   - Different way to interpret their experience
   - Truth that contradicts the limiting belief

2. EVIDENCE
   - Proof the constraint isn't absolute
   - Examples of others who overcame it
   - Logic that dissolves the limitation

3. NEW STORY
   - Empowering narrative to replace limiting one
   - How their past can empower vs limit
   - Bridge from current to desired identity

4. EPIPHANY SEED
   - The "aha moment" that shifts everything
   - The question that makes them reconsider
   - The insight that creates breakthrough

Provide dissolution strategies for top 5-7 constraints (700-900 words).`,
  },
  {
    id: 'epiphanyThreshold',
    name: 'Epiphany Threshold',
    prompt: (context) => `Analyze the Epiphany Threshold - the scale of believability from 1-10.

CONTEXT:
Build A Buyer: ${context.buildABuyer.substring(0, 300)}...
Core Wound: ${context.coreWound.substring(0, 200)}...

The Epiphany Threshold is about what they can believe right now:

1 = Completely unbelievable, triggering, rejected immediately
10 = Completely obvious, already believe it, no epiphany needed

The sweet spot is typically 6-8: Surprising but believable.

Analyze:

1. CURRENT BELIEFS (What they believe now = 10 on their scale)
2. ADJACENT POSSIBLE (What they could believe = 6-8)
3. TOO FAR (What they can't believe yet = 1-5)
4. BRIDGE BELIEFS (Stepping stones from current to desired)

Map the journey:
- Where they are now
- Where they need to be
- The believability steps to get there
- How to meet them where they are

Provide strategic analysis (500-700 words).`,
  },
  {
    id: 'hooks',
    name: 'Hooks (Maze Theory)',
    prompt: (context) => `Generate powerful hooks using Maze Theory.

CONTEXT:
Core Wound: ${context.coreWound.substring(0, 200)}...
Epiphany Threshold: ${context.epiphanyThreshold.substring(0, 200)}...

Create 10 hooks that:
- Promise revelation/epiphany
- Create curiosity gap
- Challenge existing beliefs
- Hint at new mechanism
- Speak to identity transformation

For each hook, provide:
1. The hook itself
2. Why it works psychologically
3. What epiphany it promises
4. What maze it creates

Examples of hook patterns:
- "The real reason why [problem] isn't [what they think]..."
- "Why [surprising thing] is actually [unexpected insight]..."
- "What [authority/group] doesn't want you to know about [topic]..."
- "The [number] [thing] that [outcome] without [effort]..."

Provide 10 hooks with analysis (600-800 words).`,
  },
  {
    id: 'storyPrompts',
    name: 'Story Prompts',
    prompt: (context) => `Create story prompts using Garden of Eden, Problem-Identification-Gap (PIG), and Dark Night frameworks.

CONTEXT:
Core Wound: ${context.coreWound.substring(0, 200)}...
Benefit Matrix: ${context.benefitMatrix.substring(0, 300)}...

Create 3 story frameworks:

1. GARDEN OF EDEN STORY
   - The ideal state (before the fall)
   - What was possible/easy/natural
   - Then something changed...
   - How to return to that state

2. PIG STORY (Problem-Identification-Gap)
   - PROBLEM: The surface problem they know
   - IDENTIFICATION: Helping them identify with it deeply
   - GAP: Revealing the gap between where they are and want to be
   - Bridge: How to cross that gap

3. DARK NIGHT STORY
   - Rock bottom moment
   - The crisis that forced change
   - The revelation that emerged
   - The transformation that followed
   - Why sharing this helps them

For each framework, provide:
- The story structure
- Key emotional beats
- Specific prompts/elements to include
- How it connects to their journey

Provide detailed story frameworks (700-900 words).`,
  },
  {
    id: 'languagePatterns',
    name: 'Language Patterns',
    prompt: (context) => `Identify the specific language patterns and phrases this avatar uses and responds to.

AVATAR DATA:
WEB Analysis: ${JSON.stringify(context.avatar.webAnalysis)}
Empathy Map: What they say: ${context.avatar.empathyMap.saying.join(', ')}

Create a language pattern library:

1. PHRASES THEY USE
   - Exact words/phrases they say
   - Slang or industry jargon
   - How they describe their problem
   - Metaphors they use

2. EMOTIONAL LANGUAGE
   - Words that trigger emotional response
   - Pain language
   - Desire language
   - Transformation language

3. IDENTITY LANGUAGE
   - How they describe themselves
   - Labels they use/avoid
   - Group identifiers
   - Aspiration language

4. OBJECTION LANGUAGE
   - How they voice doubts
   - Phrases that signal resistance
   - Their specific concerns

5. RESONANCE PHRASES
   - Phrases that make them feel understood
   - Language that builds trust
   - Words that inspire action

Provide 20-30 specific phrases with context (600-800 words).`,
  },
  {
    id: 'concentricCircles',
    name: 'Concentric Circles of Concern',
    prompt: (context) => `Map the Concentric Circles of Concern - from self to world.

AVATAR: ${context.buildABuyer.substring(0, 300)}...

Map concerns from innermost to outermost circle:

1. SELF (Innermost)
   - Personal survival/safety
   - Self-image/identity
   - Personal comfort/pleasure
   - Immediate self-interests

2. CLOSE RELATIONSHIPS
   - Family concerns
   - Close friends
   - Intimate relationships
   - People who matter most

3. COMMUNITY/TRIBE
   - Professional community
   - Social circles
   - Cultural group
   - Shared identity groups

4. SOCIETY/WORLD (Outermost)
   - Broader social impact
   - Legacy concerns
   - World-level implications
   - Greater good

Analyze:
- Which circle dominates their thinking?
- What concerns at each level?
- How to ethically appeal to each?
- How your offer addresses each level?
- The hierarchy of their concerns?

Provide strategic analysis (500-700 words).`,
  },
  {
    id: 'ejectionTriggers',
    name: 'Ejection Triggers',
    prompt: (context) => `Identify Ejection Triggers - messaging landmines that cause immediate rejection.

AVATAR CONTEXT:
${context.buildABuyer.substring(0, 300)}...
Beliefs: ${context.avatar.webAnalysis.beliefs.join(', ')}
Constraints: ${context.rhConstraints.substring(0, 300)}...

Identify 10-15 ejection triggers:

For each trigger, document:

1. THE TRIGGER
   - What you should NEVER say/imply
   - Why it causes instant rejection
   - The belief it violates

2. WHY IT EJECTS THEM
   - The psychological reason
   - Past experiences it recalls
   - Identity conflict it creates

3. WHAT TO DO INSTEAD
   - How to navigate around it
   - Reframe or alternative approach
   - The safe/effective alternative

Categories of triggers:
- Identity triggers (threatens self-image)
- Belief triggers (contradicts core belief)
- Value triggers (violates principles)
- Pain triggers (activates defense mechanisms)
- Trust triggers (raises suspicion)

Provide comprehensive trigger analysis (700-900 words).`,
  },
];

export async function runManifoldRoute(req, res) {
  try {
    const { offer, avatar, competitors } = req.body;

    if (!offer || !avatar) {
      return res.status(400).json({
        success: false,
        error: 'Offer and avatar data are required',
      });
    }

    console.log('🧠 Starting Manifold Workflow...');

    const context = {
      offer,
      avatar,
      competitors,
    };

    const results = {};

    // Process each node sequentially
    for (let i = 0; i < MANIFOLD_NODES.length; i++) {
      const node = MANIFOLD_NODES[i];
      console.log(`Processing node ${i + 1}/${MANIFOLD_NODES.length}: ${node.name}`);

      const systemPrompt = `You are an expert copywriter and marketing psychologist specializing in deep avatar analysis 
and persuasion frameworks. You understand Todd Brown's E5 methodology, Eugene Schwartz's levels of awareness, 
and advanced psychological profiling.`;

      const userPrompt = node.prompt(context);

      const response = await callClaude(systemPrompt, userPrompt, {
        temperature: 0.8,
        maxTokens: 2500,
      });

      results[node.id] = response;
      
      // Add to context for subsequent nodes
      context[node.id] = response;
    }

    console.log('✅ Manifold Workflow Complete');

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Manifold workflow error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

