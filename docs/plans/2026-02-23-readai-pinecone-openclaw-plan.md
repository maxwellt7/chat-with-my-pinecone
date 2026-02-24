# read.ai Transcript Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build two n8n workflows that process read.ai call transcripts into semantically structured Pinecone vectors and deliver real-time + EOD reports through OpenClaw's chief of staff agent.

**Architecture:** Webhook-triggered pipeline with AI-powered semantic chunking across 4 Pinecone namespaces, plus a scheduled EOD report compiler. Both workflows communicate with OpenClaw via its local gateway.

**Tech Stack:** n8n (workflow engine), OpenAI GPT-4o (structuring), OpenAI text-embedding-3-small (embeddings), Pinecone (vector store), OpenClaw gateway (chief of staff trigger)

---

## Task 1: Build Workflow 1 JSON - Call Transcript Processor

**Files:**
- Create: `n8n-workflows/readai-transcript-processor.json`

**Reference:** Existing workflow at `Downloads/I need a workflow that has a trigger from read.ai ....json`

**Step 1: Create the Webhook trigger node**

The webhook receives POST requests from read.ai. read.ai sends a JSON payload containing `transcript` (with `speakers` and `speaker_blocks`), `topics`, `chapter_summaries`, and `report_url`.

```json
{
  "id": "webhook",
  "name": "Read.ai Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2.1,
  "position": [100, 300],
  "webhookId": "readai-transcript",
  "parameters": {
    "httpMethod": "POST",
    "path": "readai-transcript",
    "responseMode": "responseNode",
    "options": {}
  }
}
```

**Step 2: Create the Code Node to parse and normalize the read.ai payload**

This node extracts the raw transcript, reconstructs it as readable text with speaker labels, and generates a unique call_id.

```json
{
  "id": "parse_payload",
  "name": "Parse Payload",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [320, 300],
  "parameters": {
    "jsCode": "const input = $input.first().json;\n\n// Handle read.ai payload - extract transcript text\n// read.ai sends speaker_blocks with speaker name, start_time, end_time, words\nconst speakerBlocks = input.transcript?.speaker_blocks || [];\nconst speakers = input.transcript?.speakers || [];\nconst topics = input.topics || [];\nconst chapters = input.chapter_summaries || [];\nconst reportUrl = input.report_url || '';\n\n// Reconstruct readable transcript with speaker labels\nlet fullTranscript = '';\nconst participantSet = new Set();\n\nif (speakerBlocks.length > 0) {\n  for (const block of speakerBlocks) {\n    const speaker = block.speaker || 'Unknown';\n    const words = block.words || block.text || '';\n    participantSet.add(speaker);\n    fullTranscript += `${speaker}: ${words}\\n\\n`;\n  }\n} else if (typeof input.transcript === 'string') {\n  // Fallback: transcript sent as plain text\n  fullTranscript = input.transcript;\n} else if (input.body?.transcript) {\n  fullTranscript = typeof input.body.transcript === 'string' \n    ? input.body.transcript \n    : JSON.stringify(input.body.transcript);\n}\n\n// Generate call_id from date + hash of title\nconst today = new Date().toISOString().split('T')[0];\nconst title = input.title || input.meeting_title || input.subject || 'Untitled Call';\nconst callId = `${today}_${title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40)}`;\n\nconst participants = Array.from(participantSet);\nif (participants.length === 0 && speakers.length > 0) {\n  speakers.forEach(s => participants.push(typeof s === 'string' ? s : s.name || 'Unknown'));\n}\n\nreturn [{\n  json: {\n    call_id: callId,\n    date: today,\n    call_title: title,\n    participants: participants,\n    duration: input.duration || input.meeting_duration || '',\n    transcript: fullTranscript,\n    topics: topics,\n    chapters: chapters,\n    report_url: reportUrl,\n    raw_speaker_blocks: speakerBlocks\n  }\n}];"
  }
}
```

**Step 3: Create the AI Agent node (Transcript Structurer)**

This is the core intelligence. It takes the parsed transcript and produces structured JSON with 4 sections.

```json
{
  "id": "ai_structurer",
  "name": "Transcript Structurer",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 3,
  "position": [560, 300],
  "parameters": {
    "text": "=Process this call transcript and return ONLY valid JSON (no markdown, no code fences).\n\nCall ID: {{ $json.call_id }}\nDate: {{ $json.date }}\nTitle: {{ $json.call_title }}\nParticipants: {{ $json.participants.join(', ') }}\nDuration: {{ $json.duration }}\n\nTRANSCRIPT:\n{{ $json.transcript }}",
    "hasOutputParser": false,
    "options": {
      "systemMessage": "You are a call transcript analyst. Your job is to process call transcripts and return ONLY valid JSON with exactly this structure. No markdown, no code fences, just raw JSON.\n\n{\n  \"speaker_turns\": [\n    {\n      \"speaker\": \"Name\",\n      \"text\": \"What they said in this continuous turn\",\n      \"turn_number\": 1\n    }\n  ],\n  \"summary\": {\n    \"key_points\": [\"Point 1\", \"Point 2\"],\n    \"decisions\": [\"Decision 1\"],\n    \"tone\": \"collaborative/tense/positive/neutral\",\n    \"call_type\": \"sales/ops/creative/strategy/check-in/other\",\n    \"one_line\": \"One sentence summary of the entire call\"\n  },\n  \"action_items\": [\n    {\n      \"owner\": \"Person responsible\",\n      \"description\": \"What needs to be done\",\n      \"due_date\": \"YYYY-MM-DD or 'unspecified'\",\n      \"priority\": \"high/medium/low\",\n      \"related_topic\": \"Topic this relates to\"\n    }\n  ],\n  \"topic_segments\": [\n    {\n      \"category\": \"sales/ops/creative/strategy/finance/hr/product/marketing/other\",\n      \"topic\": \"Specific topic name\",\n      \"text\": \"The relevant portion of the conversation about this topic\",\n      \"participants\": [\"Names of people who spoke about this topic\"]\n    }\n  ]\n}\n\nRules:\n- speaker_turns: Split by when a different person starts speaking. Combine consecutive lines from the same speaker into one turn.\n- summary: Be concise but capture all key points and decisions made.\n- action_items: Only include explicit commitments or tasks. Don't infer vague action items.\n- topic_segments: Identify natural topic shifts. A call about pricing, then timeline, then next steps = 3 segments. Categorize each into the closest business category.\n- If the transcript is too short or unclear, still return the JSON structure with empty arrays where needed.\n- CRITICAL: Return ONLY the JSON object. No explanation, no markdown."
    }
  }
}
```

**Step 4: Create the OpenAI Chat Model node**

```json
{
  "id": "openai_chat",
  "name": "OpenAI Chat Model",
  "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
  "typeVersion": 1.2,
  "position": [560, 80],
  "parameters": {
    "model": { "mode": "list", "value": "gpt-4o" },
    "options": { "temperature": 0.1 }
  }
}
```

**Step 5: Create the Code Node to split AI output into 4 paths**

```json
{
  "id": "split_output",
  "name": "Split Output",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [800, 300],
  "parameters": {
    "jsCode": "const input = $input.first().json;\nconst metadata = {\n  call_id: $('Parse Payload').first().json.call_id,\n  date: $('Parse Payload').first().json.date,\n  call_title: $('Parse Payload').first().json.call_title,\n  participants: $('Parse Payload').first().json.participants.join(', '),\n  duration: $('Parse Payload').first().json.duration\n};\n\n// Parse the AI output - handle potential JSON in output field\nlet structured;\ntry {\n  const text = input.output || input.text || JSON.stringify(input);\n  // Strip markdown code fences if present\n  const cleaned = text.replace(/```json\\n?/g, '').replace(/```\\n?/g, '').trim();\n  structured = JSON.parse(cleaned);\n} catch (e) {\n  throw new Error('AI output was not valid JSON: ' + e.message);\n}\n\n// Build items for each namespace\nconst speakerTurns = (structured.speaker_turns || []).map(turn => ({\n  json: {\n    text: `${turn.speaker}: ${turn.text}`,\n    metadata: {\n      ...metadata,\n      speaker: turn.speaker,\n      turn_number: turn.turn_number,\n      document_type: 'speaker_turn'\n    }\n  }\n}));\n\nconst summary = [{\n  json: {\n    text: `Call: ${metadata.call_title}\\nDate: ${metadata.date}\\nParticipants: ${metadata.participants}\\nType: ${structured.summary?.call_type || 'unknown'}\\nSummary: ${structured.summary?.one_line || ''}\\nKey Points: ${(structured.summary?.key_points || []).join('; ')}\\nDecisions: ${(structured.summary?.decisions || []).join('; ')}\\nTone: ${structured.summary?.tone || 'neutral'}`,\n    metadata: {\n      ...metadata,\n      call_type: structured.summary?.call_type || 'unknown',\n      document_type: 'call_summary'\n    }\n  }\n}];\n\nconst actionItems = (structured.action_items || []).map((item, i) => ({\n  json: {\n    text: `Action Item: ${item.description}\\nOwner: ${item.owner}\\nPriority: ${item.priority}\\nDue: ${item.due_date}\\nRelated Topic: ${item.related_topic}`,\n    metadata: {\n      ...metadata,\n      owner: item.owner,\n      due_date: item.due_date,\n      priority: item.priority,\n      status: 'open',\n      related_topic: item.related_topic,\n      document_type: 'action_item'\n    }\n  }\n}));\n\nconst topicSegments = (structured.topic_segments || []).map(seg => ({\n  json: {\n    text: `Topic: ${seg.topic}\\nCategory: ${seg.category}\\nDiscussion: ${seg.text}`,\n    metadata: {\n      ...metadata,\n      category: seg.category,\n      topic: seg.topic,\n      segment_participants: (seg.participants || []).join(', '),\n      document_type: 'topic_segment'\n    }\n  }\n}));\n\n// Also build the OpenClaw notification payload\nconst openclawPayload = [{\n  json: {\n    call_id: metadata.call_id,\n    call_title: metadata.call_title,\n    date: metadata.date,\n    participants: metadata.participants,\n    summary: structured.summary?.one_line || '',\n    action_items_count: actionItems.length,\n    key_decisions: structured.summary?.decisions || [],\n    urgent_items: (structured.action_items || []).filter(i => i.priority === 'high').map(i => i.description)\n  }\n}];\n\n// Return 5 outputs: speaker_turns, summary, action_items, topic_segments, openclaw_payload\nreturn [speakerTurns, summary, actionItems, topicSegments, openclawPayload];"
  }
}
```

**Important:** Set the Code node to have 5 outputs in the n8n UI (Output 0-4).

**Step 6: Create the 4 Pinecone vector store nodes (insert mode)**

Each Pinecone store needs its own embeddings node and document loader. No text splitter needed since the AI already chunked semantically.

**6a. call-transcripts namespace (speaker turns):**

```json
{
  "id": "pinecone_transcripts",
  "name": "Store Speaker Turns",
  "type": "@n8n/n8n-nodes-langchain.vectorStorePinecone",
  "typeVersion": 1.3,
  "position": [1100, 100],
  "parameters": {
    "mode": "insert",
    "pineconeIndex": { "__rl": true, "mode": "list", "value": "easy-yes-offer" },
    "options": { "pineconeNamespace": "call-transcripts", "clearNamespace": false }
  }
}
```

```json
{
  "id": "embed_transcripts",
  "name": "Embed Speaker Turns",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1.2,
  "position": [1100, -40],
  "parameters": { "model": "text-embedding-3-small", "options": {} }
}
```

```json
{
  "id": "loader_transcripts",
  "name": "Load Speaker Turns",
  "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
  "typeVersion": 1.1,
  "position": [900, -40],
  "parameters": {
    "jsonMode": "specificData",
    "jsonData": "={{ $json.text }}",
    "options": {
      "metadata": {
        "metadataValues": [
          { "name": "call_id", "value": "={{ $json.metadata.call_id }}" },
          { "name": "date", "value": "={{ $json.metadata.date }}" },
          { "name": "call_title", "value": "={{ $json.metadata.call_title }}" },
          { "name": "speaker", "value": "={{ $json.metadata.speaker }}" },
          { "name": "turn_number", "value": "={{ $json.metadata.turn_number }}" },
          { "name": "participants", "value": "={{ $json.metadata.participants }}" },
          { "name": "document_type", "value": "speaker_turn" }
        ]
      }
    }
  }
}
```

**6b. call-summaries namespace:**

```json
{
  "id": "pinecone_summaries",
  "name": "Store Summary",
  "type": "@n8n/n8n-nodes-langchain.vectorStorePinecone",
  "typeVersion": 1.3,
  "position": [1100, 300],
  "parameters": {
    "mode": "insert",
    "pineconeIndex": { "__rl": true, "mode": "list", "value": "easy-yes-offer" },
    "options": { "pineconeNamespace": "call-summaries", "clearNamespace": false }
  }
}
```

```json
{
  "id": "embed_summaries",
  "name": "Embed Summary",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1.2,
  "position": [1100, 160],
  "parameters": { "model": "text-embedding-3-small", "options": {} }
}
```

```json
{
  "id": "loader_summaries",
  "name": "Load Summary",
  "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
  "typeVersion": 1.1,
  "position": [900, 160],
  "parameters": {
    "jsonMode": "specificData",
    "jsonData": "={{ $json.text }}",
    "options": {
      "metadata": {
        "metadataValues": [
          { "name": "call_id", "value": "={{ $json.metadata.call_id }}" },
          { "name": "date", "value": "={{ $json.metadata.date }}" },
          { "name": "call_title", "value": "={{ $json.metadata.call_title }}" },
          { "name": "participants", "value": "={{ $json.metadata.participants }}" },
          { "name": "call_type", "value": "={{ $json.metadata.call_type }}" },
          { "name": "duration", "value": "={{ $json.metadata.duration }}" },
          { "name": "document_type", "value": "call_summary" }
        ]
      }
    }
  }
}
```

**6c. call-action-items namespace:**

```json
{
  "id": "pinecone_actions",
  "name": "Store Action Items",
  "type": "@n8n/n8n-nodes-langchain.vectorStorePinecone",
  "typeVersion": 1.3,
  "position": [1100, 500],
  "parameters": {
    "mode": "insert",
    "pineconeIndex": { "__rl": true, "mode": "list", "value": "easy-yes-offer" },
    "options": { "pineconeNamespace": "call-action-items", "clearNamespace": false }
  }
}
```

```json
{
  "id": "embed_actions",
  "name": "Embed Action Items",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1.2,
  "position": [1100, 360],
  "parameters": { "model": "text-embedding-3-small", "options": {} }
}
```

```json
{
  "id": "loader_actions",
  "name": "Load Action Items",
  "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
  "typeVersion": 1.1,
  "position": [900, 360],
  "parameters": {
    "jsonMode": "specificData",
    "jsonData": "={{ $json.text }}",
    "options": {
      "metadata": {
        "metadataValues": [
          { "name": "call_id", "value": "={{ $json.metadata.call_id }}" },
          { "name": "date", "value": "={{ $json.metadata.date }}" },
          { "name": "owner", "value": "={{ $json.metadata.owner }}" },
          { "name": "due_date", "value": "={{ $json.metadata.due_date }}" },
          { "name": "priority", "value": "={{ $json.metadata.priority }}" },
          { "name": "status", "value": "={{ $json.metadata.status }}" },
          { "name": "related_topic", "value": "={{ $json.metadata.related_topic }}" },
          { "name": "document_type", "value": "action_item" }
        ]
      }
    }
  }
}
```

**6d. call-categories namespace:**

```json
{
  "id": "pinecone_categories",
  "name": "Store Topic Segments",
  "type": "@n8n/n8n-nodes-langchain.vectorStorePinecone",
  "typeVersion": 1.3,
  "position": [1100, 700],
  "parameters": {
    "mode": "insert",
    "pineconeIndex": { "__rl": true, "mode": "list", "value": "easy-yes-offer" },
    "options": { "pineconeNamespace": "call-categories", "clearNamespace": false }
  }
}
```

```json
{
  "id": "embed_categories",
  "name": "Embed Topic Segments",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1.2,
  "position": [1100, 560],
  "parameters": { "model": "text-embedding-3-small", "options": {} }
}
```

```json
{
  "id": "loader_categories",
  "name": "Load Topic Segments",
  "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
  "typeVersion": 1.1,
  "position": [900, 560],
  "parameters": {
    "jsonMode": "specificData",
    "jsonData": "={{ $json.text }}",
    "options": {
      "metadata": {
        "metadataValues": [
          { "name": "call_id", "value": "={{ $json.metadata.call_id }}" },
          { "name": "date", "value": "={{ $json.metadata.date }}" },
          { "name": "category", "value": "={{ $json.metadata.category }}" },
          { "name": "topic", "value": "={{ $json.metadata.topic }}" },
          { "name": "participants", "value": "={{ $json.metadata.participants }}" },
          { "name": "segment_participants", "value": "={{ $json.metadata.segment_participants }}" },
          { "name": "document_type", "value": "topic_segment" }
        ]
      }
    }
  }
}
```

**Step 7: Create the HTTP Request node for OpenClaw per-call notification**

```json
{
  "id": "openclaw_notify",
  "name": "Notify OpenClaw",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [1100, 900],
  "parameters": {
    "method": "POST",
    "url": "http://localhost:18789",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Authorization", "value": "Bearer 22e43380001424c8fd9748f12746f8fd68302c5953d0c99c" },
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "type", "value": "call_processed" },
        { "name": "agent", "value": "chief-of-staff" },
        { "name": "payload", "value": "={{ JSON.stringify($json) }}" }
      ]
    },
    "options": { "timeout": 10000 }
  }
}
```

**Step 8: Create the Respond to Webhook node**

```json
{
  "id": "respond_webhook",
  "name": "Respond to Webhook",
  "type": "n8n-nodes-base.respondToWebhook",
  "typeVersion": 1.1,
  "position": [1350, 300],
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({ status: 'processed', call_id: $('Parse Payload').first().json.call_id }) }}",
    "options": {}
  }
}
```

**Step 9: Wire all connections and assemble the complete Workflow 1 JSON**

Assemble all nodes into a single valid n8n workflow JSON file with these connections:

```
Webhook → Parse Payload (main)
Parse Payload → Transcript Structurer (main)
OpenAI Chat Model → Transcript Structurer (ai_languageModel)
Transcript Structurer → Split Output (main)
Split Output[0] → Store Speaker Turns (main)
Split Output[1] → Store Summary (main)
Split Output[2] → Store Action Items (main)
Split Output[3] → Store Topic Segments (main)
Split Output[4] → Notify OpenClaw (main)
Embed Speaker Turns → Store Speaker Turns (ai_embedding)
Load Speaker Turns → Store Speaker Turns (ai_document)
Embed Summary → Store Summary (ai_embedding)
Load Summary → Store Summary (ai_document)
Embed Action Items → Store Action Items (ai_embedding)
Load Action Items → Store Action Items (ai_document)
Embed Topic Segments → Store Topic Segments (ai_embedding)
Load Topic Segments → Store Topic Segments (ai_document)
Store Speaker Turns → Respond to Webhook (main)
Store Summary → Respond to Webhook (main)
Store Action Items → Respond to Webhook (main)
Store Topic Segments → Respond to Webhook (main)
Notify OpenClaw → Respond to Webhook (main)
```

**Step 10: Save and commit Workflow 1**

```bash
git add n8n-workflows/readai-transcript-processor.json
git commit -m "feat: add read.ai transcript processor workflow (Workflow 1)"
```

---

## Task 2: Build Workflow 2 JSON - EOD Call Report Trigger

**Files:**
- Create: `n8n-workflows/eod-call-report.json`

**Step 1: Create the Schedule Trigger node**

```json
{
  "id": "schedule",
  "name": "EOD Trigger",
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.2,
  "position": [100, 300],
  "parameters": {
    "rule": {
      "interval": [
        {
          "triggerAtHour": 18,
          "triggerAtMinute": 0,
          "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday"]
        }
      ]
    }
  }
}
```

**Step 2: Create the Code Node to build today's date filter**

```json
{
  "id": "date_filter",
  "name": "Build Date Filter",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [320, 300],
  "parameters": {
    "jsCode": "const today = new Date().toISOString().split('T')[0];\nreturn [{ json: { date: today, query: `Retrieve all entries from date ${today}` } }];"
  }
}
```

**Step 3: Create two Pinecone retrieval nodes (summaries + action items)**

**3a. Query call-summaries:**

```json
{
  "id": "query_summaries",
  "name": "Query Summaries",
  "type": "@n8n/n8n-nodes-langchain.vectorStorePinecone",
  "typeVersion": 1.3,
  "position": [560, 150],
  "parameters": {
    "mode": "retrieve",
    "pineconeIndex": { "__rl": true, "mode": "list", "value": "easy-yes-offer" },
    "topK": 50,
    "options": {
      "pineconeNamespace": "call-summaries",
      "metadataFilter": { "date": "={{ $json.date }}" }
    }
  }
}
```

```json
{
  "id": "embed_query_summaries",
  "name": "Embed Query Summaries",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1.2,
  "position": [560, 10],
  "parameters": { "model": "text-embedding-3-small", "options": {} }
}
```

**3b. Query call-action-items:**

```json
{
  "id": "query_actions",
  "name": "Query Action Items",
  "type": "@n8n/n8n-nodes-langchain.vectorStorePinecone",
  "typeVersion": 1.3,
  "position": [560, 450],
  "parameters": {
    "mode": "retrieve",
    "pineconeIndex": { "__rl": true, "mode": "list", "value": "easy-yes-offer" },
    "topK": 100,
    "options": {
      "pineconeNamespace": "call-action-items",
      "metadataFilter": { "date": "={{ $json.date }}" }
    }
  }
}
```

```json
{
  "id": "embed_query_actions",
  "name": "Embed Query Actions",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1.2,
  "position": [560, 310],
  "parameters": { "model": "text-embedding-3-small", "options": {} }
}
```

**Step 4: Create a Merge node to combine summaries and action items**

```json
{
  "id": "merge_results",
  "name": "Merge Results",
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3,
  "position": [800, 300],
  "parameters": {
    "mode": "combine",
    "combineBy": "combineAll",
    "options": {}
  }
}
```

**Step 5: Create the AI Agent (Daily Report Compiler)**

```json
{
  "id": "report_compiler",
  "name": "Daily Report Compiler",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 3,
  "position": [1040, 300],
  "parameters": {
    "text": "=Compile an end-of-day call report for {{ $('Build Date Filter').first().json.date }}.\n\nCALL SUMMARIES:\n{{ JSON.stringify($json) }}\n\nGenerate a structured daily report.",
    "hasOutputParser": false,
    "options": {
      "systemMessage": "You are a chief of staff assistant compiling end-of-day call reports. Generate a structured report with these sections:\n\n## Daily Call Report - [Date]\n\n### Overview\n- Total calls: [count]\n- Call types: [breakdown]\n\n### Call-by-Call Breakdown\nFor each call:\n- **[Call Title]** ([participants])\n  - Type: [call_type]\n  - Summary: [one_line]\n  - Key Decisions: [list]\n  - Action Items: [count]\n\n### Action Items (Priority Order)\nGroup by priority (high → medium → low):\n- [HIGH] [description] - Owner: [owner] - Due: [due_date]\n- [MEDIUM] ...\n\n### Key Themes\n- Common topics across today's calls\n- Patterns or concerns to watch\n\n### Immediate Attention Required\n- Any high-priority items or escalations\n\nBe concise and actionable. This report goes to the CEO."
    }
  }
}
```

```json
{
  "id": "openai_chat_eod",
  "name": "OpenAI Chat Model",
  "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
  "typeVersion": 1.2,
  "position": [1040, 80],
  "parameters": {
    "model": { "mode": "list", "value": "gpt-4o" },
    "options": { "temperature": 0.2 }
  }
}
```

**Step 6: Create the HTTP Request node for OpenClaw EOD report**

```json
{
  "id": "openclaw_eod",
  "name": "Send EOD to OpenClaw",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [1280, 300],
  "parameters": {
    "method": "POST",
    "url": "http://localhost:18789",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Authorization", "value": "Bearer 22e43380001424c8fd9748f12746f8fd68302c5953d0c99c" },
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "type", "value": "eod_call_report" },
        { "name": "agent", "value": "chief-of-staff" },
        { "name": "payload", "value": "={{ $json.output }}" }
      ]
    },
    "options": { "timeout": 15000 }
  }
}
```

**Step 7: Wire all connections and assemble Workflow 2 JSON**

```
EOD Trigger → Build Date Filter (main)
Build Date Filter → Query Summaries (main)
Build Date Filter → Query Action Items (main)
Embed Query Summaries → Query Summaries (ai_embedding)
Embed Query Actions → Query Action Items (ai_embedding)
Query Summaries → Merge Results (main, input 0)
Query Action Items → Merge Results (main, input 1)
Merge Results → Daily Report Compiler (main)
OpenAI Chat Model → Daily Report Compiler (ai_languageModel)
Daily Report Compiler → Send EOD to OpenClaw (main)
```

**Step 8: Save and commit Workflow 2**

```bash
git add n8n-workflows/eod-call-report.json
git commit -m "feat: add EOD call report workflow (Workflow 2)"
```

---

## Task 3: Import and Test in n8n

**Step 1: Import Workflow 1 into n8n**
- Open n8n UI
- Go to Workflows → Import from File
- Select `n8n-workflows/readai-transcript-processor.json`
- Verify all nodes are connected correctly
- Configure credentials: OpenAI API key, Pinecone API key

**Step 2: Test Workflow 1 with a sample transcript**
- Click "Test Workflow" on the Webhook node
- Send a test POST request:

```bash
curl -X POST http://localhost:5678/webhook-test/readai-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Sales Call - InnoSupps",
    "duration": "32 minutes",
    "transcript": {
      "speakers": ["Max", "John"],
      "speaker_blocks": [
        {"speaker": "Max", "words": "Hey John, thanks for jumping on. I wanted to discuss the new supplement launch timeline and pricing strategy."},
        {"speaker": "John", "words": "Absolutely Max. So we have the formulation ready, and I think we should target a $49.99 price point based on the competitor analysis."},
        {"speaker": "Max", "words": "I agree on the price point. What about the ad creative? Ben mentioned he needs the final product shots by Friday."},
        {"speaker": "John", "words": "I will get those to Ben by Thursday. Also, we need to decide on the landing page copy - should we go with the benefits-first approach or the problem-agitation approach?"},
        {"speaker": "Max", "words": "Let us go benefits-first for this one. Can you also loop in the media buyer to discuss budget allocation for the first two weeks?"},
        {"speaker": "John", "words": "Will do. I will set up that call for Monday. One more thing - the compliance review needs to happen before we go live."},
        {"speaker": "Max", "words": "Good call. Add that to the checklist. Let us aim for a soft launch on the 15th."}
      ]
    },
    "topics": ["product launch", "pricing", "ad creative", "landing page", "compliance"],
    "chapter_summaries": []
  }'
```

Expected: 200 response with `{ status: "processed", call_id: "..." }`

**Step 3: Verify Pinecone storage**
- Check Pinecone dashboard for `easy-yes-offer` index
- Verify vectors exist in `call-transcripts`, `call-summaries`, `call-action-items`, `call-categories` namespaces
- Confirm metadata fields are populated correctly

**Step 4: Import Workflow 2 into n8n**
- Import `n8n-workflows/eod-call-report.json`
- Configure credentials (same OpenAI + Pinecone)
- Test manually by clicking "Test Workflow" on the Schedule Trigger

**Step 5: Verify OpenClaw receives the notification**
- Check OpenClaw logs at `~/.openclaw/logs/`
- Confirm the chief of staff agent received the payload

**Step 6: Configure read.ai webhook**
- Go to read.ai settings → Integrations → Webhooks
- Set the webhook URL to your n8n production URL: `https://your-n8n-instance.com/webhook/readai-transcript`
- Save and test with a real call

---

## Task 4: Update OpenClaw Chief of Staff Briefing (Optional Enhancement)

**Files:**
- Modify: `~/.openclaw/workspace/chief-of-staff/briefing.sh`

**Step 1: Add a Pinecone query section to the briefing script**

Add after the ClickUp section in `briefing.sh` to pull today's call data directly:

```bash
# --- CALL INTELLIGENCE: Today's call summaries from Pinecone ---
echo "## Call Intelligence" > "$OUT_DIR/calls.md"
# This data comes via n8n webhook + EOD workflow
# The chief of staff receives it through the gateway
# This section serves as a fallback if the gateway notification was missed
if [ -f "$OUT_DIR/eod_calls.json" ]; then
  python3 << 'PYEOF' >> "$OUT_DIR/calls.md" 2>/dev/null || echo "No call data." >> "$OUT_DIR/calls.md"
import json,os
OUT_DIR = os.environ.get("OUT_DIR","data")
with open(f"{OUT_DIR}/eod_calls.json") as f:
    data = json.load(f)
print(data.get('payload', 'No EOD report available.'))
PYEOF
else
  echo "No call data for today." >> "$OUT_DIR/calls.md"
fi
```

**Step 2: Commit the update**

```bash
git add ~/.openclaw/workspace/chief-of-staff/briefing.sh
git commit -m "feat: add call intelligence section to chief of staff briefing"
```
