# Command Center Dashboard — Design Spec

**Date:** 2026-03-20
**Author:** Max + Claude
**Status:** Draft

## Overview

A unified personal command center that consolidates Max's OpenClaw agent ecosystem, Notion LifeOS, and EOS business framework into a single always-on dashboard. Deployed to Vercel with a relay bridge to the local OpenClaw gateway, accessible from any device.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Usage pattern | Always-on command center | Dense, real-time, keep open all day |
| Data backend | Neon Postgres with Notion sync | Fast UI reads/writes, bidirectional sync with existing Notion databases |
| Chat model | General channel + agent-specific channels | Smart routing for casual use, dedicated threads for focused agent work |
| EOS depth | Full operating system | Replace Ninety.io — Scorecard, Rocks, V/TO, Issues, L10, Accountability Chart |
| Life tab | Pillar scorecards + Pipeline + Today daily driver | Glanceable health scores, goal cascade, and actionable daily view |
| Hosting | Vercel with OpenClaw relay | Accessible anywhere, works when laptop is offline via message queue |
| Auth | Role-based (Clerk) | Max sees everything, team members see Business tab only |
| Architecture | Turborepo monorepo | Relay deploys independently, EOS domain is testable in isolation |

## Architecture

### Monorepo Structure

```
cmd/                              # "Command Center"
├── apps/
│   ├── dashboard/                # Next.js 16 App Router
│   │   ├── app/
│   │   │   ├── (chat)/           # Chat tab — agent conversations
│   │   │   ├── (life)/           # Life tab — Today, Pillars, Pipeline
│   │   │   ├── (business)/       # Business tab — Scorecard, Rocks, V/TO, Issues, L10, Team
│   │   │   ├── (admin)/          # Admin tab — Agents, Workflows, Memory, Integrations, Relay, Team Access
│   │   │   ├── api/              # API routes
│   │   │   └── layout.tsx        # Root layout with tab navigation
│   │   └── proxy.ts              # Clerk auth middleware
│   │
│   └── relay/                    # OpenClaw ↔ Cloud bridge service
│       ├── src/
│       │   ├── ws-server.ts      # WebSocket hub (cloud side)
│       │   ├── queue.ts          # Message queue for offline delivery
│       │   └── sync.ts           # State synchronization on reconnect
│       └── Dockerfile
│
├── packages/
│   ├── @cmd/db/                  # Drizzle ORM schema + migrations
│   │   ├── schema/
│   │   │   ├── chat.ts           # conversations, messages, agent_channels
│   │   │   ├── eos.ts            # scorecard_kpis, scorecard_entries, rocks, milestones, issues, todos, vto_sections, meetings, meeting_segments
│   │   │   ├── life.ts           # pillars, pillar_scores, pipeline_levels, pipeline_entries, journal_entries, priorities
│   │   │   ├── agents.ts         # agents, agent_configs, agent_memory
│   │   │   └── auth.ts           # users, roles, team_access
│   │   └── migrations/
│   │
│   ├── @cmd/auth/                # Clerk config + role definitions
│   │   ├── roles.ts              # admin, team_member, viewer
│   │   └── middleware.ts         # Route protection helpers
│   │
│   ├── @cmd/eos/                 # EOS domain logic
│   │   ├── scorecard.ts          # KPI CRUD, 13-week trailing, status calc
│   │   ├── rocks.ts              # Rock CRUD, milestones, progress
│   │   ├── vto.ts                # V/TO sections, version history
│   │   ├── issues.ts             # IDS workflow, priority ranking
│   │   ├── l10.ts                # Meeting flow, timer, segment mgmt
│   │   ├── team.ts               # Accountability chart, GWC, People Analyzer
│   │   └── todos.ts              # To-do tracking (from meetings + issues)
│   │
│   ├── @cmd/notion/              # Notion sync engine
│   │   ├── client.ts             # Notion API wrapper
│   │   ├── sync.ts               # Bidirectional sync logic
│   │   ├── mappings.ts           # DB field → schema field mappings
│   │   └── conflict.ts           # Last-write-wins conflict resolution
│   │
│   ├── @cmd/openclaw/            # Gateway client
│   │   ├── types.ts              # Agent, conversation, message types
│   │   ├── relay-client.ts       # WebSocket client (runs on laptop)
│   │   └── api.ts                # REST wrappers for gateway :18789
│   │
│   ├── @cmd/ui/                  # Shared UI components (shadcn/ui)
│   │   └── components/
│   │
│   └── @cmd/types/               # Shared TypeScript types
│       ├── eos.ts
│       ├── life.ts
│       ├── chat.ts
│       └── admin.ts
│
├── turbo.json
├── package.json
└── .env.local
```

### Data Flow

```
┌─────────────────┐     WebSocket      ┌──────────────────────┐    REST/Cron     ┌──────────┐
│  YOUR LAPTOP    │ ←──────────────── → │  VERCEL (CLOUD)      │ ← ─ ─ ─ ─ ─ → │  NOTION  │
│                 │   (persistent)      │                      │   (5-min poll)  │          │
│  OpenClaw GW    │                     │  Next.js Dashboard   │                 │  ASL DBs │
│  :18789         │                     │  Relay Server        │                 │  Workout │
│  10 agents      │                     │  Neon Postgres       │                 │          │
│  Antfarm :3333  │                     │  Clerk Auth          │                 │          │
│  Relay Client   │                     │                      │                 │          │
└─────────────────┘                     └──────────────────────┘                 └──────────┘
```

**Key flows:**
- **Chat message:** Dashboard → Relay Server → WebSocket → Relay Client → OpenClaw Gateway → Agent → Response back through same path
- **Chat (laptop offline):** Dashboard → Relay Server → Neon queue → Delivered when WebSocket reconnects
- **Scorecard edit:** Dashboard → Neon DB (immediate) → Notion sync on next 5-min cycle
- **Notion edit:** Notion → Sync cron detects change → Neon DB updated → Dashboard reflects via SWR revalidation

## Tab Design

### 1. Chat Tab

**Sub-navigation:** Agent sidebar (left panel)

**Channels:**
- `#general` — Smart-routed channel. User types naturally, system routes to the best agent. Can @mention a specific agent to override.
- Agent-specific channels — One per agent (Leadership Architect, Chief of Staff, Workout Agent, etc.). Click agent in sidebar to open dedicated thread.

**Features:**
- Streaming responses rendered via AI Elements (`<Message>` components)
- Inline structured data (scorecard tables, code blocks, charts) within messages
- Agent online/offline status (green dot = gateway connected, gray = offline)
- Message history persisted in Neon (searchable)
- Offline message queue — messages sent while laptop is off get queued and delivered on reconnect

**Smart routing logic:** When a message is sent to `#general`, the system:
1. Checks for explicit @mentions
2. If none, analyzes message content against agent descriptions
3. Routes to the best-matching agent
4. Shows which agent is responding in the message header

### 2. Life Tab

**Sub-tabs:** Today | Pillars | Pipeline

#### Today (default, daily driver)
- **Pillar Pulse** — 4-quadrant grid showing health score (1-10) for each pillar (Profit, Power, Purpose, Presence) with trend arrows (↑↓—) vs. last week
- **Today's Priorities** — Checklist of today's tasks, each tagged with its pillar. Pulls from pipeline system. Checkable inline.
- **Daily Stack** — Journal prompt with streak counter. Inline writing area. Prompts rotate based on stack type (Sovereign Self, Gratitude, Idea, Discovery).
- **Schedule** — Calendar snapshot pulled from Google Calendar. Color-coded by category.
- **Weekly Focus** — Current week's goal with progress bar and days remaining.

#### Pillars
- Expanded card for each pillar with:
  - **Profit:** Revenue metrics, pipeline value, close rate, Scorecard summary
  - **Power:** Workout streak, recent PRs, program phase, recovery status
  - **Purpose:** Journal streak, reflection count, current Sovereign Self theme
  - **Presence:** Family time log, Violet milestones, upcoming family events
- Each pillar card is clickable for detailed history

#### Pipeline
- Visual cascade view: Life Goal → Annual Aim → Quarterly Objective → Monthly Sprint → Weekly Focus → Today
- Each level shows: title, progress %, key metrics
- Trace how today's actions ladder up to the Chief Aim ($1M/month at 50% margin)

### 3. Business Tab

**Sub-tabs:** Scorecard | Rocks | V/TO | Issues | L10 | Team

#### Scorecard
- Weekly KPI table with columns: KPI name, Owner, Goal, Actual, Status (auto-calculated), 13-Week Trend (sparkline)
- Week navigation (← Prev / Next →)
- Summary badges: "X on track, Y off track"
- Inline editing — click any Goal or Actual cell to edit
- Off-track rows auto-highlighted (amber background)
- Add/remove KPIs, set goals per quarter
- KPIs stored in Neon as source of truth (Scorecard is a new data model, not synced from an existing Notion DB)

#### Rocks
- Quarterly goal cards with: Title, Owner, Due date, Status (On Track / Off Track / Done)
- Progress bar per rock (based on milestone completion)
- Expand rock to see/manage milestones
- Filter by: Owner, Quarter, Status
- Drag to reorder priority

#### V/TO (Vision/Traction Organizer)
- Structured sections: Core Values, Core Focus (Purpose + Niche), 10-Year Target, Marketing Strategy (Target Market, 3 Uniques, Proven Process, Guarantee), 3-Year Picture, 1-Year Plan, Quarterly Rocks
- Each section editable with rich text
- Version history — see previous iterations

#### Issues
- Two lists: Short-term (this quarter) and Long-term (future)
- IDS workflow per issue: Identify → Discuss → Solve
- Priority ranking via drag-and-drop
- Owner assignment
- When solved: convert to To-Do with owner + due date
- Issues can be created from L10 meetings or standalone

#### L10 Meeting
- Structured 90-minute meeting flow with section timer:
  - Segue (5 min) — Good news, personal + professional
  - Scorecard Review (5 min) — Auto-populated from Scorecard tab
  - Rock Review (5 min) — Auto-populated from Rocks tab
  - Customer/Employee Headlines (5 min) — Free-form input
  - To-Do Review (5 min) — Check off completed, carry forward
  - IDS (60 min) — Prioritize issues, work through IDS process
  - Conclude (5 min) — Recap To-Dos, rate meeting 1-10
- Timer with visual progress bar per segment
- Meeting notes saved with date + participants
- To-Dos created during meeting auto-populate To-Do list
- Meeting history with per-meeting ratings trend
- **Multiplayer:** L10 is collaborative — timer state, To-Do creation, and IDS progress are shared in real-time via SWR polling (1s interval during active meetings). All team members in a meeting see the same timer and can add To-Dos simultaneously.

#### Team (Accountability Chart)
- Org chart visualization: Visionary (Max) → Integrator (Matt Benter) → Department Heads
- Each seat shows: Name, 5 key roles, GWC rating (Get it / Want it / Capacity to do it)
- Right Person Right Seat (RPRS) indicator per person
- People Analyzer: Score each person against Core Values (+ / +- / -)
- Team directory: Name, Role, Status (Active / Onboarding / Waiting), Contact info
- Editable — add/remove seats, reassign people

### 4. Admin Tab

**Sub-tabs:** Agents | Workflows | Memory | Integrations | Relay Status | Team Access | Settings

#### Agents
- List of all OpenClaw agents with: emoji, name, description, model, online/offline status, messages today
- Click "Configure" to view/edit: IDENTITY.md, SOUL.md, knowledge base files, model selection, tool permissions
- Agent config changes sync to local OpenClaw via relay

#### Workflows (Antfarm)
- Kanban board replicating Antfarm dashboard (:3333)
- Columns: plan → setup → implement → verify → test → PR → review
- Run cards with status, timestamps, agent assignments
- Click card for step-by-step detail + output logs
- Medic watchdog status

#### Memory
- Browse agent memories by agent
- Search across all memories
- View daily notes (chronological)
- Knowledge base file browser per agent

#### Integrations
- Connection status for: Notion, Gmail (3 accounts), Google Calendar, Slack, ClickUp, Telegram, Limitless
- Last sync timestamp per integration
- Manual re-sync button
- API key/token management

#### Relay Status
- WebSocket connection health (connected / reconnecting / offline)
- Message queue depth (pending messages when offline)
- Sync log (recent sync events with timestamps)
- Latency metrics

#### Team Access
- Invite team members via email
- Role assignment: Admin (all tabs), Team Member (Business tab), Viewer (read-only Business)
- Per-tab visibility matrix
- Active sessions

#### Settings
- Theme (dark/light — default dark)
- Notification preferences
- Notion database ID configuration
- OpenClaw gateway URL
- Sync interval configuration

## Auth & Roles

| Role | Chat | Life | Business | Admin |
|------|------|------|----------|-------|
| Admin (Max) | Full access | Full access | Full access | Full access |
| Team Member | No access | No access | View + Edit (own KPIs, Rocks, Issues) | No access |
| Viewer | No access | No access | View only | No access |

Auth provider: **Clerk** (Vercel Marketplace integration)
- SSO support for team if needed later
- Middleware-based route protection via `proxy.ts`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components) |
| Build | Turborepo (monorepo orchestration) |
| UI | shadcn/ui + Tailwind CSS + Geist fonts |
| Database | Neon Postgres (Vercel Marketplace) |
| ORM | Drizzle |
| Auth | Clerk (Vercel Marketplace) |
| Real-time | WebSocket (relay), SWR (client polling) |
| Chat UI | AI SDK v6 + AI Elements |
| Hosting | Vercel (dashboard) + Fly.io or Railway (relay — needs persistent WebSocket) |
| Notion sync | Notion API, cron-based bidirectional sync |

## Relay Architecture

The relay is the critical bridge between the local OpenClaw gateway and the cloud dashboard.

**Relay Client** (runs on Max's laptop):
- Lightweight Node.js process that starts with OpenClaw
- Maintains persistent WebSocket connection to cloud Relay Server
- Proxies messages between dashboard users and OpenClaw gateway (:18789)
- On disconnect: queues outbound messages locally, delivers on reconnect
- On reconnect: syncs agent state (online/offline, configs) to cloud DB

**Relay Server** (runs on Vercel):
- WebSocket hub accepting connections from Relay Client
- When client connected: proxies chat messages in real-time
- When client disconnected: queues inbound messages in Neon DB
- Exposes REST API for dashboard to send/receive messages
- Health check endpoint for status monitoring

**Offline behavior:**
- Dashboard shows relay status as "offline" with amber indicator
- Chat messages sent while offline get queued in Neon
- EOS/Life tabs continue working normally (cloud DB)
- On reconnect: queued messages delivered to agents, responses flow back

## Notion Sync

**Strategy:** Bidirectional, cron-based, last-write-wins

**Sync interval:** Every 5 minutes (configurable)

**Synced databases:**
- ASL Project Management → Rocks + Milestones
- ASL Action Items → To-Dos
- ASL 4x4 Leadership → Meeting history
- ASL Team → Accountability Chart
- Workout DB → Power pillar metrics

**Conflict resolution:** Last-write-wins based on `updated_at` timestamps. Both Neon and Notion records track modification time. The most recent write takes precedence.

**Manual sync:** Button in Admin → Integrations to force immediate sync.

## Non-Functional Requirements

- **Performance:** Dashboard loads in <2s. Scorecard table renders with 13 weeks × 8+ KPIs without jank.
- **Availability:** Dashboard works 100% of the time for EOS/Life tabs (cloud DB). Chat degrades gracefully when laptop is offline (queue messages).
- **Mobile:** Responsive layout. All tabs usable on phone. Chat tab is mobile-first.
- **Security:** All data encrypted in transit (TLS). Clerk handles auth tokens. No API keys in frontend. Notion token stored as Vercel env var.
