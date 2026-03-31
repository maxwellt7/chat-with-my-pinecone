export interface EmailEntry {
  index: number;
  sequence: "welcome" | "nurture" | "sales";
  sendDay: number; // days after signup
  subject: string;
  preheader: string;
  body: string; // plain text body (rendered into React Email template)
}

export const EMAIL_SEQUENCE: EmailEntry[] = [
  // === WELCOME SEQUENCE (5 Emails — Days 0-4) ===
  {
    index: 0,
    sequence: "welcome",
    sendDay: 0,
    subject: "You're paying an invisible tax (and it's killing your growth)",
    preheader: "It doesn't show up on your P&L. But it's the most expensive line item in your business.",
    body: `Hey —

Welcome to The AI Growth Engine.

Before you deploy the agents, run the content pipeline, or plug in the scripts... I need to tell you something that might change how you think about your entire business.

You're paying an invisible tax. Every single day.

It doesn't show up on your P&L. Your accountant can't see it. But it's the most expensive line item in your business.

It's every decision that still runs through you.

Every creative brief you approve. Every funnel tweak you make. Every "quick question" from your team that somehow eats 45 minutes.

See, most operators think they have a time management problem. They don't.

They have an architecture problem.

SOPs transfer steps... not judgment. Hiring transfers tasks... not decision-making. And every new person on the team adds more management overhead to YOUR plate.

Over the next few days, I'm going to show you exactly how to fix this. Not with another tool. Not with another hire. With a completely different architecture.

But first — go log in and watch Module 1. It's 22 minutes and it'll reframe how you think about every system in your business.

To your growth,
Max

P.S. — If you haven't already, bookmark the community. The operators in there are building real things. It's not a Facebook Group.`,
  },
  {
    index: 1,
    sequence: "welcome",
    sendDay: 1,
    subject: "Why I stopped hiring (and started deploying)",
    preheader: "I scaled a construction company from $13M to $60M. Here's what I learned.",
    body: `I scaled a construction company from $13M to $60M.

Hired dozens of people. Built the org chart. Did everything "right."

And I built a machine that couldn't run without me standing in the middle of it.

That's when I learned something that changed everything...

The solution isn't more hires. It's a decision architecture that runs without you.

Think of it like a factory. A factory doesn't scale by hiring more workers to hand-carry parts around. It scales by installing a conveyor system that moves things automatically, makes routing decisions at every junction, and only needs a human when something truly novel happens.

That's what AI agents are.

Not another set of hands. A different architecture entirely.

One person with the right AI architecture can outperform a team of 10 without it.

I know because I'm doing it. Across 4 companies. With 18 AI agents.

Today's action: Watch Module 2 — "The Decision Architecture Framework." This is the mental model that makes everything else click.

To your growth,
Max`,
  },
  {
    index: 2,
    sequence: "welcome",
    sendDay: 2,
    subject: "What my Tuesday morning looks like",
    preheader: "I woke up and my content was already created. Campaigns already optimized.",
    body: `I want to paint a picture for you...

I woke up this morning and my content was already created. Campaigns already optimized. Funnels already tested with new variations.

Not because I stayed up until 2 AM. Because my AI agents ran the system while I slept.

I opened my dashboard and saw the results. I didn't build those campaigns. I didn't write that copy. I didn't analyze those metrics. But the system that did... uses MY judgment, MY voice, MY SOPs.

My CAC is dropping — 20% lower and falling — because the Personalization Engine is matching the right message to the right person automatically.

This isn't some hypothetical future. This is my actual Tuesday.

And here's what I want you to understand...

This future isn't reserved for people with technical backgrounds. Or big teams. Or massive budgets.

It's available to anyone who installs the right architecture.

That's what you're building right now inside The AI Growth Engine.

Today's action: Open the AI Agent Templates library and pick ONE template that maps to your biggest bottleneck. Deploy it this week.

To your growth,
Max`,
  },
  {
    index: 3,
    sequence: "welcome",
    sendDay: 3,
    subject: "I'll name names. They won't.",
    preheader: "When was the last time an AI expert named the actual companies they built for?",
    body: `Quick question...

When was the last time an "AI expert" named the actual companies they built their systems for?

I'll wait.

See, there's a reason most of them say things like "multiple 7-figure businesses" without naming a single one.

So let me be specific.

• Attora — Health & wellness brand. Deployed the Personalization Engine. 20% CAC reduction across every acquisition channel.
• VH Labs — My marketing agency. Multi-agent systems handle creative production, copy generation, media buying analysis, and client reporting. Daily operations, not demos.
• Innosupps — Supplement brand. AI-driven creative testing and automated funnel optimization.
• ASL (Acquisition Systems) — Acquisition infrastructure serving multiple verticals. AI managing lead scoring, audience segmentation, and campaign optimization.

$100M+ in managed client revenue. $150M+ in ad spend. 54+ offer launches. A PE exit that took a $13M company to $60M.

Every system inside The AI Growth Engine comes from these companies.

That's the difference between theory and production.

Today's action: Check out the Funnel Swipe File. Each template is annotated with the company it came from, what worked, what didn't, and why.

To your growth,
Max`,
  },
  {
    index: 4,
    sequence: "welcome",
    sendDay: 4,
    subject: "From construction to 18 AI agents (and why it matters for you)",
    preheader: "I'm not a developer. I didn't study computer science. I started in construction.",
    body: `Let me be honest about something...

I'm not a developer. I didn't study computer science. I started in construction.

I also went to jail. Went through a divorce. Spent over $400K on personal development before any of it clicked.

And that's exactly why this works.

Because I didn't build these systems from some ivory tower. I built them because I was drowning. Because I was the bottleneck in every company I touched. Because I needed a way out that didn't require hiring 50 more people.

If a guy from construction can go from $13M to running 4 companies with 18 AI agents... the only thing standing between you and the same result is architecture.

You're not a struggling freelancer. You're a skilled expert who just needs the right packaging.

The agents are pre-built. The scripts are ready. The community is full of operators deploying right now.

The only question is: are you going to install the system or keep doing it the hard way?

Today's action: Post in the community. Introduce yourself. Tell us your biggest bottleneck. You'll be surprised how fast someone who's already solved it responds.

To your growth,
Max`,
  },

  // === NURTURE SEQUENCE (7 Emails — Days 7-28) ===
  {
    index: 5,
    sequence: "nurture",
    sendDay: 7,
    subject: "I spent $400K learning what I'm about to tell you for free",
    preheader: "90% was theory I never used. The other 10%? That's what built everything.",
    body: `I've spent over $400K on personal and business development.

Courses. Masterminds. Coaching. Conferences. Books. Retreats.

And I'd do it all again... but not for the reasons you'd think.

90% of what I learned was theory I never used. The other 10%? That's what built everything.

The AI Growth Engine is that 10%.

No filler modules. No "mindset" fluff. No 40-hour video library you'll never finish.

Just the pre-built agents, scripts, and pipelines that actually moved the needle — extracted from $100M+ in real results across named companies.

Here's one framework from that 10% that changed everything for me: the Decision Architecture Audit.

The exercise: List every decision you made yesterday. Every approval, every answer to a "quick question," every creative call. Then put each one in two columns: "Requires my judgment" vs. "Could be systematized."

Most operators discover 60-80% of their daily decisions fall in column two.

That's your invisible tax. And that's exactly what we're going to eliminate.

To your growth,
Max`,
  },
  {
    index: 6,
    sequence: "nurture",
    sendDay: 10,
    subject: "20% cheaper customers (the exact system)",
    preheader: "Most operators run the same ads to the same audiences with the same landing pages...",
    body: `Most operators run the same ads to the same audiences with the same landing pages...

And wonder why costs keep climbing.

After spending over $150M on ads across the past 5 years, our team realized something interesting...

The biggest lever isn't better creative. It's matching the right message to the right person at the right awareness level — automatically.

Here's the simplified version of how the Personalization Engine works:

Layer 1 — Traffic Source Awareness Mapping
Different traffic sources produce different awareness levels. Someone coming from a detailed blog post is further along than someone who saw a cold ad. The system tags each visitor and routes them to matching content.

Layer 2 — Dynamic Creative Matching
Instead of one landing page for everyone, the engine assembles page elements based on the visitor's awareness level, traffic source, and engagement history. Same URL, different experience.

Layer 3 — Behavioral Email Branching
Email sequences branch based on actual behavior — what they clicked, how long they stayed, what they downloaded — not just "opened vs. didn't open."

Layer 4 — Compounding Optimization
The system learns. Every interaction improves the matching. CAC drops over time, not just at launch.

This is the full walkthrough available in your membership. Module 4, plus the implementation template in the AI Agent Templates library.

If you haven't started deploying it yet... this is the one system that will pay for itself fastest.

To your growth,
Max`,
  },
  {
    index: 7,
    sequence: "nurture",
    sendDay: 14,
    subject: "How I sold a company for $60M (and why systems beat talent)",
    preheader: "People always ask about the PE exit. Here's the real story.",
    body: `People always ask about the PE exit.

"How did you take a $13M construction company to $60M?"

The short answer: systems.

The long answer...

When I took over, everything ran on tribal knowledge. The foremen knew how things worked. But if one of them left, the whole operation slowed down.

Sound familiar?

I didn't hire better people. I installed better architecture. Decision trees for common scenarios. Routing systems for approvals. Standardized processes that captured judgment, not just steps.

The company went from $13M to $60M in value. And I sold it to private equity.

Then I took those same principles and applied them to digital businesses. And discovered that AI agents are the ultimate architecture tool — because they can actually execute on the decision trees, not just document them.

Every tool inside The AI Growth Engine is built on this philosophy: architecture beats talent. What you HAVE deployed beats what you know. And one person with the right framework can outperform a team of 10 without it.

You're building that framework right now.

To your growth,
Max`,
  },
  {
    index: 8,
    sequence: "nurture",
    sendDay: 17,
    subject: "Your 14 AI subscriptions are making things worse",
    preheader: "Disconnected tools don't build architecture. They build expensive chaos.",
    body: `Let me guess...

You've got Jasper for copy. Notion AI for notes. ChatGPT for everything else. Maybe Midjourney for images. A scheduling tool. An analytics tool. A CRM with "AI features" you've never turned on.

None of them talk to each other.

And you're wondering why AI hasn't transformed your business yet.

Here's the problem... Disconnected tools don't build architecture. They build a more expensive version of chaos.

It's like having 14 workers who each speak a different language and none of them have job descriptions. They might each be talented individually, but together they're creating confusion, not leverage.

The AI Growth Engine approach is different. Instead of 14 tools, you build ONE system. AI agents that share context, follow your SOPs, use your voice, and coordinate with each other.

That's the difference between "using AI" and having an AI architecture.

If you're currently in the Tool Trap, here's your escape route: Open the AI Agent Templates library and look at the "Core Stack" section. It shows you the minimum viable architecture — the 3-4 agents that replace those 14 subscriptions.

Deploy the Core Stack first. Cancel the tools you don't need anymore. Then expand from there.

To your growth,
Max`,
  },
  {
    index: 9,
    sequence: "nurture",
    sendDay: 19,
    subject: "What operators are building this week",
    preheader: "Real wins from real operators deploying AI systems right now.",
    body: `I want to share something from the community...

This week inside the AI Growth Engine deployment network:

• One operator deployed the content generation agent and produced a month of social content in 3 hours. Previously took 2 weeks.
• Another implemented Layer 1 of the Personalization Engine and saw a 12% drop in CPL within the first week.
• A third used the funnel swipe file to launch a new offer in 6 days instead of their usual 3-4 weeks.

These aren't beginners. They're operators running real businesses who installed one system and saw immediate results.

You're in the same room as these people. You have access to the same systems. The only difference is implementation speed.

What's your bottleneck right now? Post it in the community. Someone's probably already solved it.

To your growth,
Max`,
  },
  {
    index: 10,
    sequence: "nurture",
    sendDay: 22,
    subject: "Your competitor is 6 months ahead of you (here's why)",
    preheader: "The gap between operators with AI systems and without is accelerating.",
    body: `I hate writing this email. But you need to hear it.

The gap between operators who have AI systems and operators who don't is not closing. It's accelerating.

Every month, the operator with architecture...
• Launches campaigns 3x faster
• Tests 5x more creative variations
• Runs personalization that compounds over time
• Scales without adding headcount

Every month, the operator without architecture...
• Stays in the same loop
• Fights the same bottlenecks
• Watches costs climb
• Loses market share to people who move faster

Six months from now, one of these operators is you.

The agents are pre-built. The sales scripts are plug-and-play. The content pipeline is templated. Deploy one today.

The question isn't whether this works. It's whether you're going to implement it before your market moves on without you.

What's the ONE system you're going to deploy this week?

To your growth,
Max`,
  },
  {
    index: 11,
    sequence: "nurture",
    sendDay: 25,
    subject: "The 6 things every buyer needs to believe (and why you should care)",
    preheader: "A framework that might change how you think about selling.",
    body: `Quick framework that might change how you think about selling...

Every buyer — including you — needs to believe 6 things before they buy anything:

1. The problem is real and urgent (not just annoying)
2. This type of solution is the right approach (not just any approach)
3. The outcome is achievable and worth it (not just theoretical)
4. The person/company is credible (not just marketing)
5. Someone like ME can do this (not just experts or insiders)
6. This specific product is the best vehicle (not just any product)

When I built The AI Growth Engine, I structured everything around these 6 beliefs. The landing page. The training. The community. Even these emails.

Why am I telling you this?

Because you can use the same framework for YOUR offers.

Inside Module 5, there's a complete walkthrough of Belief Engineering applied to offer creation. Use it for your next launch and watch what happens to your conversion rate.

To your growth,
Max`,
  },

  // === SALES SEQUENCE (3 Emails — Days 30-32) ===
  {
    index: 12,
    sequence: "sales",
    sendDay: 30,
    subject: "30 days in — here's what you should have by now",
    preheader: "Quick check on your progress. And a challenge.",
    body: `You've been inside The AI Growth Engine for 30 days.

Quick check...

Have you deployed at least ONE AI agent from the templates?
Have you deployed the Personalization Engine templates?
Have you used a funnel swipe file for a campaign?
Have you posted in the community and gotten feedback?

If you answered yes to even ONE of these... you've already gotten more than 100x your $19 investment.

If you haven't... why not?

Seriously — I'm asking. Hit reply and tell me what's blocking you. I read every email.

Because here's the thing... the systems work. The templates are proven. The frameworks are battle-tested across $100M+ in revenue.

The only variable is you.

And I'm betting on you. That's why the guarantee is 60 days, not 30. You still have time to deploy, test, and see results — completely risk-free.

But the clock is ticking. Not on my guarantee — on the market. Every week you wait is a week your competitors are getting further ahead.

What's the ONE system you're going to deploy this week?

To your growth,
Max`,
  },
  {
    index: 13,
    sequence: "sales",
    sendDay: 31,
    subject: '"I don\'t have time to implement this"',
    preheader: "You don't have time BECAUSE you don't have the right systems.",
    body: `I hear this one a lot...

"Max, the systems look great. But I'm so busy running my business that I don't have time to implement new systems."

And I get it. I really do.

But let me reframe that for you...

You don't have time to implement new systems BECAUSE you don't have the right systems.

That's the whole point.

You're spending 60-80% of your day on decisions that could be systematized. Approvals. Creative calls. Team questions. Campaign tweaks.

The 3 hours it takes to deploy ONE agent template saves you 10+ hours per week. Every week. Forever.

The ROI isn't measured in months. It's measured in the FIRST WEEK.

Pick the smallest bottleneck. Deploy the matching template. Time yourself before and after.

That's it. That's the whole implementation plan for this week.

You don't need to overhaul everything. You need to install ONE system and feel the difference.

Then do it again next week.

To your growth,
Max`,
  },
  {
    index: 14,
    sequence: "sales",
    sendDay: 32,
    subject: "Operators don't wait. They build.",
    preheader: "This is the last email in this sequence. Let me leave you with this.",
    body: `This is the last email in this sequence.

After this, you'll get the monthly updates, the tool drops, and the community notifications. But the structured onboarding ends here.

So let me leave you with this...

You joined The AI Growth Engine because you're not the type to sit in another guru's audience clapping at screenshots.

You're an operator. You want systems that work, built by someone who's actually built them.

The architecture is here. The templates are proven. The community is full of people just like you — building, deploying, scaling.

The question was never "does this work?" The question is whether you're going to be the operator who installed the system... or the operator who meant to.

I'm betting on you.

Now go deploy something.

To your growth,
Max

P.S. — If you've deployed a system and seen results, I want to hear about it. Reply to this email or post in the community. Your story might be the one that inspires the next operator to take action.`,
  },
];

export function getNextEmail(lastEmailIndex: number): EmailEntry | null {
  const nextIndex = lastEmailIndex + 1;
  if (nextIndex >= EMAIL_SEQUENCE.length) return null;
  return EMAIL_SEQUENCE[nextIndex];
}

export function getEmailByIndex(index: number): EmailEntry | null {
  return EMAIL_SEQUENCE[index] ?? null;
}

export function shouldSendEmail(
  signupDate: Date,
  email: EmailEntry,
  now: Date = new Date()
): boolean {
  const daysSinceSignup = Math.floor(
    (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceSignup >= email.sendDay;
}
