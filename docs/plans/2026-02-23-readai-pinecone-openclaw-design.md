# Design: read.ai Transcript Pipeline with Pinecone + OpenClaw

## Overview

Two n8n workflows that process read.ai call transcripts into semantically structured Pinecone vectors, with real-time and EOD reporting through OpenClaw's chief of staff agent.

## Architecture

```
read.ai webhook
      │
      ▼
┌─────────────────────────────────────────┐
│  Workflow 1: Call Transcript Processor  │
│  (triggered per call)                   │
│                                         │
│  Webhook → Parse → AI Structurer →      │
│  ├─ Pinecone: call-transcripts          │
│  ├─ Pinecone: call-summaries            │
│  ├─ Pinecone: call-action-items         │
│  ├─ Pinecone: call-categories           │
│  └─ HTTP → OpenClaw (per-call notify)   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Workflow 2: EOD Call Report Trigger    │
│  (cron: 6 PM M-F)                      │
│                                         │
│  Cron → Query Pinecone (today's calls)  │
│  → AI Report Compiler → HTTP → OpenClaw │
│  (chief of staff generates full report) │
└─────────────────────────────────────────┘
```

## Pinecone Storage Strategy

Index: `easy-yes-offer` (existing)

### Namespace: `call-transcripts`
- **Content:** Speaker-segmented turns (one vector per speaker turn)
- **Chunking:** AI splits by speaker turn boundaries, not character count
- **Metadata:** `speaker`, `call_id`, `date`, `call_title`, `participants`, `turn_number`
- **Retrieval:** "What did John say about pricing?" or "Show me Sarah's comments from yesterday"

### Namespace: `call-summaries`
- **Content:** Structured call summary (one vector per call)
- **Chunking:** One document per call
- **Metadata:** `call_id`, `date`, `call_title`, `participants`, `call_type`, `duration`
- **Retrieval:** "Summarize my calls from last week" or "What happened in the InnoSupps call?"

### Namespace: `call-action-items`
- **Content:** Individual action items (one vector per item)
- **Chunking:** One document per action item
- **Metadata:** `call_id`, `date`, `owner`, `due_date`, `priority`, `status`, `related_topic`
- **Retrieval:** "What are my open action items?" or "What did I commit to this week?"

### Namespace: `call-categories`
- **Content:** Topic-classified segments
- **Chunking:** AI identifies topic shifts, one chunk per topic segment
- **Metadata:** `call_id`, `date`, `category` (sales/ops/creative/etc), `topic`, `participants`
- **Retrieval:** "Show me all sales discussions from this month" or "What creative decisions were made?"

## Workflow 1: Call Transcript Processor

### Nodes

1. **Webhook** - POST endpoint for read.ai
   - Path: `readai-transcript`
   - Expects: transcript text, participants, date, title, duration

2. **Code Node (Parse Payload)** - Validates and normalizes the read.ai payload
   - Extracts: transcript, participants array, call metadata
   - Generates: unique `call_id` (date + title hash)

3. **AI Agent (Transcript Structurer)** - GPT-4o
   - Input: Raw transcript + metadata
   - System prompt instructs it to output JSON with 4 sections:
     - `speaker_turns[]` - speaker, text, turn_number
     - `summary` - key_points, decisions, tone, call_type
     - `action_items[]` - owner, description, due_date, priority
     - `topic_segments[]` - category, topic, text, participants
   - Uses Pinecone retrieval tool to reference existing training materials for context

4. **Code Node (Split Output)** - Parses AI JSON output into 4 item arrays

5. **Pinecone Stores (x4)** - One per namespace, each with:
   - OpenAI text-embedding-3-small
   - Custom metadata per namespace (no character splitter)

6. **HTTP Request (OpenClaw Notify)** - POST to gateway
   - URL: `http://localhost:18789`
   - Auth: Bearer token
   - Body: call summary + action items count + participants

7. **Respond to Webhook** - Returns success/failure

### Connections
- Webhook → Parse Payload → AI Agent → Split Output
- Split Output → [parallel] 4x Pinecone stores
- Split Output → HTTP Request (OpenClaw)
- All terminals → Respond to Webhook

## Workflow 2: EOD Call Report Trigger

### Nodes

1. **Schedule Trigger** - Cron: 6:00 PM M-F (configurable)

2. **Code Node (Date Filter)** - Builds today's date string for Pinecone metadata filter

3. **Pinecone Queries (x2)** - Parallel queries:
   - call-summaries namespace (today's date filter)
   - call-action-items namespace (today's date filter)

4. **AI Agent (Daily Report Compiler)** - GPT-4o
   - Input: Today's summaries + action items
   - Output: Structured EOD report:
     - Total calls today
     - Per-call breakdown (who, what, key decisions)
     - All action items grouped by owner/priority
     - Key themes across calls
     - Items needing immediate attention

5. **HTTP Request (OpenClaw EOD)** - POST to gateway
   - URL: `http://localhost:18789`
   - Auth: Bearer token
   - Body: Full structured EOD report
   - Chief of staff distributes via Slack, ClickUp, Gmail

## OpenClaw Integration

### Per-Call Notification (real-time)
- n8n POSTs a lightweight summary to OpenClaw gateway after each call is processed
- Chief of staff receives and can act immediately on urgent items

### EOD Report (scheduled)
- n8n compiles full day report and POSTs to OpenClaw gateway
- Chief of staff integrates with its existing briefing data (Slack, Calendar, Gmail, ClickUp)
- Chief of staff generates and distributes the comprehensive daily report through its channels

### Gateway Details
- Endpoint: `http://localhost:18789`
- Auth mode: Bearer token (from openclaw.json)
- The chief of staff agent already has Slack, ClickUp, Gmail, Calendar integrations

## Embedding Model
- OpenAI `text-embedding-3-small` (matches existing Pinecone setup)

## Error Handling
- Webhook returns appropriate HTTP status on failure
- AI agent output is validated by Code node before Pinecone storage
- Failed Pinecone upserts don't block the OpenClaw notification
