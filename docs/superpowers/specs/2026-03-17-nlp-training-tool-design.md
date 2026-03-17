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
│   │   ├── learn.js            # Lesson content + quiz evaluation
│   │   ├── practice.js         # Roleplay chat sessions
│   │   └── reference.js        # Pattern lookup
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

### Module 1: NLP Foundations
- What is NLP (Neuro, Linguistic, Programming definitions)
- Prime Directives of the Unconscious Mind (21 directives)
- NLP Communication Model (External Event → Filters → Internal Representation → State → Physiology → Behavior)
- Presuppositions of NLP (14 principles, "RESPECT UR-WORLD" mnemonic)
- State vs Goal (values/states vs goals/outcomes comparison)

### Module 2: Milton Model — Hypnotic Language Patterns
19 patterns, each with definition, tip-offs, and examples:
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

### Module 3: Quantum Linguistics
- Presuppositions — 9 linguistic types (Existence, Possibility/Necessity, Cause-Effect, Complex Equivalence, Awareness, Time, Adverb/Adjective, Exclusive/Inclusive OR, Ordinal)
- Embedded Commands (2 times means + 1 time end, delivered lower & louder)
- Cartesian Coordinates (Theorem AB, Converse ~AB, Inverse A~B, Non-Mirror ~A~B)
- Symbolic Logic
- Inductive & Deductive Language

### Module 4: Hierarchy of Ideas & Language Models
- Chunking Up (agreement, trance) / Chunking Down (distinctions)
- NLP Negotiation Model
- Meta Model vs Milton Model
- Modal Operators (classification)
- Prepositions (Spatial, Temporal, Time Scramble)
- Decision Destroyer
- Linguistic Re-Sourcing, De-Identification Pattern, Linguistic Parts Integration
- Prime Concerns Elicitation
- Metaphor construction

### Module 5: Complex Meta Programs (MPVI)
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

### Module 6: Personal Breakthrough Sessions
- Pre-session preparation and screening questions
- Establishing rapport
- Detailed Personal History (13 questions)
- Eliciting values, determining cause & effect
- Setting frames and outcomes
- Intervention steps (11-17): negative emotions, limiting decisions, parts integration
- Testing, future pacing, ecology check
- Session completion and task assignment

## Quiz Types

1. **Multiple Choice:** "Which Milton Model pattern is this sentence an example of?"
2. **Pattern Identification:** Given a sentence, identify all presuppositions and/or Milton Model patterns present (mirrors Exercise #1 and #2 from the manual)
3. **Construction:** "Write a sentence using [pattern]" — Claude evaluates correctness and quality
4. **Meta Program Matching:** "Based on this person's response, which filter result do they exhibit?"
5. **Linguistic Marker Selection:** "What would you say to someone with [filter result]?"

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
- **Coached mode:** After each user message, Claude responds in-character AND provides a coaching sidebar (what patterns you used, what you could try next)
- **Uncoached mode:** Pure roleplay, debrief summary at end only
- **Session debrief:** Patterns used (count + list), missed opportunities, overall assessment, suggestions for next practice focus

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
- No AI calls — pure static data rendering

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
- Suggested next action (next lesson or recommended practice scenario)

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
