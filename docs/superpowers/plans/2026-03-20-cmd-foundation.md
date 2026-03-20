# Command Center Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Turborepo monorepo with Next.js dashboard, Neon Postgres DB schema, Clerk auth, shared packages, and a working tab navigation shell — producing a deployable skeleton that all subsequent plans build on.

**Architecture:** Turborepo monorepo with a Next.js 16 dashboard app and shared packages for DB, auth, EOS domain, Notion sync, OpenClaw client, UI components, and types. Neon Postgres via Drizzle ORM. Clerk for role-based auth. Dark-mode shadcn/ui + Geist fonts.

**Tech Stack:** Turborepo, Next.js 16, TypeScript, Drizzle ORM, Neon Postgres, Clerk, shadcn/ui, Tailwind CSS, Geist fonts

**Spec:** `docs/superpowers/specs/2026-03-20-command-center-dashboard-design.md`

**Subsequent plans:** EOS Business Tab, Life Tab, Chat Tab + Relay, Admin Tab, Notion Sync

---

### Task 1: Scaffold Turborepo Monorepo

**Files:**
- Create: `cmd/package.json`
- Create: `cmd/turbo.json`
- Create: `cmd/pnpm-workspace.yaml`
- Create: `cmd/.gitignore`
- Create: `cmd/.env.example`
- Create: `cmd/apps/dashboard/package.json`
- Create: `cmd/packages/` (empty package dirs)

- [ ] **Step 1: Create monorepo root**

```bash
mkdir -p ~/cmd
cd ~/cmd
```

Create `package.json`:
```json
{
  "name": "cmd",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "db:generate": "turbo db:generate",
    "db:migrate": "turbo db:migrate",
    "db:push": "turbo db:push"
  },
  "devDependencies": {
    "turbo": "^2.8.0"
  },
  "packageManager": "pnpm@9.15.0"
}
```

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 2: Create turbo.json**

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "globalDependencies": [".env"],
  "globalEnv": ["NODE_ENV", "CI"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "inputs": ["src/**", "app/**", "*.config.*"]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "app/**", "tsconfig.json"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    }
  }
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
.next/
dist/
.turbo/
.env
.env.local
.env*.local
*.tsbuildinfo
```

- [ ] **Step 4: Create .env.example**

```bash
# Database (Neon Postgres via Vercel Marketplace)
DATABASE_URL=

# Auth (Clerk via Vercel Marketplace)
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Notion (for sync — added in Plan 6)
NOTION_API_KEY=

# OpenClaw Relay (added in Plan 4)
RELAY_URL=
RELAY_SECRET=
```

- [ ] **Step 5: Initialize git and commit**

```bash
cd ~/cmd
git init
git add -A
git commit -m "chore: scaffold turborepo monorepo root"
```

---

### Task 2: Create Shared Types Package

**Files:**
- Create: `cmd/packages/types/package.json`
- Create: `cmd/packages/types/tsconfig.json`
- Create: `cmd/packages/types/src/index.ts`
- Create: `cmd/packages/types/src/eos.ts`
- Create: `cmd/packages/types/src/life.ts`
- Create: `cmd/packages/types/src/chat.ts`
- Create: `cmd/packages/types/src/admin.ts`
- Create: `cmd/packages/types/src/auth.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@cmd/types",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create type files**

`src/auth.ts`:
```typescript
export type UserRole = "admin" | "team_member" | "viewer";

export interface AppUser {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface TabAccess {
  chat: boolean;
  life: boolean;
  business: boolean;
  admin: boolean;
}

export const ROLE_ACCESS: Record<UserRole, TabAccess> = {
  admin: { chat: true, life: true, business: true, admin: true },
  team_member: { chat: false, life: false, business: true, admin: false },
  viewer: { chat: false, life: false, business: true, admin: false },
};
```

`src/eos.ts`:
```typescript
export interface ScorecardKpi {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  goal: number;
  unit: string; // "$", "%", "#", "x"
  quarter: string; // "2026-Q1"
  createdAt: Date;
}

export interface ScorecardEntry {
  id: string;
  kpiId: string;
  weekStart: string; // ISO date of Monday
  goal: number;
  actual: number | null;
  status: "on_track" | "off_track" | "no_data";
}

export type RockStatus = "on_track" | "off_track" | "done";

export interface Rock {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  quarter: string;
  status: RockStatus;
  dueDate: string;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  rockId: string;
  title: string;
  completed: boolean;
  sortOrder: number;
}

export type IssueCategory = "short_term" | "long_term";
export type IssuePhase = "identify" | "discuss" | "solve" | "resolved";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  phase: IssuePhase;
  ownerId: string | null;
  ownerName: string | null;
  priority: number;
  createdAt: Date;
  resolvedAt: Date | null;
}

export interface Todo {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  dueDate: string | null;
  completed: boolean;
  sourceType: "issue" | "meeting" | "manual";
  sourceId: string | null;
  createdAt: Date;
}

export interface VtoSection {
  id: string;
  sectionKey: string; // "core_values" | "core_focus" | "ten_year_target" | etc.
  content: string; // rich text / markdown
  version: number;
  updatedAt: Date;
}

export type MeetingSegment =
  | "segue"
  | "scorecard"
  | "rocks"
  | "headlines"
  | "todos"
  | "ids"
  | "conclude";

export interface Meeting {
  id: string;
  date: string;
  status: "scheduled" | "in_progress" | "completed";
  currentSegment: MeetingSegment | null;
  segmentStartedAt: Date | null;
  rating: number | null;
  notes: string;
  createdAt: Date;
}

export type GwcRating = "yes" | "no" | "maybe";

export interface Seat {
  id: string;
  title: string;
  parentSeatId: string | null;
  personId: string | null;
  personName: string | null;
  roles: string[]; // up to 5
  getsIt: GwcRating | null;
  wantsIt: GwcRating | null;
  capacityForIt: GwcRating | null;
  sortOrder: number;
}
```

`src/life.ts`:
```typescript
export type PillarKey = "profit" | "power" | "purpose" | "presence";

export interface PillarScore {
  id: string;
  pillar: PillarKey;
  score: number; // 1-10
  weekStart: string;
  notes: string | null;
}

export type PipelineLevel =
  | "life_goal"
  | "annual_aim"
  | "quarterly_objective"
  | "monthly_sprint"
  | "weekly_focus"
  | "daily_action";

export interface PipelineEntry {
  id: string;
  level: PipelineLevel;
  title: string;
  description: string;
  progress: number; // 0-100
  startDate: string;
  endDate: string;
  parentId: string | null;
}

export interface Priority {
  id: string;
  title: string;
  pillar: PillarKey;
  date: string;
  completed: boolean;
  sortOrder: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  stackType: string; // "sovereign_self" | "gratitude" | "idea" | "discovery"
  prompt: string;
  content: string;
  createdAt: Date;
}
```

`src/chat.ts`:
```typescript
export interface AgentChannel {
  id: string;
  agentId: string;
  agentName: string;
  agentEmoji: string;
  isGeneral: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  role: "user" | "assistant";
  agentId: string | null;
  agentName: string | null;
  content: string;
  createdAt: Date;
}

export type RelayStatus = "connected" | "reconnecting" | "offline";
```

`src/admin.ts`:
```typescript
export interface AgentConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  model: string;
  isOnline: boolean;
  messagesToday: number;
  lastActiveAt: Date | null;
}

export interface IntegrationStatus {
  name: string;
  connected: boolean;
  lastSyncAt: Date | null;
  error: string | null;
}
```

`src/index.ts`:
```typescript
export * from "./auth";
export * from "./eos";
export * from "./life";
export * from "./chat";
export * from "./admin";
```

- [ ] **Step 4: Commit**

```bash
git add packages/types
git commit -m "feat: add @cmd/types shared types package"
```

---

### Task 3: Create Database Package with Drizzle Schema

**Files:**
- Create: `cmd/packages/db/package.json`
- Create: `cmd/packages/db/tsconfig.json`
- Create: `cmd/packages/db/src/index.ts`
- Create: `cmd/packages/db/src/client.ts`
- Create: `cmd/packages/db/src/schema/auth.ts`
- Create: `cmd/packages/db/src/schema/eos.ts`
- Create: `cmd/packages/db/src/schema/life.ts`
- Create: `cmd/packages/db/src/schema/chat.ts`
- Create: `cmd/packages/db/src/schema/agents.ts`
- Create: `cmd/packages/db/src/schema/index.ts`
- Create: `cmd/packages/db/drizzle.config.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@cmd/db",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "drizzle-orm": "^0.39.0",
    "@neondatabase/serverless": "^0.10.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create drizzle.config.ts**

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 3: Create DB client**

`src/client.ts`:
```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;
```

- [ ] **Step 4: Create auth schema**

`src/schema/auth.ts`:
```typescript
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("viewer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

- [ ] **Step 5: Create EOS schema**

`src/schema/eos.ts`:
```typescript
import {
  pgTable, text, varchar, integer, numeric, boolean,
  timestamp, date,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const scorecardKpis = pgTable("scorecard_kpis", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: text("owner_id").references(() => users.id),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  goal: numeric("goal").notNull(),
  unit: varchar("unit", { length: 10 }).notNull().default("#"),
  quarter: varchar("quarter", { length: 10 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const scorecardEntries = pgTable("scorecard_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  kpiId: text("kpi_id").notNull().references(() => scorecardKpis.id, { onDelete: "cascade" }),
  weekStart: date("week_start").notNull(),
  goal: numeric("goal").notNull(),
  actual: numeric("actual"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const rocks = pgTable("rocks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 500 }).notNull(),
  ownerId: text("owner_id").references(() => users.id),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  quarter: varchar("quarter", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("on_track"),
  dueDate: date("due_date").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const milestones = pgTable("milestones", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  rockId: text("rock_id").notNull().references(() => rocks.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  completed: boolean("completed").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const issues = pgTable("issues", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull().default(""),
  category: varchar("category", { length: 20 }).notNull().default("short_term"),
  phase: varchar("phase", { length: 20 }).notNull().default("identify"),
  ownerId: text("owner_id").references(() => users.id),
  ownerName: varchar("owner_name", { length: 255 }),
  priority: integer("priority").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const todos = pgTable("todos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 500 }).notNull(),
  ownerId: text("owner_id").references(() => users.id),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  dueDate: date("due_date"),
  completed: boolean("completed").notNull().default(false),
  sourceType: varchar("source_type", { length: 20 }),
  sourceId: text("source_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const vtoSections = pgTable("vto_sections", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sectionKey: varchar("section_key", { length: 50 }).notNull().unique(),
  content: text("content").notNull().default(""),
  version: integer("version").notNull().default(1),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const meetings = pgTable("meetings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("scheduled"),
  currentSegment: varchar("current_segment", { length: 20 }),
  segmentStartedAt: timestamp("segment_started_at"),
  rating: integer("rating"),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const seats = pgTable("seats", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  parentSeatId: text("parent_seat_id"),
  personId: text("person_id").references(() => users.id),
  personName: varchar("person_name", { length: 255 }),
  roles: text("roles").array().notNull().default([]),
  getsIt: varchar("gets_it", { length: 10 }),
  wantsIt: varchar("wants_it", { length: 10 }),
  capacityForIt: varchar("capacity_for_it", { length: 10 }),
  sortOrder: integer("sort_order").notNull().default(0),
});
```

- [ ] **Step 6: Create Life schema**

`src/schema/life.ts`:
```typescript
import {
  pgTable, text, varchar, integer, numeric, boolean,
  timestamp, date,
} from "drizzle-orm/pg-core";

export const pillarScores = pgTable("pillar_scores", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  pillar: varchar("pillar", { length: 20 }).notNull(),
  score: numeric("score").notNull(),
  weekStart: date("week_start").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pipelineEntries = pgTable("pipeline_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  level: varchar("level", { length: 30 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull().default(""),
  progress: integer("progress").notNull().default(0),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  parentId: text("parent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const priorities = pgTable("priorities", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 500 }).notNull(),
  pillar: varchar("pillar", { length: 20 }).notNull(),
  date: date("date").notNull(),
  completed: boolean("completed").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const journalEntries = pgTable("journal_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: date("date").notNull(),
  stackType: varchar("stack_type", { length: 30 }).notNull(),
  prompt: text("prompt").notNull(),
  content: text("content").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

- [ ] **Step 7: Create Chat schema**

`src/schema/chat.ts`:
```typescript
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const agentChannels = pgTable("agent_channels", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  agentId: varchar("agent_id", { length: 255 }).notNull(),
  agentName: varchar("agent_name", { length: 255 }).notNull(),
  agentEmoji: varchar("agent_emoji", { length: 10 }).notNull(),
  isGeneral: boolean("is_general").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  channelId: text("channel_id").notNull().references(() => agentChannels.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(),
  agentId: varchar("agent_id", { length: 255 }),
  agentName: varchar("agent_name", { length: 255 }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messageQueue = pgTable("message_queue", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  channelId: text("channel_id").notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deliveredAt: timestamp("delivered_at"),
});
```

- [ ] **Step 8: Create Agents schema**

`src/schema/agents.ts`:
```typescript
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  openclawId: varchar("openclaw_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  description: text("description").notNull().default(""),
  model: varchar("model", { length: 100 }).notNull(),
  isOnline: boolean("is_online").notNull().default(false),
  messagesToday: integer("messages_today").notNull().default(0),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

- [ ] **Step 9: Create schema index**

`src/schema/index.ts`:
```typescript
export * from "./auth";
export * from "./eos";
export * from "./life";
export * from "./chat";
export * from "./agents";
```

- [ ] **Step 10: Create package index**

`src/index.ts`:
```typescript
export { createDb, type Database } from "./client";
export * from "./schema";
```

- [ ] **Step 11: Commit**

```bash
git add packages/db
git commit -m "feat: add @cmd/db package with Drizzle schema for all domains"
```

---

### Task 4: Create Auth Package

**Files:**
- Create: `cmd/packages/auth/package.json`
- Create: `cmd/packages/auth/tsconfig.json`
- Create: `cmd/packages/auth/src/index.ts`
- Create: `cmd/packages/auth/src/roles.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@cmd/auth",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@clerk/nextjs": "^6.0.0",
    "@cmd/types": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create roles.ts**

```typescript
import type { UserRole, TabAccess } from "@cmd/types";

export const ROLE_ACCESS: Record<UserRole, TabAccess> = {
  admin: { chat: true, life: true, business: true, admin: true },
  team_member: { chat: false, life: false, business: true, admin: false },
  viewer: { chat: false, life: false, business: true, admin: false },
};

export function canAccessTab(role: UserRole, tab: keyof TabAccess): boolean {
  return ROLE_ACCESS[role][tab];
}

export function getAccessibleTabs(role: UserRole): (keyof TabAccess)[] {
  const access = ROLE_ACCESS[role];
  return (Object.keys(access) as (keyof TabAccess)[]).filter((tab) => access[tab]);
}
```

- [ ] **Step 3: Create index.ts**

```typescript
export { canAccessTab, getAccessibleTabs, ROLE_ACCESS } from "./roles";
```

- [ ] **Step 4: Commit**

```bash
git add packages/auth
git commit -m "feat: add @cmd/auth package with role-based access control"
```

---

### Task 5: Create UI Package with shadcn/ui

**Files:**
- Create: `cmd/packages/ui/package.json`
- Create: `cmd/packages/ui/tsconfig.json`
- Create: `cmd/packages/ui/src/index.ts`
- Create: `cmd/packages/ui/src/lib/utils.ts`
- Create: `cmd/packages/ui/tailwind.config.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@cmd/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create utils.ts**

`src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Create index.ts**

```typescript
export { cn } from "./lib/utils";
```

- [ ] **Step 4: Commit**

```bash
git add packages/ui
git commit -m "feat: add @cmd/ui shared component package"
```

---

### Task 6: Scaffold Next.js 16 Dashboard App

**Files:**
- Create: `cmd/apps/dashboard/package.json`
- Create: `cmd/apps/dashboard/tsconfig.json`
- Create: `cmd/apps/dashboard/next.config.ts`
- Create: `cmd/apps/dashboard/postcss.config.js`
- Create: `cmd/apps/dashboard/app/globals.css`
- Create: `cmd/apps/dashboard/app/layout.tsx`
- Create: `cmd/apps/dashboard/app/page.tsx`
- Create: `cmd/apps/dashboard/middleware.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@cmd/dashboard",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@clerk/nextjs": "^6.0.0",
    "@cmd/db": "workspace:*",
    "@cmd/auth": "workspace:*",
    "@cmd/types": "workspace:*",
    "@cmd/ui": "workspace:*",
    "geist": "^1.4.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.5.0"
  }
}
```

- [ ] **Step 2: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cmd/db", "@cmd/auth", "@cmd/types", "@cmd/ui"],
};

export default nextConfig;
```

- [ ] **Step 3: Create postcss.config.js**

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 4: Create globals.css**

Note: Tailwind v4 uses CSS-based configuration — no `tailwind.config.ts` needed. Content detection is automatic.

```css
@import "tailwindcss";
@import "geist/font/sans";
@import "geist/font/mono";

@source "../../packages/ui/src";

:root {
  --font-sans: "Geist", sans-serif;
  --font-mono: "Geist Mono", monospace;
}

body {
  font-family: var(--font-sans);
  background: #0a0a0a;
  color: #fafafa;
}
```

- [ ] **Step 5: Create middleware.ts (Clerk auth)**

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
```

- [ ] **Step 6: Create root layout**

`app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMD — Command Center",
  description: "Unified personal command center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body className="min-h-screen bg-[#0a0a0a] text-zinc-50 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

- [ ] **Step 7: Create placeholder page**

`app/page.tsx`:
```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/chat");
}
```

- [ ] **Step 8: Commit**

```bash
git add apps/dashboard
git commit -m "feat: scaffold Next.js 16 dashboard app with Clerk auth"
```

---

### Task 7: Build Tab Navigation Shell

**Files:**
- Create: `cmd/apps/dashboard/components/tab-nav.tsx`
- Create: `cmd/apps/dashboard/components/relay-status.tsx`
- Create: `cmd/apps/dashboard/components/user-menu.tsx`
- Create: `cmd/apps/dashboard/app/(tabs)/layout.tsx`
- Create: `cmd/apps/dashboard/app/(tabs)/chat/page.tsx`
- Create: `cmd/apps/dashboard/app/(tabs)/life/page.tsx`
- Create: `cmd/apps/dashboard/app/(tabs)/business/page.tsx`
- Create: `cmd/apps/dashboard/app/(tabs)/admin/page.tsx`

- [ ] **Step 1: Create TabNav component**

`components/tab-nav.tsx`:
```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@cmd/ui";
import type { TabAccess } from "@cmd/types";

const TABS: { key: keyof TabAccess; label: string; emoji: string; href: string }[] = [
  { key: "chat", label: "Chat", emoji: "💬", href: "/chat" },
  { key: "life", label: "Life", emoji: "🌀", href: "/life" },
  { key: "business", label: "Business", emoji: "📊", href: "/business" },
  { key: "admin", label: "Admin", emoji: "⚙️", href: "/admin" },
];

interface TabNavProps {
  accessibleTabs: (keyof TabAccess)[];
}

export function TabNav({ accessibleTabs }: TabNavProps) {
  const pathname = usePathname();

  const visibleTabs = TABS.filter((tab) => accessibleTabs.includes(tab.key));

  return (
    <div className="flex gap-0.5 rounded-lg bg-zinc-900 p-0.5">
      {visibleTabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-zinc-800 text-zinc-50"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.emoji} {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create RelayStatus component**

`components/relay-status.tsx`:
```tsx
"use client";

import { cn } from "@cmd/ui";
import type { RelayStatus as RelayStatusType } from "@cmd/types";

interface RelayStatusProps {
  status: RelayStatusType;
}

const STATUS_CONFIG: Record<RelayStatusType, { color: string; label: string }> = {
  connected: { color: "bg-green-500", label: "connected" },
  reconnecting: { color: "bg-amber-500", label: "reconnecting" },
  offline: { color: "bg-red-500", label: "offline" },
};

export function RelayStatus({ status }: RelayStatusProps) {
  const config = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px] text-zinc-600">
        relay: {config.label}
      </span>
      <div className={cn("h-2 w-2 rounded-full", config.color)} />
    </div>
  );
}
```

- [ ] **Step 3: Create UserMenu component**

`components/user-menu.tsx`:
```tsx
import { UserButton } from "@clerk/nextjs";

export function UserMenu() {
  return <UserButton afterSignOutUrl="/sign-in" />;
}
```

- [ ] **Step 4: Create tabs layout**

`app/(tabs)/layout.tsx`:
```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TabNav } from "../../components/tab-nav";
import { RelayStatus } from "../../components/relay-status";
import { UserMenu } from "../../components/user-menu";
import { getAccessibleTabs } from "@cmd/auth";
import type { UserRole } from "@cmd/types";

export default async function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = (sessionClaims?.metadata as { role?: UserRole })?.role ?? "admin";
  const accessibleTabs = getAccessibleTabs(role);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold tracking-tight">⚡ CMD</span>
          <TabNav accessibleTabs={accessibleTabs} />
        </div>
        <div className="flex items-center gap-3">
          <RelayStatus status="offline" />
          <UserMenu />
        </div>
      </header>

      {/* Tab content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

- [ ] **Step 5: Create placeholder tab pages**

`app/(tabs)/chat/page.tsx`:
```tsx
export default function ChatPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">💬 Chat</h2>
        <p className="text-zinc-500">Agent conversations — coming in Plan 4</p>
      </div>
    </div>
  );
}
```

`app/(tabs)/life/page.tsx`:
```tsx
export default function LifePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🌀 Life</h2>
        <p className="text-zinc-500">Pillars, Pipeline, Today — coming in Plan 3</p>
      </div>
    </div>
  );
}
```

`app/(tabs)/business/page.tsx`:
```tsx
export default function BusinessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">📊 Business</h2>
        <p className="text-zinc-500">Full EOS operating system — coming in Plan 2</p>
      </div>
    </div>
  );
}
```

`app/(tabs)/admin/page.tsx`:
```tsx
export default function AdminPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">⚙️ Admin</h2>
        <p className="text-zinc-500">Agent management — coming in Plan 5</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/dashboard/components apps/dashboard/app
git commit -m "feat: add tab navigation shell with role-based access"
```

---

### Task 8: Create Sign-in/Sign-up Pages

**Files:**
- Create: `cmd/apps/dashboard/app/sign-in/[[...sign-in]]/page.tsx`
- Create: `cmd/apps/dashboard/app/sign-up/[[...sign-up]]/page.tsx`

- [ ] **Step 1: Create sign-in page**

`app/sign-in/[[...sign-in]]/page.tsx`:
```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">⚡ CMD</h1>
        <SignIn />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create sign-up page**

`app/sign-up/[[...sign-up]]/page.tsx`:
```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">⚡ CMD</h1>
        <SignUp />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/sign-in apps/dashboard/app/sign-up
git commit -m "feat: add Clerk sign-in and sign-up pages"
```

---

### Task 9: Install Dependencies, Push DB Schema, Verify

- [ ] **Step 1: Install all dependencies**

```bash
cd ~/cmd
pnpm install
```

- [ ] **Step 2: Link Vercel project and pull env vars**

```bash
cd ~/cmd
vercel link
vercel integration add neon
vercel integration add clerk
vercel env pull apps/dashboard/.env.local
```

Note: Clerk integration requires terms acceptance in terminal — user must run this manually. After CLI install, complete setup in Vercel Dashboard.

- [ ] **Step 3: Set Clerk env vars**

After Clerk is set up, add to `.env.local`:
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

- [ ] **Step 4: Push DB schema to Neon**

```bash
cd ~/cmd/packages/db
pnpm db:push
```

Expected: All tables created in Neon (users, scorecard_kpis, scorecard_entries, rocks, milestones, issues, todos, vto_sections, meetings, seats, pillar_scores, pipeline_entries, priorities, journal_entries, agent_channels, chat_messages, message_queue, agents).

- [ ] **Step 5: Start dev server and verify**

```bash
cd ~/cmd
pnpm dev --filter=@cmd/dashboard
```

Expected:
- Opens at http://localhost:3000
- Redirects to /sign-in (Clerk)
- After sign-in, redirects to /chat
- Tab bar shows: ⚡ CMD [💬 Chat] [🌀 Life] [📊 Business] [⚙️ Admin]
- Relay status shows "offline" (expected — relay not built yet)
- Each tab shows its placeholder page

- [ ] **Step 6: Commit any adjustments**

```bash
git add -A
git commit -m "chore: verify foundation — install deps, push schema, confirm dev server"
```

---

### Task 10: Deploy to Vercel

- [ ] **Step 1: Deploy preview**

```bash
cd ~/cmd
vercel deploy
```

Expected: Preview URL deployed, Clerk auth working, all 4 tabs navigable.

- [ ] **Step 2: Verify preview deployment**

Open the preview URL. Confirm:
- Sign-in page loads with Clerk
- After auth, tab navigation works
- All placeholder pages render
- Dark theme applied

- [ ] **Step 3: Deploy to production**

```bash
vercel --prod
```

- [ ] **Step 4: Commit deployment config if any vercel.json was generated**

```bash
git add -A
git commit -m "chore: initial Vercel deployment"
```
