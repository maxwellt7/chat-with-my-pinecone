# NLP Training Tool Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal web app for learning and practicing NLP (Neuro-Linguistic Programming) through structured curriculum, AI-powered quizzes, and interactive roleplay scenarios.

**Architecture:** React + Vite SPA frontend with Node/Express backend. Claude API powers quiz generation, answer evaluation, and practice roleplay. NLP content stored as structured JSON files. Browser localStorage tracks progress. Tailwind CSS for styling.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Node.js, Express, Anthropic SDK (@anthropic-ai/sdk), React Router

**Spec:** `docs/superpowers/specs/2026-03-17-nlp-training-tool-design.md`

**Source PDFs:** `/Users/maxmayes/Maxwellmayes Dropbox/Maxwell Mayes/01. Professional/NLP/`

---

## Chunk 1: Project Scaffolding + Content Data Files

### Task 1: Scaffold the project

**Files:**
- Create: `nlp-training-tool/package.json`
- Create: `nlp-training-tool/vite.config.ts`
- Create: `nlp-training-tool/tsconfig.json`
- Create: `nlp-training-tool/tsconfig.node.json`
- Create: `nlp-training-tool/index.html`
- Create: `nlp-training-tool/src/main.tsx`
- Create: `nlp-training-tool/src/index.css`
- Create: `nlp-training-tool/src/App.tsx`
- Create: `nlp-training-tool/server/package.json`
- Create: `nlp-training-tool/.env.example`
- Create: `nlp-training-tool/.gitignore`

- [ ] **Step 1: Create project directory and initialize frontend**

```bash
mkdir -p nlp-training-tool && cd nlp-training-tool
npm create vite@latest . -- --template react-ts
```

Select React + TypeScript when prompted.

- [ ] **Step 2: Install frontend dependencies**

```bash
cd nlp-training-tool
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Tailwind CSS**

In `src/index.css`, replace contents with:
```css
@import "tailwindcss";
```

In `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

- [ ] **Step 4: Set up server directory**

```bash
mkdir -p nlp-training-tool/server
cd nlp-training-tool/server
npm init -y
npm install express cors dotenv @anthropic-ai/sdk
npm install -D nodemon
```

- [ ] **Step 5: Create .env.example and .gitignore**

`.env.example`:
```
ANTHROPIC_API_KEY=your_key_here
PORT=3001
```

`.gitignore`:
```
node_modules/
dist/
.env
```

- [ ] **Step 6: Create minimal server entry**

`server/index.js`:
```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Update `server/package.json` to add `"type": "module"` and scripts:
```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

- [ ] **Step 7: Create minimal App.tsx with router**

`src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Routes>
          <Route path="/" element={<div className="p-8 text-2xl">NLP Training Tool</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 8: Verify both frontend and backend start**

```bash
# Terminal 1
cd nlp-training-tool && npm run dev
# Terminal 2
cd nlp-training-tool/server && npm run dev
```

Expected: Vite dev server on :5173 showing "NLP Training Tool". Express on :3001, `/api/health` returns `{"status":"ok"}`.

- [ ] **Step 9: Commit**

```bash
cd nlp-training-tool
git init
git add -A
git commit -m "feat: scaffold project with Vite + React + Express + Tailwind"
```

---

### Task 2: Extract and structure NLP content into JSON data files

**Files:**
- Create: `nlp-training-tool/server/data/modules.json`
- Create: `nlp-training-tool/server/data/milton-model.json`
- Create: `nlp-training-tool/server/data/meta-programs.json`
- Create: `nlp-training-tool/server/data/presuppositions.json`
- Create: `nlp-training-tool/server/data/prime-directives.json`
- Create: `nlp-training-tool/server/data/quantum-linguistics.json`
- Create: `nlp-training-tool/server/data/personal-breakthrough.json`

**Important:** All content must be extracted from the source PDFs at `/Users/maxmayes/Maxwellmayes Dropbox/Maxwell Mayes/01. Professional/NLP/`. Read each PDF and structure the content into the JSON schemas below.

- [ ] **Step 1: Create modules.json — curriculum structure**

This file defines all 6 modules, their lessons, and which data files they reference. Schema:
```json
{
  "modules": [
    {
      "id": "module-1",
      "title": "NLP Foundations",
      "description": "Core concepts of Neuro-Linguistic Programming",
      "lessons": [
        {
          "id": "module-1-lesson-1",
          "title": "What is NLP?",
          "description": "Neuro, Linguistic, Programming definitions + Attitude, Methodology, Techniques",
          "dataFile": "prime-directives.json",
          "contentKeys": ["whatIsNlp"]
        }
      ]
    }
  ]
}
```

Include all 25 lessons across 6 modules as defined in the spec.

- [ ] **Step 2: Create milton-model.json — 19 hypnotic language patterns**

Read the Milton Model PDF. Extract all 19 patterns. Schema per pattern:
```json
{
  "patterns": [
    {
      "id": "mind-reading",
      "name": "Mind Reading",
      "number": 1,
      "definition": "Claiming to know the thoughts or feelings of another without specifying the process by which you came to know the info.",
      "tipOff": "Verbs like 'know', 'wonder', 'think', 'feel' applied to another person",
      "examples": [
        "I know you're wondering...",
        "I know you believe...",
        "I know you came here for a purpose."
      ],
      "category": "milton-model"
    }
  ]
}
```

Include ALL examples from the PDF for each pattern.

- [ ] **Step 3: Create meta-programs.json — 19 MPVI filters**

Read the Complex Meta Programs PDF. Schema per filter:
```json
{
  "filters": [
    {
      "id": "direction-filter",
      "name": "Direction Filter",
      "number": 1,
      "elicitationQuestion": "What do you want in a car (job/relationship)? What's important to you about ___?",
      "options": [
        { "id": "toward", "label": "Toward" },
        { "id": "toward-away", "label": "Toward with a little Away" },
        { "id": "both", "label": "Both Toward and Away equally" },
        { "id": "away-toward", "label": "Away with a little Toward" },
        { "id": "away", "label": "Away" }
      ],
      "linguisticMarkers": {
        "toward": "Here's what we want to achieve. Here are our goals and objectives.",
        "away": "Here's what we want to avoid. This will reduce our potential problems and liabilities.",
        "both": "Here are our goals... and just as important, here is what we want to avoid."
      }
    }
  ]
}
```

Include all 19 filters with all options and linguistic markers from the PDF.

- [ ] **Step 4: Create presuppositions.json**

Two sections: (a) the 14 NLP Presuppositions ("RESPECT UR-WORLD") from the Master Practitioner Manual, and (b) the 9 linguistic presupposition types from Quantum Linguistics section. Schema:
```json
{
  "nlpPresuppositions": [
    {
      "number": 1,
      "keyword": "Respect",
      "text": "Respect for the other person's model of the world.",
      "mnemonicLetter": "R"
    }
  ],
  "linguisticPresuppositions": [
    {
      "number": 1,
      "name": "Existence",
      "tipOff": "Nouns",
      "definition": "The existence of something is presupposed by the use of a noun.",
      "examples": []
    }
  ]
}
```

- [ ] **Step 5: Create prime-directives.json**

All 21 Prime Directives of the Unconscious Mind + the "What is NLP" content + NLP Communication Model + State vs Goal. Schema:
```json
{
  "whatIsNlp": {
    "neuro": { "definition": "The nervous system (the mind), through which our experience is processed via five senses", "senses": ["Visual", "Auditory", "Kinesthetic", "Olfactory", "Gustatory"] },
    "linguistic": { "definition": "Language and other non-verbal communication systems through which our neural representations are coded, ordered and given meaning", "includes": ["Pictures", "Sounds", "Feelings", "Tastes", "Smells", "Words (Self Talk)"] },
    "programming": { "definition": "The ability to discover and utilize the programs that we run in our neurological systems to achieve our specific and desired outcomes" }
  },
  "whatIsItReally": {
    "attitude": ["Curiosity", "Willingness to Experiment"],
    "methodology": ["Modeling", "De-nominalization", "Continual Experimentation"],
    "techniques": "The Techniques That Are Taught as NLP"
  },
  "primeDirectives": [
    { "number": 1, "text": "Stores memories", "details": "Temporal (in relationship to time), Atemporal (not in relationship to time)" }
  ],
  "communicationModel": {
    "description": "External Event → Filters (Delete, Distort, Generalize) → Internal Representation → State → Physiology → Behavior",
    "filters": ["Time/Space", "Matter/Energy", "Language", "Memories", "Decisions", "Meta Programs", "Values & Beliefs", "Attitudes"]
  },
  "stateVsGoal": {
    "states": ["Stated ambiguously", "Write affirmations", "You can have it now", "No steps", "Infinite", "Stated for self and/or others"],
    "goals": ["Stated specifically", "Write goals/outcomes", "Time is involved", "Steps needed to get there", "Measurable", "Stated for self only"]
  }
}
```

- [ ] **Step 6: Create quantum-linguistics.json**

Embedded Commands, Cartesian Coordinates, Symbolic Logic, Inductive/Deductive Language. Schema:
```json
{
  "embeddedCommands": {
    "definition": "Two Elements: 2 times (or 2 words) MEANS — 'How to do it.' 1 time (or 1 word) END — 'What to do.' The key is three in a single sentence. Delivered LOWER & LOUDER!",
    "steps": ["Decide Outcome", "Develop Sentence", "Deliver It", "Calibrate for Results — Outcome"]
  },
  "cartesianCoordinates": {
    "theorem": { "formula": "AB", "question": "What would happen if you did?" },
    "converse": { "formula": "~AB", "question": "What wouldn't happen if you did?" },
    "inverse": { "formula": "A~B", "question": "What would happen if you didn't?" },
    "nonMirror": { "formula": "~A~B", "question": "What wouldn't happen if you didn't?" }
  },
  "symbolicLogic": ["And", "Or (Inclusive Or)", "Not", "Not equal to", "If... Then", "Less Than", "Greater Than", "Either-or, neither-nor (Exclusive Or)", "Equivalent", "Causes", "Universal quantifiers, Total"],
  "inductiveDeductive": {
    "deduction": { "definition": "From general to specific", "example": "Since I can't drive any car, I won't be able to drive a Cadillac." },
    "induction": { "definition": "From specific to general", "example": "If I can learn to do this, I can learn anything." }
  }
}
```

- [ ] **Step 7: Create personal-breakthrough.json**

Full session flow from the Personal Breakthrough PDF. Schema:
```json
{
  "preSession": {
    "screeningQuestions": [
      "For how long have you had this problem? What have you done about it?",
      "How intense are your feelings which are associated with the problem (1-10)?",
      "Can you get in touch with the emotions as we talk?"
    ]
  },
  "detailedPersonalHistory": [
    { "number": 1, "question": "Why are you here? Why else? Why else? Etc.", "purpose": "Elicit all reasons for client being here." }
  ],
  "interventionSteps": [
    { "number": 10, "title": "Pain Paradigm", "description": "If you are doing Pain Paradigm, do it here and then take a week's break (minimum)." }
  ],
  "completingSession": [
    { "number": 24, "title": "Remind the Client", "description": "The three requisites for change: Getting rid of Negative Emotions, Limiting Decisions, Parts Integration, Values, Create the Future; Taking Action; Focusing on What You Want." }
  ]
}
```

- [ ] **Step 8: Verify all JSON files parse correctly**

```bash
cd nlp-training-tool/server/data
for f in *.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8')); console.log('OK: $f')"; done
```

Expected: All files print "OK: filename.json"

- [ ] **Step 9: Commit**

```bash
git add server/data/
git commit -m "feat: add structured NLP content data files extracted from training manuals"
```

---

### Task 3: Create AI system prompts

**Files:**
- Create: `nlp-training-tool/server/data/prompts/tutor.txt`
- Create: `nlp-training-tool/server/data/prompts/quiz-master.txt`
- Create: `nlp-training-tool/server/data/prompts/practice-coach.txt`

- [ ] **Step 1: Create tutor.txt**

```
You are an NLP Master Practitioner instructor. You teach Neuro-Linguistic Programming concepts based on the NLP Supremacy training materials.

Your knowledge base is provided below as structured content. Only teach from this content — do not introduce concepts from outside these materials.

When explaining concepts:
- Use clear, direct language
- Reference specific examples from the training materials
- Adapt your depth based on the student's questions
- Use the NLP terminology consistently as defined in the materials
- When asked about a pattern, always include: definition, tip-off words, and at least 2 examples

You are teaching a single student who is working through a self-study curriculum. Be encouraging but precise.

KNOWLEDGE BASE:
{{CONTENT}}
```

- [ ] **Step 2: Create quiz-master.txt**

```
You are an NLP exam evaluator. You generate quiz questions and evaluate answers based on the NLP Supremacy training materials.

GENERATING QUIZZES:
When asked to generate a quiz, create exactly 5 questions based on the lesson content provided. Return a JSON array of question objects.

Question types to use (mix them):
- "multiple_choice": provide question, 4 options, and correctAnswer
- "pattern_identification": provide a sentence, ask student to identify all NLP patterns present, include expectedPatterns array
- "construction": provide a prompt asking student to write a sentence using specific pattern(s)
- "meta_program_match": provide a scenario/response, ask which filter result it exhibits, include options and correctAnswer

EVALUATING ANSWERS:
When evaluating student answers:
- For multiple_choice and meta_program_match: score as correct/incorrect, explain why
- For pattern_identification: score based on how many patterns were correctly identified vs missed, partial credit allowed
- For construction: evaluate whether the sentence correctly demonstrates the requested pattern(s), provide specific feedback on what works and what could improve

Return JSON with this structure:
{
  "results": [
    { "questionIndex": 0, "correct": true, "score": 100, "feedback": "..." }
  ],
  "overallScore": 85,
  "summary": "..."
}

Accept valid alternative interpretations. NLP patterns can overlap and a single sentence may demonstrate multiple patterns — give credit for valid identifications even if they differ from the expected answer.

KNOWLEDGE BASE:
{{CONTENT}}
```

- [ ] **Step 3: Create practice-coach.txt**

```
You are an NLP Practice Coach with a dual role:

1. IN-CHARACTER PERSONA: You play a realistic character in the scenario described below. Stay in character — respond naturally as that person would, exhibiting the traits and meta program profile assigned to you.

2. NLP COACH (coached mode only): After responding in character, analyze the student's message for NLP patterns used and provide coaching feedback.

RESPONSE FORMAT:
Always respond in valid JSON.

In COACHED mode, return:
{
  "dialogue": "Your in-character response here",
  "coaching": {
    "patternsUsed": ["list of NLP patterns the student used in their last message"],
    "effectiveness": "Brief assessment of how well the patterns were applied",
    "suggestions": ["1-2 specific suggestions for what to try next"],
    "missedOpportunities": ["patterns or techniques that would have been effective here but weren't used"]
  }
}

In UNCOACHED mode, return:
{
  "dialogue": "Your in-character response here"
}

For DEBRIEF requests, return:
{
  "summary": "Overview of the session",
  "patternsUsed": { "Pattern Name": count },
  "totalPatterns": number,
  "missedOpportunities": ["..."],
  "strengths": ["..."],
  "areasToImprove": ["..."],
  "suggestedNextPractice": "scenario-id"
}

SCENARIO DESCRIPTIONS:

SALES: You are a business prospect considering a purchase. You have a specific meta program profile (provided in the scenario setup). Respond authentically to the student's sales approach. Be skeptical but persuadable with the right techniques.

COACHING: You are a client seeking help with a personal problem. Present your situation gradually — don't dump everything at once. Respond to the student's questions naturally. Have a backstory with specific events, emotions, and limiting decisions that the student should uncover through proper questioning.

NEGOTIATION: You are a counterparty in a business negotiation. You have a position and interests. Be willing to move if the student uses effective chunking, Cartesian Coordinates, and matches your meta programs.

PATTERN_DRILL: Speak in NLP-loaded language. Use 2-4 Milton Model patterns per message. After the student identifies the patterns, confirm which ones they got right and explain any they missed.

FREE: Play whatever character the student describes. Adapt your behavior based on the scenario they set up.

KNOWLEDGE BASE:
{{CONTENT}}
```

- [ ] **Step 4: Commit**

```bash
git add server/data/prompts/
git commit -m "feat: add AI system prompts for tutor, quiz-master, and practice-coach"
```

---

## Chunk 2: Backend API Routes

### Task 4: Create Anthropic client config

**Files:**
- Create: `nlp-training-tool/server/config/anthropic.js`

- [ ] **Step 1: Create anthropic.js**

```js
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default anthropic;
```

- [ ] **Step 2: Commit**

```bash
git add server/config/
git commit -m "feat: add Anthropic client config"
```

---

### Task 5: Create learn routes (lesson content + quiz generation/evaluation)

**Files:**
- Create: `nlp-training-tool/server/routes/learn.js`
- Modify: `nlp-training-tool/server/index.js`

- [ ] **Step 1: Create learn.js with three endpoints**

`server/routes/learn.js`:
```js
import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import anthropic from '../config/anthropic.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

function loadData(filename) {
  return JSON.parse(readFileSync(join(__dirname, '..', 'data', filename), 'utf8'));
}

function loadPrompt(filename) {
  return readFileSync(join(__dirname, '..', 'data', 'prompts', filename), 'utf8');
}

function getContentForLesson(lessonId) {
  const modules = loadData('modules.json');
  let lesson = null;
  let module = null;
  for (const mod of modules.modules) {
    const found = mod.lessons.find(l => l.id === lessonId);
    if (found) { lesson = found; module = mod; break; }
  }
  if (!lesson) return null;

  const dataFile = loadData(lesson.dataFile);
  const content = lesson.contentKeys
    ? lesson.contentKeys.map(key => ({ key, data: dataFile[key] }))
    : [{ key: 'all', data: dataFile }];

  return { lesson, module, content };
}

// GET /api/learn/modules — return curriculum structure
router.get('/modules', (req, res) => {
  const modules = loadData('modules.json');
  res.json(modules);
});

// GET /api/learn/lesson/:lessonId — return lesson content
router.get('/lesson/:lessonId', (req, res) => {
  const result = getContentForLesson(req.params.lessonId);
  if (!result) return res.status(404).json({ error: 'Lesson not found' });
  res.json(result);
});

// POST /api/learn/quiz — generate quiz for a lesson
router.post('/quiz', async (req, res) => {
  const { lessonId } = req.body;
  const result = getContentForLesson(lessonId);
  if (!result) return res.status(404).json({ error: 'Lesson not found' });

  const promptTemplate = loadPrompt('quiz-master.txt');
  const systemPrompt = promptTemplate.replace('{{CONTENT}}', JSON.stringify(result.content, null, 2));

  try {
    // Module-specific quiz type guidance
    const moduleNum = parseInt(result.module.id.replace('module-', ''));
    let quizTypeGuidance = '';
    if (moduleNum >= 1 && moduleNum <= 4) {
      quizTypeGuidance = 'Focus on multiple_choice, pattern_identification, and construction question types.';
    } else if (moduleNum === 5) {
      quizTypeGuidance = 'Focus on meta_program_match questions and linguistic marker selection. Ask students to identify filter results and choose appropriate linguistic markers.';
    } else if (moduleNum === 6) {
      quizTypeGuidance = 'Focus on scenario-based questions about session flow, intervention order, and appropriate questions to ask at each stage.';
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Generate a quiz with 5 questions for this lesson: "${result.lesson.title}" (${result.module.title}). The lesson covers: ${result.lesson.description}. ${quizTypeGuidance} Return ONLY a JSON array of question objects, no other text.`
      }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const questions = JSON.parse(jsonMatch[0]);
    res.json({ questions });
  } catch (err) {
    console.error('Quiz generation error:', err);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// POST /api/learn/quiz/evaluate — evaluate quiz answers
router.post('/quiz/evaluate', async (req, res) => {
  const { lessonId, questions, userAnswers } = req.body;
  const result = getContentForLesson(lessonId);
  if (!result) return res.status(404).json({ error: 'Lesson not found' });

  const promptTemplate = loadPrompt('quiz-master.txt');
  const systemPrompt = promptTemplate.replace('{{CONTENT}}', JSON.stringify(result.content, null, 2));

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Evaluate these quiz answers. Return ONLY valid JSON with the results structure.\n\nQuestions: ${JSON.stringify(questions)}\n\nStudent Answers: ${JSON.stringify(userAnswers)}`
      }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const evaluation = JSON.parse(jsonMatch[0]);
    res.json(evaluation);
  } catch (err) {
    console.error('Quiz evaluation error:', err);
    res.status(500).json({ error: 'Failed to evaluate quiz' });
  }
});

export default router;
```

- [ ] **Step 2: Register learn routes in server/index.js**

Add to `server/index.js`:
```js
import learnRoutes from './routes/learn.js';
app.use('/api/learn', learnRoutes);
```

- [ ] **Step 3: Test the modules endpoint**

```bash
curl http://localhost:3001/api/learn/modules | head -c 200
```

Expected: JSON with modules array

- [ ] **Step 4: Commit**

```bash
git add server/routes/learn.js server/index.js
git commit -m "feat: add learn API routes for lessons, quiz generation, and evaluation"
```

---

### Task 6: Create practice routes (chat + debrief)

**Files:**
- Create: `nlp-training-tool/server/routes/practice.js`
- Modify: `nlp-training-tool/server/index.js`

- [ ] **Step 1: Create practice.js**

`server/routes/practice.js`:
```js
import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import anthropic from '../config/anthropic.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

function loadAllContent() {
  const dataDir = join(__dirname, '..', 'data');
  const files = ['milton-model.json', 'meta-programs.json', 'presuppositions.json', 'prime-directives.json', 'quantum-linguistics.json', 'personal-breakthrough.json'];
  const content = {};
  for (const f of files) {
    const key = f.replace('.json', '');
    content[key] = JSON.parse(readFileSync(join(dataDir, f), 'utf8'));
  }
  return content;
}

function loadPrompt(filename) {
  return readFileSync(join(__dirname, '..', 'data', 'prompts', filename), 'utf8');
}

const SCENARIO_SETUPS = {
  sales: "You are a business prospect named Alex considering purchasing a marketing automation platform. Your meta program profile: Direction=Away with some Toward, Reason=Necessity, Frame of Reference=External, Action=Reflective, Chunk Size=Specific. You're skeptical but open. Start by saying something like 'So tell me about this platform. I've been burned before by overpromising vendors.'",
  coaching: "You are a client named Jordan, age 35. Your presenting problem: you feel stuck in your career and keep self-sabotaging when opportunities arise. Root cause: a limiting decision made at age 12 when a teacher publicly ridiculed you. You carry anger (at the teacher), sadness (at lost opportunities), and fear (of being judged). Reveal these gradually through proper questioning — don't volunteer everything upfront.",
  negotiation: "You are a business partner named Morgan negotiating the terms of a joint venture. You want 60% equity because you're bringing the customer base. You're willing to go to 50/50 if the other party demonstrates strong value. Your meta programs: Direction=Toward, Frame of Reference=Internal, Relationship=Differences, Chunk Size=Global.",
  'pattern-drill': "In this drill, YOU speak in NLP-loaded language. Use 2-4 Milton Model patterns in each message. Speak naturally — weave the patterns into conversational language about personal development topics. After the student identifies the patterns in your message, confirm which ones they got right and explain any they missed. Start with a message using 3 patterns.",
  free: "The student will describe a scenario. Adapt to play whatever role they assign you. Respond naturally and consistently with the character described."
};

// POST /api/practice/chat — send a message in a practice session
router.post('/chat', async (req, res) => {
  const { scenario, messages, coached, scenarioSetup } = req.body;

  const content = loadAllContent();
  const promptTemplate = loadPrompt('practice-coach.txt');
  let systemPrompt = promptTemplate.replace('{{CONTENT}}', JSON.stringify(content, null, 2));

  const setup = SCENARIO_SETUPS[scenario] || SCENARIO_SETUPS.free;
  const modeInstruction = coached
    ? 'Respond in COACHED mode — include both dialogue and coaching analysis in your JSON response.'
    : 'Respond in UNCOACHED mode — include only dialogue in your JSON response.';

  systemPrompt += `\n\nACTIVE SCENARIO: ${scenario.toUpperCase()}\n${scenarioSetup || setup}\n\n${modeInstruction}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, just the JSON object.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (err) {
    console.error('Practice chat error:', err);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

// POST /api/practice/debrief — get end-of-session debrief
router.post('/debrief', async (req, res) => {
  const { scenario, messages } = req.body;

  const content = loadAllContent();
  const promptTemplate = loadPrompt('practice-coach.txt');
  let systemPrompt = promptTemplate.replace('{{CONTENT}}', JSON.stringify(content, null, 2));

  systemPrompt += `\n\nThe student is requesting a DEBRIEF of their ${scenario} practice session. Analyze the full conversation history and return a structured debrief JSON. Return ONLY valid JSON.`;

  try {
    const allMessages = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: 'Please provide a detailed debrief of this practice session. Analyze all the NLP patterns I used, what I did well, and where I can improve.' }
    ];

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: allMessages
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (err) {
    console.error('Debrief error:', err);
    res.status(500).json({ error: 'Failed to generate debrief' });
  }
});

export default router;
```

- [ ] **Step 2: Register practice routes in server/index.js**

Add to `server/index.js`:
```js
import practiceRoutes from './routes/practice.js';
app.use('/api/practice', practiceRoutes);
```

- [ ] **Step 3: Commit**

```bash
git add server/routes/practice.js server/index.js
git commit -m "feat: add practice API routes for chat and debrief"
```

---

## Chunk 3: Frontend — Layout, Navigation, and Dashboard

### Task 7: Create Layout component with sidebar navigation

**Files:**
- Create: `nlp-training-tool/src/components/Layout.tsx`
- Modify: `nlp-training-tool/src/App.tsx`

- [ ] **Step 1: Create Layout.tsx**

```tsx
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◉' },
  { to: '/learn', label: 'Learn', icon: '◈' },
  { to: '/practice', label: 'Practice', icon: '◇' },
  { to: '/reference', label: 'Reference', icon: '◆' },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <nav className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-1 shrink-0">
        <h1 className="text-lg font-bold mb-6 px-3 text-white">NLP Trainer</h1>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Update App.tsx with routes**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

function Placeholder({ title }: { title: string }) {
  return <div className="p-8 text-2xl text-gray-400">{title} — Coming Soon</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Placeholder title="Dashboard" />} />
          <Route path="/learn" element={<Placeholder title="Learn" />} />
          <Route path="/learn/:lessonId" element={<Placeholder title="Lesson" />} />
          <Route path="/practice" element={<Placeholder title="Practice" />} />
          <Route path="/reference" element={<Placeholder title="Reference" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 3: Verify navigation works**

Start frontend, click through all nav links. Each should highlight and show the placeholder text.

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout.tsx src/App.tsx
git commit -m "feat: add sidebar layout with navigation"
```

---

### Task 8: Create API client service

**Files:**
- Create: `nlp-training-tool/src/services/api.ts`

- [ ] **Step 1: Create api.ts**

```ts
const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Learn
  getModules: () => request<any>('/learn/modules'),
  getLesson: (lessonId: string) => request<any>(`/learn/lesson/${lessonId}`),
  generateQuiz: (lessonId: string) =>
    request<any>('/learn/quiz', { method: 'POST', body: JSON.stringify({ lessonId }) }),
  evaluateQuiz: (lessonId: string, questions: any[], userAnswers: any[]) =>
    request<any>('/learn/quiz/evaluate', {
      method: 'POST',
      body: JSON.stringify({ lessonId, questions, userAnswers }),
    }),

  // Practice
  sendMessage: (scenario: string, messages: any[], coached: boolean, scenarioSetup?: string) =>
    request<any>('/practice/chat', {
      method: 'POST',
      body: JSON.stringify({ scenario, messages, coached, scenarioSetup }),
    }),
  getDebrief: (scenario: string, messages: any[]) =>
    request<any>('/practice/debrief', {
      method: 'POST',
      body: JSON.stringify({ scenario, messages }),
    }),
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/api.ts
git commit -m "feat: add API client service"
```

---

### Task 9: Create progress tracking hook

**Files:**
- Create: `nlp-training-tool/src/hooks/useProgress.ts`

- [ ] **Step 1: Create useProgress.ts**

```ts
import { useState, useCallback } from 'react';

interface LessonProgress {
  completed: boolean;
  quizScore: number | null;
  completedAt: string | null;
}

interface PracticeProgress {
  sessionsCompleted: number;
  scenarios: Record<string, number>;
}

interface Progress {
  lessons: Record<string, LessonProgress>;
  practice: PracticeProgress;
  lastAccessed: string;
}

const STORAGE_KEY = 'nlp-training-progress';

const defaultProgress: Progress = {
  lessons: {},
  practice: {
    sessionsCompleted: 0,
    scenarios: { sales: 0, coaching: 0, negotiation: 0, 'pattern-drill': 0, free: 0 },
  },
  lastAccessed: new Date().toISOString().split('T')[0],
};

function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { ...defaultProgress };
}

function saveProgress(progress: Progress): boolean {
  progress.lastAccessed = new Date().toISOString().split('T')[0];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (e) {
    console.warn('localStorage full:', e);
    return false;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  const completeLesson = useCallback((lessonId: string, quizScore: number | null) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            completed: true,
            quizScore,
            completedAt: new Date().toISOString().split('T')[0],
          },
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const recordPracticeSession = useCallback((scenario: string) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        practice: {
          sessionsCompleted: prev.practice.sessionsCompleted + 1,
          scenarios: {
            ...prev.practice.scenarios,
            [scenario]: (prev.practice.scenarios[scenario] || 0) + 1,
          },
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultProgress };
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return { progress, completeLesson, recordPracticeSession, resetProgress };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useProgress.ts
git commit -m "feat: add progress tracking hook with localStorage persistence"
```

---

### Task 10: Build Dashboard page

**Files:**
- Create: `nlp-training-tool/src/pages/Dashboard.tsx`
- Modify: `nlp-training-tool/src/App.tsx`

- [ ] **Step 1: Create Dashboard.tsx**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useProgress } from '../hooks/useProgress';

export default function Dashboard() {
  const { progress } = useProgress();
  const [modules, setModules] = useState<any>(null);

  useEffect(() => {
    api.getModules().then(setModules).catch(console.error);
  }, []);

  const totalLessons = modules?.modules?.reduce((sum: number, m: any) => sum + m.lessons.length, 0) || 0;
  const completedLessons = Object.values(progress.lessons).filter(l => l.completed).length;

  const quizScores = Object.values(progress.lessons)
    .map(l => l.quizScore)
    .filter((s): s is number => s !== null);
  const avgQuiz = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  // Suggested next action
  let suggestion = { text: 'Start your first lesson', link: '/learn' };
  if (modules?.modules) {
    const allLessons = modules.modules.flatMap((m: any) => m.lessons);
    const nextIncomplete = allLessons.find((l: any) => !progress.lessons[l.id]?.completed);
    if (nextIncomplete) {
      suggestion = { text: `Continue: ${nextIncomplete.title}`, link: `/learn/${nextIncomplete.id}` };
    } else if (avgQuiz < 80 && quizScores.length > 0) {
      const lowLesson = Object.entries(progress.lessons).find(([, v]) => v.quizScore !== null && v.quizScore < 80);
      if (lowLesson) {
        suggestion = { text: `Retake quiz: ${lowLesson[0]}`, link: `/learn/${lowLesson[0]}` };
      }
    } else if (progress.practice.sessionsCompleted < 3) {
      suggestion = { text: 'Try a practice scenario', link: '/practice' };
    } else {
      const minScenario = Object.entries(progress.practice.scenarios)
        .sort(([, a], [, b]) => a - b)[0];
      suggestion = { text: `Practice more: ${minScenario[0]}`, link: '/practice' };
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-indigo-400">{completedLessons}/{totalLessons}</div>
          <div className="text-sm text-gray-400 mt-1">Lessons Completed</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-emerald-400">{avgQuiz}%</div>
          <div className="text-sm text-gray-400 mt-1">Quiz Accuracy</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-amber-400">{progress.practice.sessionsCompleted}</div>
          <div className="text-sm text-gray-400 mt-1">Practice Sessions</div>
        </div>
      </div>

      <Link
        to={suggestion.link}
        className="block bg-indigo-600 hover:bg-indigo-500 rounded-xl p-6 mb-8 transition-colors"
      >
        <div className="text-sm text-indigo-200">Suggested Next</div>
        <div className="text-lg font-semibold">{suggestion.text}</div>
      </Link>

      {progress.practice.sessionsCompleted > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Practice Breakdown</h2>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(progress.practice.scenarios).map(([name, count]) => (
              <div key={name} className="text-center">
                <div className="text-xl font-bold text-gray-300">{count}</div>
                <div className="text-xs text-gray-500 capitalize">{name.replace('-', ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire Dashboard into App.tsx**

Replace the Dashboard placeholder route:
```tsx
import Dashboard from './pages/Dashboard';
// ...
<Route path="/" element={<Dashboard />} />
```

- [ ] **Step 3: Verify dashboard renders with default state**

Expected: Shows 0/X lessons, 0% quiz, 0 practice sessions, suggestion to start first lesson.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Dashboard.tsx src/App.tsx
git commit -m "feat: add Dashboard page with progress stats and suggestions"
```

---

## Chunk 4: Frontend — Learn Mode (Curriculum + Quizzes)

### Task 11: Build Learn page (curriculum browser)

**Files:**
- Create: `nlp-training-tool/src/pages/Learn.tsx`
- Modify: `nlp-training-tool/src/App.tsx`

- [ ] **Step 1: Create Learn.tsx**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useProgress } from '../hooks/useProgress';

export default function Learn() {
  const [modules, setModules] = useState<any>(null);
  const { progress } = useProgress();

  useEffect(() => {
    api.getModules().then(setModules).catch(console.error);
  }, []);

  if (!modules) return <div className="p-8 text-gray-400">Loading curriculum...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Learn NLP</h1>
      <div className="space-y-6">
        {modules.modules.map((mod: any) => {
          const completedCount = mod.lessons.filter((l: any) => progress.lessons[l.id]?.completed).length;
          return (
            <div key={mod.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{mod.title}</h2>
                  <span className="text-sm text-gray-400">{completedCount}/{mod.lessons.length}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{mod.description}</p>
              </div>
              <div className="divide-y divide-gray-800">
                {mod.lessons.map((lesson: any) => {
                  const lessonProgress = progress.lessons[lesson.id];
                  return (
                    <Link
                      key={lesson.id}
                      to={`/learn/${lesson.id}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
                    >
                      <div>
                        <div className="text-sm font-medium">{lesson.title}</div>
                        <div className="text-xs text-gray-500">{lesson.description}</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {lessonProgress?.quizScore != null && (
                          <span className={`text-xs ${lessonProgress.quizScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {lessonProgress.quizScore}%
                          </span>
                        )}
                        {lessonProgress?.completed && (
                          <span className="text-emerald-400 text-sm">✓</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into App.tsx**

```tsx
import Learn from './pages/Learn';
// ...
<Route path="/learn" element={<Learn />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Learn.tsx src/App.tsx
git commit -m "feat: add Learn page with module and lesson browser"
```

---

### Task 12: Build Quiz component

**Files:**
- Create: `nlp-training-tool/src/components/Quiz.tsx`

- [ ] **Step 1: Create Quiz.tsx**

```tsx
import { useState } from 'react';

interface Question {
  type: string;
  question?: string;
  prompt?: string;
  scenario?: string;
  options?: string[];
  correctAnswer?: string;
  expectedPatterns?: string[];
}

interface QuizResult {
  questionIndex: number;
  correct: boolean;
  score: number;
  feedback: string;
}

interface Props {
  questions: Question[];
  onSubmit: (answers: string[]) => void;
  results: { results: QuizResult[]; overallScore: number; summary: string } | null;
  loading: boolean;
}

export default function Quiz({ questions, onSubmit, results, loading }: Props) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

  const setAnswer = (idx: number, value: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  if (results) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-indigo-400 mb-2">{results.overallScore}%</div>
          <div className="text-gray-400">{results.summary}</div>
        </div>
        {results.results.map((r, i) => (
          <div key={i} className={`rounded-xl p-4 border ${r.correct ? 'border-emerald-800 bg-emerald-950/30' : 'border-red-800 bg-red-950/30'}`}>
            <div className="text-sm font-medium mb-1">
              Q{i + 1}: {questions[i].question || questions[i].prompt || questions[i].scenario}
            </div>
            <div className="text-sm text-gray-300">Your answer: {answers[i]}</div>
            <div className="text-sm text-gray-400 mt-1">{r.feedback}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="text-sm font-medium mb-3">
            Q{i + 1}: {q.question || q.prompt || q.scenario}
          </div>
          {q.options ? (
            <div className="space-y-2">
              {q.options.map(opt => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-800">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={() => setAnswer(i, opt)}
                    className="accent-indigo-500"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              value={answers[i]}
              onChange={e => setAnswer(i, e.target.value)}
              placeholder="Type your answer..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              rows={3}
            />
          )}
        </div>
      ))}
      <button
        onClick={() => onSubmit(answers)}
        disabled={loading || answers.some(a => !a.trim())}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl py-3 font-medium transition-colors"
      >
        {loading ? 'Evaluating...' : 'Submit Answers'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Quiz.tsx
git commit -m "feat: add Quiz component with multiple choice and free-form answer support"
```

---

### Task 13: Build Lesson page (content display + quiz integration)

**Files:**
- Create: `nlp-training-tool/src/pages/Lesson.tsx`
- Create: `nlp-training-tool/src/components/PatternCard.tsx`
- Modify: `nlp-training-tool/src/App.tsx`

- [ ] **Step 1: Create PatternCard.tsx**

```tsx
interface Props {
  name: string;
  definition: string;
  tipOff?: string;
  examples?: string[];
  number?: number;
}

export default function PatternCard({ name, definition, tipOff, examples, number }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-start gap-3">
        {number && (
          <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            {number}
          </span>
        )}
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-gray-300 mt-1">{definition}</p>
          {tipOff && (
            <p className="text-xs text-indigo-400 mt-2">Tip-off: {tipOff}</p>
          )}
          {examples && examples.length > 0 && (
            <div className="mt-3 space-y-1">
              {examples.slice(0, 5).map((ex, i) => (
                <p key={i} className="text-sm text-gray-400 italic">"{ex}"</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Lesson.tsx**

```tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useProgress } from '../hooks/useProgress';
import PatternCard from '../components/PatternCard';
import Quiz from '../components/Quiz';

export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { progress, completeLesson } = useProgress();
  const [lesson, setLesson] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState<any[] | null>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    api.getLesson(lessonId).then(setLesson).catch(console.error);
    setShowQuiz(false);
    setQuestions(null);
    setQuizResults(null);
  }, [lessonId]);

  const startQuiz = async () => {
    if (!lessonId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateQuiz(lessonId);
      setQuestions(data.questions);
      setShowQuiz(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async (answers: string[]) => {
    if (!lessonId || !questions) return;
    setLoading(true);
    try {
      const results = await api.evaluateQuiz(lessonId, questions, answers);
      setQuizResults(results);
      completeLesson(lessonId, results.overallScore);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!lesson) return <div className="p-8 text-gray-400">Loading lesson...</div>;

  const renderContent = (data: any) => {
    if (Array.isArray(data)) {
      return data.map((item: any, i: number) => {
        if (item.name || item.text) {
          return <PatternCard key={i} name={item.name || `#${item.number}`} definition={item.definition || item.text || item.details || ''} tipOff={item.tipOff} examples={item.examples} number={item.number} />;
        }
        return <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-sm text-gray-300">{JSON.stringify(item)}</div>;
      });
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]: [string, any]) => {
        if (Array.isArray(value)) {
          return (
            <div key={key} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
              <div className="space-y-3">{renderContent(value)}</div>
            </div>
          );
        }
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={key} className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-3">
              <h3 className="font-semibold capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</h3>
              <div className="text-sm text-gray-300 space-y-1">
                {Object.entries(value).map(([k, v]) => (
                  <div key={k}><span className="text-gray-500">{k}:</span> {Array.isArray(v) ? v.join(', ') : String(v)}</div>
                ))}
              </div>
            </div>
          );
        }
        return <div key={key} className="text-sm text-gray-300 mb-2"><span className="text-gray-500">{key}:</span> {String(value)}</div>;
      });
    }
    return <div className="text-sm text-gray-300">{String(data)}</div>;
  };

  return (
    <div className="p-8 max-w-4xl">
      <Link to="/learn" className="text-sm text-gray-400 hover:text-white mb-4 inline-block">← Back to Curriculum</Link>
      <h1 className="text-2xl font-bold mb-2">{lesson.lesson.title}</h1>
      <p className="text-gray-400 mb-6">{lesson.lesson.description}</p>

      {!showQuiz ? (
        <>
          <div className="space-y-4 mb-8">
            {lesson.content.map((section: any, i: number) => (
              <div key={i}>{renderContent(section.data)}</div>
            ))}
          </div>
          <button
            onClick={startQuiz}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 rounded-xl px-6 py-3 font-medium transition-colors"
          >
            {loading ? 'Generating Quiz...' : 'Take Quiz'}
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </>
      ) : questions ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Quiz</h2>
          <Quiz questions={questions} onSubmit={submitQuiz} results={quizResults} loading={loading} />
          {quizResults && (
            <Link to="/learn" className="inline-block mt-6 text-indigo-400 hover:text-indigo-300">
              ← Back to Curriculum
            </Link>
          )}
        </>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 3: Wire into App.tsx**

```tsx
import Lesson from './pages/Lesson';
// ...
<Route path="/learn/:lessonId" element={<Lesson />} />
```

- [ ] **Step 4: Verify lesson page loads and displays content**

Navigate to `/learn`, click a lesson. Content should render. Click "Take Quiz" — should generate questions (requires API key in `.env`).

- [ ] **Step 5: Commit**

```bash
git add src/pages/Lesson.tsx src/components/PatternCard.tsx src/App.tsx
git commit -m "feat: add Lesson page with content rendering and quiz integration"
```

---

## Chunk 5: Frontend — Practice Mode

### Task 14: Build Chat component

**Files:**
- Create: `nlp-training-tool/src/components/Chat.tsx`

- [ ] **Step 1: Create Chat.tsx**

```tsx
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean;
  coaching?: {
    patternsUsed: string[];
    effectiveness: string;
    suggestions: string[];
    missedOpportunities: string[];
  };
}

interface Props {
  messages: Message[];
  onSend: (message: string) => void;
  loading: boolean;
  coached: boolean;
  disabled?: boolean;
}

export default function Chat({ messages, onSend, loading, coached, disabled }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.filter(msg => !msg.hidden).map((msg, i) => (
          <div key={i}>
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}>
                {msg.content}
              </div>
            </div>
            {coached && msg.coaching && (
              <div className="mt-2 ml-2 bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-3 max-w-[80%]">
                <div className="text-xs font-semibold text-emerald-400 mb-1">Coaching</div>
                {msg.coaching.patternsUsed.length > 0 && (
                  <div className="text-xs text-gray-300 mb-1">
                    <span className="text-emerald-400">Patterns used:</span> {msg.coaching.patternsUsed.join(', ')}
                  </div>
                )}
                <div className="text-xs text-gray-400 mb-1">{msg.coaching.effectiveness}</div>
                {msg.coaching.suggestions.length > 0 && (
                  <div className="text-xs text-gray-400">
                    <span className="text-amber-400">Try:</span> {msg.coaching.suggestions[0]}
                  </div>
                )}
                {msg.coaching.missedOpportunities.length > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    <span className="text-red-400">Missed:</span> {msg.coaching.missedOpportunities[0]}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-400">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-gray-800 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading || disabled}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading || disabled}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Chat.tsx
git commit -m "feat: add Chat component with message bubbles and coaching panel"
```

---

### Task 15: Build Practice page (scenario selection + chat + debrief)

**Files:**
- Create: `nlp-training-tool/src/pages/Practice.tsx`
- Modify: `nlp-training-tool/src/App.tsx`

- [ ] **Step 1: Create Practice.tsx**

```tsx
import { useState } from 'react';
import { api } from '../services/api';
import { useProgress } from '../hooks/useProgress';
import Chat from '../components/Chat';

const SCENARIOS = [
  { id: 'sales', name: 'Sales Conversation', description: 'Practice Milton Model patterns and meta program matching with a prospect' },
  { id: 'coaching', name: 'Coaching Session', description: 'Run a Personal Breakthrough Session with a client' },
  { id: 'negotiation', name: 'Negotiation', description: 'Practice chunking, Cartesian Coordinates, and rapport in a deal' },
  { id: 'pattern-drill', name: 'Pattern Recognition', description: 'Identify Milton Model patterns in NLP-loaded language' },
  { id: 'free', name: 'Free Practice', description: 'Describe any scenario and practice your NLP skills' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean;
  coaching?: any;
}

export default function Practice() {
  const [scenario, setScenario] = useState<string | null>(null);
  const [coached, setCoached] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [debrief, setDebrief] = useState<any>(null);
  const [freeSetup, setFreeSetup] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const { recordPracticeSession } = useProgress();

  const MAX_MESSAGES = 50;

  const startSession = async () => {
    if (!scenario) return;
    setSessionStarted(true);
    setMessages([]);
    setDebrief(null);

    // For non-free scenarios, get the first AI message
    if (scenario !== 'free') {
      setLoading(true);
      try {
        const initContent = 'Start the scenario. Give me your opening line in character.';
        const response = await api.sendMessage(
          scenario,
          [{ role: 'user', content: initContent }],
          coached
        );
        // Include the init prompt in messages (hidden=true) so conversation history stays valid for subsequent API calls
        setMessages([
          { role: 'user', content: initContent, hidden: true },
          { role: 'assistant', content: response.dialogue, coaching: response.coaching },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const sendMessage = async (content: string) => {
    if (messages.length >= MAX_MESSAGES) return;

    const userMsg: Message = { role: 'user', content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const apiMessages = updated.map(m => ({ role: m.role, content: m.content }));
      const response = await api.sendMessage(
        scenario!,
        apiMessages,
        coached,
        scenario === 'free' ? freeSetup : undefined
      );
      setMessages([...updated, {
        role: 'assistant',
        content: response.dialogue,
        coaching: response.coaching,
      }]);
      setError(null);
      setLastFailedMessage(null);
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
      setLastFailedMessage(content);
      // Remove the user message that failed
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!scenario || messages.length === 0) return;
    setLoading(true);
    try {
      const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));
      const result = await api.getDebrief(scenario, apiMessages);
      setDebrief(result);
      recordPracticeSession(scenario);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setScenario(null);
    setMessages([]);
    setDebrief(null);
    setSessionStarted(false);
    setFreeSetup('');
  };

  // Debrief view
  if (debrief) {
    return (
      <div className="p-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Session Debrief</h1>
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <p className="text-gray-300">{debrief.summary}</p>
          </div>
          {debrief.patternsUsed && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="font-semibold mb-3">Patterns Used ({debrief.totalPatterns || 0} total)</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(debrief.patternsUsed).map(([pattern, count]: [string, any]) => (
                  <span key={pattern} className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-sm">
                    {pattern}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}
          {debrief.strengths?.length > 0 && (
            <div className="bg-emerald-950/30 rounded-xl p-6 border border-emerald-800/50">
              <h2 className="font-semibold text-emerald-400 mb-2">Strengths</h2>
              <ul className="text-sm text-gray-300 space-y-1">
                {debrief.strengths.map((s: string, i: number) => <li key={i}>- {s}</li>)}
              </ul>
            </div>
          )}
          {debrief.areasToImprove?.length > 0 && (
            <div className="bg-amber-950/30 rounded-xl p-6 border border-amber-800/50">
              <h2 className="font-semibold text-amber-400 mb-2">Areas to Improve</h2>
              <ul className="text-sm text-gray-300 space-y-1">
                {debrief.areasToImprove.map((s: string, i: number) => <li key={i}>- {s}</li>)}
              </ul>
            </div>
          )}
          <button onClick={resetSession} className="bg-indigo-600 hover:bg-indigo-500 rounded-xl px-6 py-3 font-medium transition-colors">
            New Session
          </button>
        </div>
      </div>
    );
  }

  // Scenario selection
  if (!sessionStarted) {
    return (
      <div className="p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Practice NLP</h1>
        <div className="space-y-3 mb-6">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                scenario === s.id
                  ? 'border-indigo-500 bg-indigo-950/30'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-400">{s.description}</div>
            </button>
          ))}
        </div>

        {scenario === 'free' && (
          <textarea
            value={freeSetup}
            onChange={e => setFreeSetup(e.target.value)}
            placeholder="Describe the scenario: who is the other person, what's the situation, what do you want to practice?"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 mb-4"
            rows={3}
          />
        )}

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={coached} onChange={e => setCoached(e.target.checked)} className="accent-indigo-500" />
            <span className="text-sm">Real-time coaching</span>
          </label>
        </div>

        <button
          onClick={startSession}
          disabled={!scenario || (scenario === 'free' && !freeSetup.trim())}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl px-6 py-3 font-medium transition-colors"
        >
          Start Session
        </button>
      </div>
    );
  }

  // Active session
  const atLimit = messages.length >= MAX_MESSAGES;
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-medium capitalize">{scenario?.replace('-', ' ')}</span>
          {coached && <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded">Coached</span>}
          <span className="text-xs text-gray-500">{messages.length}/{MAX_MESSAGES} messages</span>
        </div>
        <button
          onClick={endSession}
          disabled={loading || messages.length === 0}
          className="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
        >
          End Session
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Chat
          messages={messages}
          onSend={sendMessage}
          loading={loading}
          coached={coached}
          disabled={atLimit}
        />
      </div>
      {error && (
        <div className="bg-red-900/30 border-t border-red-800 px-6 py-2 text-sm text-red-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => lastFailedMessage && sendMessage(lastFailedMessage)} className="bg-red-700 hover:bg-red-600 rounded px-3 py-1 text-xs font-medium">Retry</button>
        </div>
      )}
      {atLimit && (
        <div className="bg-amber-900/30 border-t border-amber-800 px-6 py-2 text-sm text-amber-300 text-center">
          Message limit reached. Click "End Session" for your debrief.
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire into App.tsx**

```tsx
import Practice from './pages/Practice';
// ...
<Route path="/practice" element={<Practice />} />
```

- [ ] **Step 3: Verify practice flow works**

1. Select a scenario → start session → send messages → see coaching feedback
2. Click "End Session" → see debrief
3. Check that practice count increments in localStorage

- [ ] **Step 4: Commit**

```bash
git add src/pages/Practice.tsx src/App.tsx
git commit -m "feat: add Practice page with scenario selection, chat, coaching, and debrief"
```

---

## Chunk 6: Frontend — Reference Mode + Final Wiring

### Task 16: Build Reference page

**Files:**
- Create: `nlp-training-tool/src/pages/Reference.tsx`
- Modify: `nlp-training-tool/src/App.tsx`

**Spec deviation note:** The spec says Reference mode should import JSON files as static frontend assets with no server route. However, since the JSON data already lives in `server/data/` and is used by the backend, we fetch it through a lightweight GET endpoint instead of duplicating the files into `src/data/`. This avoids maintaining two copies. No AI calls are made — just a static data read.

- [ ] **Step 1: Add a reference data endpoint to learn.js**

Add to `server/routes/learn.js`:
```js
// GET /api/learn/reference — return all content for reference mode
router.get('/reference', (req, res) => {
  const miltonModel = loadData('milton-model.json');
  const metaPrograms = loadData('meta-programs.json');
  const presuppositions = loadData('presuppositions.json');
  const primeDirectives = loadData('prime-directives.json');
  const quantumLinguistics = loadData('quantum-linguistics.json');
  const personalBreakthrough = loadData('personal-breakthrough.json');

  res.json({
    miltonModel,
    metaPrograms,
    presuppositions,
    primeDirectives,
    quantumLinguistics,
    personalBreakthrough,
  });
});
```

- [ ] **Step 2: Add reference API call to api.ts**

```ts
getReference: () => request<any>('/learn/reference'),
```

- [ ] **Step 3: Create Reference.tsx**

```tsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import PatternCard from '../components/PatternCard';

const CATEGORIES = [
  { id: 'milton-model', label: 'Milton Model' },
  { id: 'meta-programs', label: 'Meta Programs' },
  { id: 'presuppositions', label: 'Presuppositions' },
  { id: 'prime-directives', label: 'Prime Directives' },
  { id: 'quantum-linguistics', label: 'Quantum Linguistics' },
  { id: 'personal-breakthrough', label: 'Personal Breakthrough' },
];

export default function Reference() {
  const [data, setData] = useState<any>(null);
  const [category, setCategory] = useState('milton-model');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getReference().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-gray-400">Loading reference data...</div>;

  const getItems = () => {
    switch (category) {
      case 'milton-model':
        return (data.miltonModel?.patterns || []).map((p: any) => ({
          name: p.name, definition: p.definition, tipOff: p.tipOff, examples: p.examples, number: p.number
        }));
      case 'meta-programs':
        return (data.metaPrograms?.filters || []).map((f: any) => ({
          name: f.name,
          definition: f.elicitationQuestion,
          tipOff: f.options?.map((o: any) => o.label).join(', '),
          examples: Object.entries(f.linguisticMarkers || {}).map(([k, v]) => `${k}: ${v}`),
          number: f.number
        }));
      case 'presuppositions':
        return [
          ...(data.presuppositions?.nlpPresuppositions || []).map((p: any) => ({
            name: `${p.mnemonicLetter} — ${p.keyword}`, definition: p.text, number: p.number
          })),
          ...(data.presuppositions?.linguisticPresuppositions || []).map((p: any) => ({
            name: p.name, definition: p.definition, tipOff: p.tipOff, examples: p.examples, number: p.number
          })),
        ];
      case 'prime-directives':
        return (data.primeDirectives?.primeDirectives || []).map((d: any) => ({
          name: d.text, definition: d.details || '', number: d.number
        }));
      case 'quantum-linguistics':
        const ql = data.quantumLinguistics || {};
        const items: any[] = [];
        if (ql.embeddedCommands) items.push({ name: 'Embedded Commands', definition: ql.embeddedCommands.definition, examples: ql.embeddedCommands.steps });
        if (ql.cartesianCoordinates) items.push({
          name: 'Cartesian Coordinates',
          definition: 'Four perspectives for exploring decisions',
          examples: Object.entries(ql.cartesianCoordinates).map(([k, v]: [string, any]) => `${k}: ${v.question}`)
        });
        if (ql.inductiveDeductive) {
          items.push({ name: 'Deduction', definition: ql.inductiveDeductive.deduction.definition, examples: [ql.inductiveDeductive.deduction.example] });
          items.push({ name: 'Induction', definition: ql.inductiveDeductive.induction.definition, examples: [ql.inductiveDeductive.induction.example] });
        }
        return items;
      case 'personal-breakthrough':
        const pb = data.personalBreakthrough || {};
        const pbItems: any[] = [];
        if (pb.detailedPersonalHistory) pbItems.push(...pb.detailedPersonalHistory.map((q: any) => ({
          name: `Question ${q.number}`, definition: q.question, examples: q.purpose ? [q.purpose] : [], number: q.number
        })));
        if (pb.interventionSteps) pbItems.push(...pb.interventionSteps.map((s: any) => ({
          name: s.title, definition: s.description, number: s.number
        })));
        return pbItems;
      default:
        return [];
    }
  };

  let items = getItems();
  if (search.trim()) {
    const q = search.toLowerCase();
    items = items.filter((item: any) =>
      item.name?.toLowerCase().includes(q) ||
      item.definition?.toLowerCase().includes(q) ||
      item.examples?.some((e: string) => e.toLowerCase().includes(q))
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Reference</h1>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search patterns, definitions, examples..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 mb-6"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              category === cat.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-gray-500 text-sm">No results found.</div>
        ) : (
          items.map((item: any, i: number) => (
            <PatternCard key={i} {...item} />
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire into App.tsx**

```tsx
import Reference from './pages/Reference';
// ...
<Route path="/reference" element={<Reference />} />
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/Reference.tsx src/services/api.ts server/routes/learn.js src/App.tsx
git commit -m "feat: add Reference page with searchable pattern browser"
```

---

### Task 17: Final wiring — import all pages in App.tsx

**Files:**
- Modify: `nlp-training-tool/src/App.tsx`

- [ ] **Step 1: Ensure App.tsx has all imports and routes**

Final `src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Practice from './pages/Practice';
import Reference from './pages/Reference';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonId" element={<Lesson />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/reference" element={<Reference />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 2: Verify full app works end-to-end**

1. Dashboard loads with stats
2. Learn → click module → click lesson → read content → take quiz → see score
3. Practice → pick scenario → toggle coaching → chat → end session → see debrief
4. Reference → browse categories → search → see pattern cards
5. Progress updates across pages

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire all pages into final App router"
```

---

### Task 18: Add .env and verify deployment readiness

**Files:**
- Create: `nlp-training-tool/.env` (from .env.example, with real API key)

- [ ] **Step 1: Copy .env.example to .env and add API key**

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

- [ ] **Step 2: Start both servers and run full manual test**

```bash
# Terminal 1: Frontend
cd nlp-training-tool && npm run dev

# Terminal 2: Backend
cd nlp-training-tool/server && npm run dev
```

Walk through all features: Dashboard → Learn → Lesson → Quiz → Practice → Chat → Debrief → Reference

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: NLP Training Tool v1 complete"
```
