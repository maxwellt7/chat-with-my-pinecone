# NLP Training Tool — Design Spec

## Overview

A web-based NLP (Neuro-Linguistic Programming) training tool for personal use. Combines structured curriculum with interactive AI-powered practice scenarios. All content sourced from four NLP Supremacy training manuals.

## Goals

1. Learn NLP concepts through a structured curriculum with quizzes
2. Practice applying NLP in simulated conversations with AI coaching
3. Quick-reference all patterns, meta programs, and techniques

## Non-Goals

- Multi-user support, accounts, or authentication
- Database or server-side persistence
- Mobile-native app
- Selling or distributing to others

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express
- **AI:** Claude API (Anthropic SDK)
- **Storage:** Browser localStorage for progress tracking
- **Content:** Structured JSON files (no database)
- **Styling:** Tailwind CSS

## Content Preparation

The 4 PDFs must be manually extracted into structured JSON files before implementation begins. This is a pre-work step done during the build process using Claude to parse the PDF content into the JSON schemas defined below. Each JSON file is hand-verified against the source PDF for accuracy. The JSON files are committed to the repo as static data.

## Architecture

```
nlp-training-tool/
├── src/                        # React frontend
│   ├── pages/
│   │   ├── Dashboard.tsx       # Progress overview, quick actions
│   │   ├── Learn.tsx           # Curriculum browser
│   │   ├── Lesson.tsx          # Individual lesson + quiz
│   │   ├── Practice.tsx        # Scenario selection + chat
│   │   └── Reference.tsx       # Searchable pattern lookup
│   ├── components/
│   │   ├── Chat.tsx            # Reusable chat interface
│   │   ├── Quiz.tsx            # Quiz component
│   │   ├── PatternCard.tsx     # Pattern display card
│   │   └── Layout.tsx          # App shell with navigation
│   └── services/api.ts         # API client
├── server/
│   ├── index.js                # Express server entry
│   ├── config/anthropic.js     # Claude API config
│   ├── routes/
│   │   ├── learn.js            # Lesson content + quiz generation/evaluation
│   │   └── practice.js         # Roleplay chat sessions
│   └── data/
│       ├── modules.json        # Curriculum structure
│       ├── milton-model.json   # 19 Milton Model patterns
│       ├── meta-programs.json  # 19 MPVI filters + linguistic markers
│       ├── presuppositions.json # NLP presuppositions + linguistic types
│       ├── prime-directives.json # 21 Prime Directives
│       ├── quantum-linguistics.json # Embedded commands, Cartesian coords, etc.
│       ├── personal-breakthrough.json # Session flow + questions
│       └── prompts/
│           ├── tutor.txt       # System prompt for teaching mode
│           ├── quiz-master.txt # System prompt for evaluating answers
│           └── practice-coach.txt # System prompt for roleplay + coaching
```

## Content Modules

All content extracted and structured from:
- Master Practitioner Manual (NLP Supremacy)
- Milton Model (NLP Supremacy LLC)
- NLP Supremacy Complex Meta Programs (MPVI)
- Personal Breakthrough Session Guide

### Module 1: NLP Foundations (5 lessons)
- **Lesson 1:** What is NLP (Neuro, Linguistic, Programming definitions) + What is it really (Attitude, Methodology, Techniques)
- **Lesson 2:** Prime Directives of the Unconscious Mind (directives 1-11)
- **Lesson 3:** Prime Directives of the Unconscious Mind (directives 12-21)
- **Lesson 4:** NLP Communication Model (External Event → Filters → Internal Representation → State → Physiology → Behavior)
- **Lesson 5:** Presuppositions of NLP (14 principles, "RESPECT UR-WORLD" mnemonic) + State vs Goal

### Module 2: Milton Model — Hypnotic Language Patterns (5 lessons)
19 patterns, each with definition, tip-offs, and examples:
- **Lesson 1:** Mind Reading, Lost Performative, Cause and Effect, Complex Equivalence
- **Lesson 2:** Presuppositions, Universal Quantifiers, Modal Operators, Nominalizations
- **Lesson 3:** Unspecified Verbs, Tag Questions, Lack of Referential Index, Comparative Deletions
- **Lesson 4:** Pacing Current Experience, Double Binds, Conversational Postulates, Extended Quotes
- **Lesson 5:** Selectional Restriction Violations, Ambiguities (4 types), Utilization + "Putting it all together" exercise

Full pattern list:
1. Mind Reading
2. Lost Performative
3. Cause and Effect
4. Complex Equivalence
5. Presuppositions
6. Universal Quantifiers
7. Modal Operators
8. Nominalizations
9. Unspecified Verbs
10. Tag Questions
11. Lack of Referential Index
12. Comparative Deletions
13. Pacing Current Experience
14. Double Binds
15. Conversational Postulates
16. Extended Quotes
17. Selectional Restriction Violations
18. Ambiguities (Phonological, Syntactic, Scope, Punctuation)
19. Utilization

### Module 3: Quantum Linguistics (3 lessons)
- **Lesson 1:** Presuppositions — 9 linguistic types + exercises
- **Lesson 2:** Embedded Commands + Cartesian Coordinates
- **Lesson 3:** Symbolic Logic + Inductive & Deductive Language

Content:
- Presuppositions — 9 linguistic types (Existence, Possibility/Necessity, Cause-Effect, Complex Equivalence, Awareness, Time, Adverb/Adjective, Exclusive/Inclusive OR, Ordinal)
- Embedded Commands (2 times means + 1 time end, delivered lower & louder)
- Cartesian Coordinates (Theorem AB, Converse ~AB, Inverse A~B, Non-Mirror ~A~B)
- Symbolic Logic
- Inductive & Deductive Language

### Module 4: Hierarchy of Ideas & Language Models (4 lessons)
- **Lesson 1:** Chunking Up/Down + NLP Negotiation Model + Meta Model vs Milton Model
- **Lesson 2:** Modal Operators + Prepositions (Spatial, Temporal, Time Scramble) + Decision Destroyer
- **Lesson 3:** Linguistic Re-Sourcing, De-Identification, Linguistic Parts Integration, Prime Concerns
- **Lesson 4:** Metaphor construction + Making Metaphors Work

Content:
- Chunking Up (agreement, trance) / Chunking Down (distinctions)
- NLP Negotiation Model
- Meta Model vs Milton Model
- Modal Operators (classification)
- Prepositions (Spatial, Temporal, Time Scramble)
- Decision Destroyer
- Linguistic Re-Sourcing, De-Identification Pattern, Linguistic Parts Integration
- Prime Concerns Elicitation
- Metaphor construction

### Module 5: Complex Meta Programs (MPVI) (5 lessons)
- **Lesson 1:** Direction Filter, Reason Filter, Frame of Reference (core motivation filters)
- **Lesson 2:** Convincer Representational, Convincer Demonstration, Management Direction
- **Lesson 3:** Action Filter, Affiliation, Work Preference, Primary Interest
- **Lesson 4:** Chunk Size, Relationship, Emotional Stress Response, Time Storage, Modal Operator Sequence, Attention Direction
- **Lesson 5:** Communication Styles (Info Processing, Listening, Speaking) + Linguistic Markers for all filters

19 filters, each with elicitation question, options, and linguistic markers:
1. Direction Filter (Toward ↔ Away)
2. Reason Filter (Possibility / Necessity)
3. Frame of Reference (Internal / External)
4. Convincer Representational (See / Hear / Read / Do)
5. Convincer Demonstration (Automatic / Number / Period / Consistent)
6. Management Direction (Self and Others / Self Only / Others Only)
7. Action Filter (Active / Reflective)
8. Affiliation (Independent / Team / Management Player)
9. Work Preference (Things / Systems / People)
10. Primary Interest (People / Place / Things / Activity / Information)
11. Chunk Size (Specific / Global)
12. Relationship (Sameness ↔ Differences)
13. Emotional Stress Response (Thinking / Feeling / Choice)
14. Time Storage (Through Time / In Time)
15. Modal Operator Sequence
16. Attention Direction (Self / Others)
17. Information Processing Style (External / Internal)
18. Listening Style (Literal / Inferential)
19. Speaking Style (Literal / Inferential)

### Module 6: Personal Breakthrough Sessions (3 lessons)
- **Lesson 1:** Pre-session preparation, screening questions, establishing rapport, detailed personal history (13 questions)
- **Lesson 2:** Eliciting values, determining cause & effect, setting frames & outcomes, intervention steps
- **Lesson 3:** Testing, future pacing, ecology check, session completion, task assignment, client disclosure

Content:
- Pre-session preparation and screening questions
- Establishing rapport
- Detailed Personal History (13 questions)
- Eliciting values, determining cause & effect
- Setting frames and outcomes
- Intervention steps (11-17): negative emotions, limiting decisions, parts integration
- Testing, future pacing, ecology check
- Session completion and task assignment

## Quiz Strategy

Quizzes are **Claude-generated** per lesson. When a user starts a quiz, the frontend sends the lesson ID to `POST /api/learn/quiz`. The backend loads the lesson's content from JSON, sends it to Claude with the quiz-generation prompt, and returns structured questions. A separate `POST /api/learn/quiz/evaluate` call sends the user's answers + the original questions for Claude to score and provide feedback.

**Flow:**
1. User completes lesson content → clicks "Take Quiz"
2. Frontend calls `POST /api/learn/quiz` with `{ lessonId: "module-2-lesson-1" }`
3. Backend loads lesson content, sends to Claude with quiz-generation prompt: "Generate 5 quiz questions for this NLP content. Return JSON array."
4. Claude returns questions in structured format (see schema below)
5. User answers questions in the Quiz component
6. Frontend calls `POST /api/learn/quiz/evaluate` with `{ lessonId, questions, userAnswers }`
7. Claude evaluates, returns scores + feedback per question
8. Frontend saves score to localStorage

**Quiz question schema (Claude output):**
```json
[
  {
    "type": "multiple_choice",
    "question": "Which Milton Model pattern is: 'I know you're wondering...'?",
    "options": ["Mind Reading", "Lost Performative", "Presupposition", "Tag Question"],
    "correctAnswer": "Mind Reading"
  },
  {
    "type": "pattern_identification",
    "question": "Identify all patterns in: 'It's good that you can learn this easily, can't you?'",
    "expectedPatterns": ["Lost Performative", "Presupposition", "Tag Question"]
  },
  {
    "type": "construction",
    "prompt": "Write a sentence using an Embedded Command with a Cause and Effect pattern."
  },
  {
    "type": "meta_program_match",
    "scenario": "When asked what they want in a job, they say: 'I want to avoid a toxic environment and reduce stress.'",
    "question": "What is this person's Direction Filter?",
    "options": ["Toward", "Away", "Both Toward and Away"],
    "correctAnswer": "Away"
  }
]
```

**Quiz types generated per module:**
- **Modules 1-4:** Multiple choice + pattern identification + construction
- **Module 5:** Meta program matching + linguistic marker selection
- **Module 6:** Scenario-based questions about session flow and intervention order

## Practice Scenarios

### Scenario 1: Sales Conversation
- Claude plays a prospect with a randomized meta program profile
- User practices: Milton Model patterns, embedded commands, presuppositions, meta program matching
- Coaching: highlights which patterns landed, missed opportunities

### Scenario 2: Coaching/Therapy Session
- Claude plays a client presenting a problem
- User practices: Personal Breakthrough Session flow, rapport, detailed personal history questions, identifying cause & effect, eliciting values
- Coaching: evaluates session flow adherence, question quality

### Scenario 3: Negotiation
- Claude plays a counterparty with a position
- User practices: chunking up/down, NLP Negotiation Model, Cartesian Coordinates, meta program matching
- Coaching: highlights agreement strategies, pattern usage

### Scenario 4: Pattern Recognition Drill
- Claude speaks in NLP-loaded language (multiple patterns per message)
- User identifies every pattern in each message
- Claude scores accuracy and explains missed patterns

### Scenario 5: Free Practice
- User describes any situation
- Claude plays the other person
- Toggle real-time coaching on/off
- End-of-session debrief with patterns used, missed opportunities, suggestions

### Coaching Mechanics
- **Coached mode:** After each user message, Claude responds in-character AND provides coaching analysis
- **Uncoached mode:** Pure roleplay, debrief summary at end only

### Chat State Management
- Conversation history is held in **React state** (useState/useReducer in the Practice page)
- The full message history is sent with every API call to `POST /api/practice/chat`
- Sessions are **ephemeral** — lost on page refresh (no localStorage for chat history)
- Max session length: 50 messages (25 exchanges). After 50 messages, prompt user to end session and get debrief.

### Coached Mode Response Format
Claude returns JSON for every practice message. The frontend parses and renders dialogue and coaching separately:

```json
{
  "dialogue": "I'm not sure this is the right solution for us. We've tried similar approaches before and they didn't work out.",
  "coaching": {
    "patternsUsed": ["Cause and Effect", "Presupposition"],
    "effectiveness": "Good use of cause-effect linking. The presupposition about 'easily' was subtle and well-placed.",
    "suggestions": ["Try a Conversational Postulate next to guide them toward agreement.", "Match their Relationship Filter — they seem to be Sameness with Exception."],
    "missedOpportunities": ["They used a Lost Performative ('didn't work out') — you could challenge this with a Meta Model question."]
  }
}
```

In **uncoached mode**, Claude returns only: `{ "dialogue": "..." }` — no coaching field.

### Session Debrief Flow
1. User clicks **"End Session"** button (always visible during practice)
2. Frontend sends `POST /api/practice/debrief` with the full conversation history
3. Claude returns a structured debrief:

```json
{
  "summary": "You conducted a 12-message sales conversation...",
  "patternsUsed": { "Mind Reading": 2, "Cause and Effect": 3, "Embedded Commands": 1 },
  "totalPatterns": 6,
  "missedOpportunities": ["The prospect exhibited an Away direction filter early on — matching with away-from language would have built more rapport."],
  "strengths": ["Strong use of pacing current experience to build rapport."],
  "areasToImprove": ["Practice using Double Binds to create the illusion of choice."],
  "suggestedNextPractice": "pattern-drill"
}
```

4. Frontend renders the debrief as a styled summary card
5. Practice session count is incremented in localStorage

## AI System Prompts

### Tutor Prompt
- Role: NLP Master Practitioner instructor
- Knowledge: Full structured content from all 4 manuals
- Behavior: Explains concepts clearly, uses examples from the manuals, answers follow-up questions, adapts depth to what the user asks
- Constraints: Only teaches content from the provided knowledge base

### Quiz Master Prompt
- Role: NLP exam evaluator
- Knowledge: All patterns, definitions, examples, correct answers
- Behavior: Evaluates free-form answers, scores pattern identification, provides detailed feedback on why answers are correct/incorrect
- Constraints: Accepts valid alternative answers, references specific pattern definitions

### Practice Coach Prompt
- Role: Dual — stays in character as the scenario persona AND provides NLP coaching
- Knowledge: All patterns, meta programs, session flows
- Behavior: Responds naturally in-character, tracks patterns used by the user, provides coaching when requested or in coached mode
- Constraints: Never breaks character in uncoached mode until debrief

## Reference Mode

- Browse by category: Milton Model, Meta Programs, Presuppositions, Prime Directives, Quantum Linguistics, Personal Breakthrough
- Full-text search across all patterns
- Each card: pattern name, definition, tip-off words, 3-5 examples, related patterns
- Meta Program cards additionally show: elicitation question, all options, linguistic markers for each option
- No AI calls — pure static data rendering. Frontend imports JSON files directly as static assets. No server route needed.

## Progress Tracking (localStorage)

```json
{
  "lessons": {
    "module-1-lesson-1": { "completed": true, "quizScore": 85, "completedAt": "2026-03-17" }
  },
  "practice": {
    "sessionsCompleted": 12,
    "scenarios": {
      "sales": 3,
      "coaching": 2,
      "negotiation": 2,
      "pattern-drill": 3,
      "free": 2
    }
  },
  "lastAccessed": "2026-03-17"
}
```

Dashboard displays:
- Modules completed (X/6)
- Overall quiz accuracy %
- Practice sessions by scenario type
- Suggested next action, computed client-side:
  1. If any module has incomplete lessons → suggest next incomplete lesson
  2. If all lessons complete but any quiz accuracy < 80% → suggest retaking that quiz
  3. If all quizzes ≥ 80% but practice sessions < 3 → suggest a practice scenario
  4. Otherwise → suggest the practice scenario with fewest sessions

## UI Design Notes

- Clean, minimal interface — dark/light mode toggle
- Sidebar navigation: Dashboard, Learn, Practice, Reference
- Chat interface uses a standard message bubble layout
- Coaching feedback displayed in a distinct visual style (e.g., highlighted sidebar or collapsible panel) so it doesn't interrupt the roleplay flow
- Pattern cards use consistent layout across Reference and Learn modes

## Error Handling

- Claude API failures: show retry button, preserve chat history
- localStorage full: warn user, offer to clear old session data
- Invalid quiz submissions: client-side validation before API call
