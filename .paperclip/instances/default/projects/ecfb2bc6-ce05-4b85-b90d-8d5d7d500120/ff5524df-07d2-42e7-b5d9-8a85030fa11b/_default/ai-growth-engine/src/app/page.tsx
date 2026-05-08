import Link from "next/link";
import { MetaPixel, GoogleAnalytics } from "@/lib/tracking";

function CTAButton({ className = "", label }: { className?: string; label?: string }) {
  return (
    <Link
      href="/checkout"
      className={`cta-gradient inline-block rounded-lg px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/25 ${className}`}
    >
      {label || "Yes — Give Me Instant Access For $19/mo →"}
    </Link>
  );
}

/* ─────────────────────────────────────────────
   SECTION 1 — HERO
   Pattern: Time-scarcity promise + credibility anchor + engagement hook
   Psychology: Specific time commitment → specific outcome → revenue proof
   ───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="py-16 text-center md:py-24">
      <p className="mb-6 font-mono text-sm uppercase tracking-widest text-amber">
        From the operator who scaled a company from $13M → $60M and sold to PE
      </p>
      <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
        Give Me 7 Days And I&rsquo;ll Give You{" "}
        <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
          An AI Workforce That Runs Your Business While You Sleep
        </span>
      </h1>
      <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-text-secondary md:text-xl">
        The same AI agent systems generating $100M+ in client revenue across
        Lululemon, Stanford, WarriorBabe, Snow Oral Care, and GoHighLevel
        &mdash; pre-built, tested, and ready for you to deploy today.
      </p>

      {/* Video placeholder */}
      <div className="mx-auto mb-10 aspect-video max-w-3xl overflow-hidden rounded-2xl border border-border bg-bg-secondary">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-5xl">▶</div>
            <p className="font-mono text-sm text-text-secondary">
              Watch: How 18 AI Agents Run My 4 Companies (2 min)
            </p>
          </div>
        </div>
      </div>

      <CTAButton className="mb-4" />
      <p className="text-sm text-text-secondary">
        🔒 60-day money-back guarantee &bull; Cancel anytime &bull; No contracts
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 2 — SOCIAL PROOF BAR
   Psychology: Specific numbers + named companies = credibility
   ───────────────────────────────────────────── */
function SocialProofSection() {
  const stats = [
    { number: "$100M+", label: "Client Revenue Generated" },
    { number: "$150M+", label: "Ad Spend Managed" },
    { number: "54+", label: "Offers Launched" },
    { number: "18", label: "AI Agents in Production" },
    { number: "$60M", label: "Company Sold to PE" },
  ];
  const logos = [
    "Lululemon",
    "Stanford",
    "WarriorBabe",
    "Snow Oral Care",
    "GoHighLevel",
    "Attora",
    "Innosupps",
  ];
  return (
    <section className="border-y border-border/50 py-10">
      <div className="mb-6 flex flex-wrap justify-center gap-6 md:gap-10">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-mono text-2xl font-bold text-accent">
              {stat.number}
            </p>
            <p className="text-xs text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="mb-4 text-center text-xs uppercase tracking-widest text-text-secondary">
        Systems built for
      </p>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {logos.map((logo) => (
          <span
            key={logo}
            className="font-mono text-sm text-text-secondary md:text-base"
          >
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 3 — DICHOTOMY
   Psychology: Binary choice architecture — forces reader to self-identify
   Pattern: "Two types of X... which one are you?"
   ───────────────────────────────────────────── */
function DichotomySection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">
          There Are Two Types of Business Owners Right Now
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-bg-secondary p-8">
            <p className="mb-4 text-3xl">⏳</p>
            <p className="text-text-secondary leading-relaxed">
              Those who are <span className="text-text-primary font-semibold">still trying to figure out AI</span>
              &hellip; watching tutorials, testing random tools, hoping it&rsquo;ll
              all &ldquo;click&rdquo; someday.
            </p>
          </div>
          <div className="rounded-xl border border-accent/40 bg-bg-secondary p-8">
            <p className="mb-4 text-3xl">⚡</p>
            <p className="text-text-secondary leading-relaxed">
              And those who realized{" "}
              <span className="text-accent font-semibold">NOW is the moment</span>
              &hellip; and installed AI systems that run their business while
              they focus on what actually matters.
            </p>
          </div>
        </div>
        <p className="mt-8 text-lg text-text-secondary">
          The gap between these two groups is getting wider{" "}
          <span className="text-text-primary font-semibold">every single day.</span>
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 4 — PAIN AGITATION
   Psychology: Escalating emotional pain — surface → quantified → emotional → future → identity
   Pattern: Specific scenarios the reader recognizes, building in intensity
   ───────────────────────────────────────────── */
function PainSection() {
  return (
    <section className="py-16">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        If Any of This Sounds Familiar&hellip; Keep Reading.
      </h2>
      <div className="mx-auto max-w-3xl space-y-5 text-lg text-text-secondary leading-relaxed">
        <p>
          Right now, someone with <span className="text-text-primary font-semibold">half your experience</span>{" "}
          just automated their entire content pipeline and published 30 pieces
          this week. While you were still stuck editing one blog post.
        </p>
        <p>
          You&rsquo;re watching people <span className="text-text-primary font-semibold">way less talented than you</span>{" "}
          scale past $50K/mo&hellip; and they&rsquo;re doing it with smaller teams,
          less overhead, and half the stress. Because they have systems. You have
          a to-do list that never ends.
        </p>
        <p>
          You&rsquo;re <span className="text-text-primary font-semibold">drowning in AI tools</span> you never fully set up.
          Jasper over here. ChatGPT over there. Notion AI somewhere in the middle.
          14 subscriptions. Zero systems. A more expensive version of the same chaos.
        </p>
        <p>
          Every &ldquo;quick question&rdquo; from your team eats 45 minutes.
          Every creative brief runs through you. Every funnel tweak, every
          approval, every decision&hellip;{" "}
          <span className="text-text-primary font-semibold">all you. All day. Every day.</span>
        </p>
        <p>
          And here&rsquo;s the part that really keeps you up at night&hellip;
        </p>
        <p className="text-xl text-text-primary font-bold">
          You know this can&rsquo;t keep going. You know the window is closing.
          You can FEEL it &mdash; the same way you felt it when you missed the
          crypto wave in 2017&hellip; the ecommerce wave in 2020&hellip; the AI
          content wave in 2023&hellip;
        </p>
        <p>
          Every day that passes, someone else &mdash; someone with less
          knowledge, fewer skills, and a fraction of your ambition &mdash; is
          deploying the AI systems{" "}
          <span className="text-text-primary font-semibold">
            you keep telling yourself you&rsquo;ll &ldquo;get to eventually.&rdquo;
          </span>
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 5 — HOPE RESTORATION
   Psychology: After maximum pain → contrarian reframe → urgency through opportunity
   Pattern: "But that struggle ends RIGHT NOW" + "You're not late, you're EARLY"
   ───────────────────────────────────────────── */
function HopeSection() {
  return (
    <section className="py-16 text-center">
      <h2 className="mb-6 text-3xl font-extrabold md:text-4xl">
        But That Changes{" "}
        <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
          Right Now.
        </span>
      </h2>
      <div className="mx-auto max-w-3xl space-y-5 text-lg text-text-secondary leading-relaxed">
        <p>
          Here&rsquo;s what most people don&rsquo;t realize&hellip;
        </p>
        <p className="text-xl text-text-primary font-bold">
          You&rsquo;re not late. You&rsquo;re EARLY.
        </p>
        <p>
          We&rsquo;re in the first 18 months of AI agents running real
          businesses. Not chatbots. Not &ldquo;AI-assisted.&rdquo; Actual
          autonomous agents making decisions, producing work, and driving
          revenue &mdash; 24 hours a day, 7 days a week.
        </p>
        <p>
          <span className="font-mono text-accent">97% of business owners</span>{" "}
          still think AI means &ldquo;asking ChatGPT to write an email.&rdquo;
        </p>
        <p>
          Which means right now &mdash; right this second &mdash; there is a{" "}
          <span className="text-text-primary font-semibold">
            massive advantage waiting
          </span>{" "}
          for the operators who move first. And the window won&rsquo;t stay open
          forever.
        </p>
        <p className="text-text-primary font-semibold">
          But you don&rsquo;t need to figure it out yourself. Because someone
          already did.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 6 — SOLUTION + PROBLEM REDEFINITION
   Psychology: Reframe the problem → relatable metaphor → solution reveal
   Pattern: "The problem isn't X, it's Y" + chef/factory metaphor
   ───────────────────────────────────────────── */
function SolutionSection() {
  return (
    <section className="py-16">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        AI Is the Goldmine.<br />
        The Right Architecture Is the Pickaxe.
      </h2>
      <div className="mx-auto max-w-3xl space-y-5 text-text-secondary leading-relaxed">
        <p>
          See, the problem isn&rsquo;t that you&rsquo;re not smart enough.
          It&rsquo;s not that you need more discipline. Or more hours. Or another
          hire.
        </p>
        <p className="text-lg text-text-primary font-bold">
          You don&rsquo;t have a time problem. You have an ARCHITECTURE problem.
        </p>
        <p>
          Think about it like this&hellip;
        </p>
        <p>
          Having 14 AI subscriptions without a system is like having the key to
          the world&rsquo;s biggest library&hellip; but not knowing which books
          to read. You end up wandering the aisles, picking things up, putting
          them down, and walking out with nothing.
        </p>
        <p>
          Or worse &mdash; it&rsquo;s like asking a master chef to{" "}
          <span className="text-text-primary font-semibold">
            &ldquo;make me food.&rdquo;
          </span>{" "}
          You&rsquo;ll get a peanut butter sandwich instead of a five-star meal.
          Not because the chef can&rsquo;t cook. Because you gave the wrong
          instructions.
        </p>
        <p className="text-lg text-text-primary font-bold">
          AI without architecture is just expensive chaos. AI WITH architecture
          is a workforce that never sleeps, never quits, and scales infinitely.
        </p>
        <p>
          I know because I built it. I spent 8 years and $30M+ learning the hard
          way that more people ≠ more growth. Then I installed 18 AI agents
          across 4 companies &mdash; Attora, VH Labs, ASL, and Genius &mdash;
          and they produce more output than most 30-person teams.
        </p>
        <p>
          Today I&rsquo;m handing you the exact same architecture.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 7 — 4-STEP SYSTEM
   Psychology: Simple framework makes the complex feel achievable
   Pattern: Numbered steps → "this isn't complicated, it's systematic"
   ───────────────────────────────────────────── */
function SystemSection() {
  const steps = [
    {
      number: "01",
      title: "Audit Your Bottlenecks",
      time: "Day 1",
      description:
        "We map every decision that currently runs through you. Every approval, every creative call, every \"quick question\" that eats your day. Most operators discover 60-80% of their daily decisions can be automated. You'll know exactly where to start.",
    },
    {
      number: "02",
      title: "Deploy Your First Agents",
      time: "Day 2-3",
      description:
        "Not from scratch. Pre-built. The same agents running inside my companies right now — content generation, lead scoring, customer service, funnel optimization. You don't build them. You copy, paste, and run.",
    },
    {
      number: "03",
      title: "Activate the Growth Engine",
      time: "Day 4-5",
      description:
        "With your operational bottleneck removed, plug in the growth systems: the personalization engine that cuts CAC by 20%, the content pipeline that produces at 10x speed, the sales scripts tested across $100M+ in revenue.",
    },
    {
      number: "04",
      title: "Scale Without Being the Bottleneck",
      time: "Day 6-7",
      description:
        "The system runs. You optimize. Your agents handle content, marketing, operations, and customer service — while you focus on the high-leverage decisions that actually require a human brain. This is the part where it gets fun.",
    },
  ];
  return (
    <section className="py-16">
      <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
        Here&rsquo;s Exactly How It Works
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-center text-text-secondary">
        This isn&rsquo;t complicated. It&rsquo;s systematic. And every step
        comes with the exact templates, agents, and playbooks my team uses daily.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-xl border border-border bg-bg-secondary p-6"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-3xl font-bold text-accent/40">
                {step.number}
              </span>
              <span className="font-mono text-xs text-amber">{step.time}</span>
            </div>
            <h4 className="mb-3 text-xl font-bold text-text-primary">
              {step.title}
            </h4>
            <p className="text-text-secondary leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 8 — VALUE STACK
   Psychology: Heavy anchoring + "what you GET, not what you learn"
   Pattern: Individual items with dollar values → massive total → tiny actual price
   ───────────────────────────────────────────── */
function ValueStackSection() {
  const items = [
    {
      title: "Pre-Built AI Agent Templates",
      value: "$3,997",
      tag: "COPY → PASTE → RUN",
      description:
        "Not training on how to build agents. The actual agents — pre-built, tested, running in production right now. Content generation, lead scoring, customer service, funnel optimization. 15,000+ tasks completed across real businesses. You deploy them today.",
    },
    {
      title: "Personalized AI Business Audit",
      value: "$4,997",
      tag: "DONE FOR YOU",
      description:
        "We analyze YOUR specific business and tell you exactly which agents to deploy first, which bottlenecks to eliminate, and in what order. Not a framework you guess your way through — a custom deployment roadmap built for your situation.",
    },
    {
      title: "The Content Pipeline System",
      value: "$2,997",
      tag: "ALREADY RUNNING ACROSS 4 BRANDS",
      description:
        "The exact system publishing content daily across my businesses — templated for yours. AI captures your ideas, writes in your voice, publishes on schedule. You talk for 10 minutes. The system produces 30 pieces of content. Already running in production.",
    },
    {
      title: "Pre-Written Sales Scripts + AI Sales Agents",
      value: "$3,497",
      tag: "TESTED ACROSS $100M+ IN REVENUE",
      description:
        "AI agents that handle lead qualification, appointment booking, and follow-up sequences. Pre-written scripts that have generated over $100M in client revenue across named brands. Plug them into GoHighLevel or your CRM. They start closing today.",
    },
    {
      title: "Monthly Live Deployment Call + Weekly Q&A",
      value: "$4,997",
      tag: "LIVE SCREEN-SHARE — NOT A WEBINAR",
      description:
        "I share my screen and deploy agents IN REAL TIME. You watch. You replicate. You deploy. Between calls, drop questions and get async responses from me and my team weekly via Loom. This is a workshop, not a lecture.",
    },
    {
      title: "Private Operators Community",
      value: "$1,997",
      tag: "OPERATORS ONLY — NO BEGINNERS",
      description:
        "Not a Facebook Group full of people asking \"what's an API?\" A deployment support network of operators actively building AI systems. Share configs, troubleshoot deployments, swap templates. Real operators, real problems, real solutions.",
    },
  ];
  return (
    <section className="py-16">
      <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
        Here&rsquo;s Everything You GET When You Join Today
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-center text-text-secondary">
        Every single item answers one question:{" "}
        <span className="text-text-primary font-semibold">
          &ldquo;What do I HAVE after buying?&rdquo;
        </span>{" "}
        Not what you know. What you own. What&rsquo;s deployed. What&rsquo;s
        making you money.
      </p>
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-bg-secondary p-6"
          >
            <div className="mb-1 flex items-start justify-between gap-4">
              <h4 className="text-lg font-bold text-text-primary">
                {item.title}
              </h4>
              <span className="shrink-0 font-mono text-sm text-amber">
                Value: {item.value}
              </span>
            </div>
            <p className="mb-2 font-mono text-xs text-emerald">{item.tag}</p>
            <p className="text-text-secondary leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Price reveal */}
      <div className="mx-auto mt-12 max-w-lg rounded-2xl border-2 border-accent bg-bg-secondary p-8 text-center">
        <p className="mb-1 font-mono text-sm text-text-secondary">
          Total Real-World Value:
        </p>
        <p className="mb-2 font-mono text-2xl text-amber line-through">
          $22,482
        </p>
        <p className="mb-1 font-mono text-sm text-text-secondary">
          What others charge for less:
        </p>
        <p className="mb-4 font-mono text-lg text-text-secondary line-through">
          $97/mo
        </p>
        <p className="mb-2 font-mono text-sm text-emerald">
          Your price today:
        </p>
        <p className="mb-6 text-5xl font-extrabold">
          <span className="font-mono text-emerald">$19/mo</span>
        </p>
        <p className="mb-6 text-sm text-text-secondary">
          That&rsquo;s{" "}
          <span className="text-text-primary font-semibold">$0.63/day</span>{" "}
          for the same AI systems generating $100M+ in client revenue.
        </p>
        <CTAButton className="w-full" />
        <p className="mt-4 text-sm text-text-secondary">
          🔒 60-day money-back guarantee &bull; Cancel anytime &bull; One click
        </p>
      </div>

      {/* Why this price */}
      <div className="mx-auto mt-10 max-w-3xl">
        <h3 className="mb-4 text-center text-xl font-bold">
          &ldquo;Why Would You Practically Give This Away?&rdquo;
        </h3>
        <div className="space-y-3 text-text-secondary leading-relaxed">
          <p>Fair question. Here&rsquo;s the honest answer&hellip;</p>
          <p>
            I make my real money when you succeed and need our done-for-you
            service through Attora. This $19/mo is the front door &mdash;
            I&rsquo;m betting you&rsquo;ll be so impressed by the agents that
            you&rsquo;ll want us to build the full system for you.
          </p>
          <p className="text-text-primary font-semibold">
            Aligned incentives. I literally make more money when you win.
          </p>
          <p>
            That&rsquo;s why I can practically give this away. Your success at
            $19/mo is my best sales pitch for the $25K engagement. I don&rsquo;t
            need to convince you. I need the AI to convince you &mdash; by
            actually working.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 9 — FUTURE PACING
   Psychology: Sensory-rich visualization of life after purchase
   Pattern: "Picture this 30 days from now..." with specific detail
   ───────────────────────────────────────────── */
function FuturePacingSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-accent/20 bg-bg-secondary p-8 md:p-12">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
          Picture Your Life 30 Days From Now&hellip;
        </h2>
        <div className="space-y-5 text-lg text-text-secondary leading-relaxed">
          <p>
            You wake up. Before your feet hit the floor, you grab your phone
            &mdash; not out of anxiety this time, but curiosity.
          </p>
          <p>
            Your AI content agent published 4 pieces while you slept. Your lead
            scoring agent qualified 12 new prospects and booked 3 calls. Your
            customer service agent handled 8 support tickets &mdash; and the
            satisfaction score went UP.
          </p>
          <p className="text-text-primary font-semibold">
            You didn&rsquo;t touch any of it.
          </p>
          <p>
            You sit down with your coffee. For the first time in months, your
            morning isn&rsquo;t a scramble through Slack messages and urgent
            emails. Because the systems are handling the 80% that used to eat
            your day.
          </p>
          <p>
            Your revenue is up &mdash; not because you&rsquo;re working more,
            but because you finally have the bandwidth to focus on the deals,
            the strategy, the relationships that actually move the needle.
          </p>
          <p>
            You pick up your daughter from school at 3pm. Not because you
            &ldquo;snuck away&rdquo; &mdash; because there&rsquo;s nothing
            urgent. The machine is running.
          </p>
          <p className="text-xl text-text-primary font-bold text-center">
            That&rsquo;s not a fantasy. That&rsquo;s Tuesday for me. And in 30
            days, it can be Tuesday for you too.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 10 — GUARANTEE + RISK REVERSAL
   Psychology: Remove every possible objection to buying
   Pattern: Dual guarantee + "the real risk is NOT joining"
   ───────────────────────────────────────────── */
function GuaranteeSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-amber/30 bg-bg-secondary p-8 text-center md:p-12">
        <div className="mb-4 text-4xl">🛡️</div>
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">
          The &ldquo;Operator&rsquo;s Promise&rdquo; &mdash; 60-Day Double
          Guarantee
        </h2>
        <div className="space-y-4 text-left text-text-secondary leading-relaxed">
          <p className="text-text-primary font-semibold text-center">
            Guarantee #1: Full Money Back
          </p>
          <p>
            Try everything inside The AI Growth Engine for a full 60 days.
            Deploy the agents. Use the templates. Run the content pipeline.
            Plug in the sales scripts.
          </p>
          <p>
            If you don&rsquo;t find at least ONE system worth{" "}
            <span className="text-text-primary font-semibold">
              100x what you paid
            </span>
            , email me and I&rsquo;ll refund every penny. No questions. No
            hoops. No &ldquo;exit survey.&rdquo; No guilt.
          </p>
          <p className="text-text-primary font-semibold text-center">
            Guarantee #2: ROI Commitment
          </p>
          <p>
            If you implement the Personalization Engine and don&rsquo;t see
            measurable improvement in your customer acquisition costs within
            60 days, I&rsquo;ll personally hop on a call with you to diagnose
            why &mdash; and you still get your full refund if you want it.
          </p>
          <p className="text-xl text-text-primary text-center font-bold mt-6">
            You literally cannot lose money here. The only risk is spending
            another 6 months watching your competitors install the systems you
            keep putting off.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 11 — FAQ
   Psychology: Objection handling disguised as helpfulness
   Pattern: Address every "but what if..." before it becomes a reason not to buy
   ───────────────────────────────────────────── */
function FAQSection() {
  const faqs = [
    {
      q: "I'm not technical. Can I actually use this?",
      a: "I started in construction. I'm not a developer. Every template comes with implementation instructions written for operators, not engineers. If you can follow a Loom video and copy-paste, you can deploy these systems. The AI handles the complexity — that's the entire point.",
    },
    {
      q: "What if I've bought courses before and never finished them?",
      a: "This isn't a course. There's nothing to \"finish.\" You get pre-built AI agents, a content pipeline, and sales scripts. You deploy them — copy, paste, run. The AI audit tells you which one to deploy first. Most members have their first agent running within 48 hours. You don't learn how to build it. You GET it built.",
    },
    {
      q: "How is this different from every other AI \"guru\" community?",
      a: "Ask them to name one company where their systems are running in production. I'll wait. The AI Growth Engine runs inside Attora, VH Labs, Innosupps, ASL, and Genius — companies you can Google, verify, and confirm. I'm not teaching theory. I'm handing you what's working right now.",
    },
    {
      q: "What's the catch at $19/mo?",
      a: "No catch. I make my real money when you succeed and hire Attora for done-for-you implementation. This $19 is the front door — and the 60-day guarantee means you risk literally nothing. If the agents don't blow your mind, you get every penny back.",
    },
    {
      q: "How much time does this take?",
      a: "The monthly live call is 60-90 minutes. Weekly Q&A is on your schedule. Template deployment varies — some take 30 minutes, some take a few hours. But the whole point is to give you MORE time, not less. Most operators save 10-20 hours per week within the first month.",
    },
    {
      q: "I'm just getting started — is this too advanced for me?",
      a: "Even better. You'll install the right architecture from day one instead of having to tear it all down and rebuild later (which is what I had to do after scaling to $60M the wrong way). The earlier you install these systems, the faster everything else compounds.",
    },
    {
      q: "Can I cancel anytime?",
      a: "One click. No contracts. No cancellation fees. No \"retention specialist\" calls. No guilt trips. I'd rather have 100 committed operators than 1,000 people who forgot to cancel.",
    },
  ];
  return (
    <section className="py-16">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        Still Have Questions? I Get It.
      </h2>
      <div className="mx-auto max-w-3xl">
        {faqs.map((faq) => (
          <div key={faq.q} className="border-b border-border py-6">
            <h4 className="mb-2 text-lg font-bold text-text-primary">
              {faq.q}
            </h4>
            <p className="text-text-secondary leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 12 — FINAL CTA + URGENCY
   Psychology: Identity-level close + price anchoring + urgency
   Pattern: "You've read this far = you already know" + full price stack + action
   ───────────────────────────────────────────── */
function FinalCTASection() {
  return (
    <section className="py-16 text-center">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">
        You&rsquo;ve Read This Far.{" "}
        <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
          You Already Know.
        </span>
      </h2>
      <div className="mx-auto mb-8 max-w-2xl space-y-4 text-lg text-text-secondary">
        <p>
          You&rsquo;re not the type to sit in another guru&rsquo;s audience
          clapping at screenshots.
        </p>
        <p>
          You&rsquo;re an operator. You want systems that work, built by
          someone who&rsquo;s actually running them. Not theory. Not
          motivation. Infrastructure.
        </p>
        <p className="text-text-primary font-semibold">
          Six months from now, you&rsquo;re either still doing everything
          manually&hellip; or you&rsquo;ve got 18 AI agents doing it for you.
        </p>
        <p>
          The system is here. The guarantee removes the risk. And at $19/mo,
          the price isn&rsquo;t even a real objection &mdash; you spend more
          than that on coffee.
        </p>
      </div>

      <div className="mx-auto mb-8 max-w-md">
        <p className="mb-1 font-mono text-sm text-text-secondary line-through">
          $22,482 in total value
        </p>
        <p className="mb-1 font-mono text-sm text-text-secondary line-through">
          $97/mo (what others charge)
        </p>
        <p className="mb-6 text-4xl font-extrabold">
          <span className="font-mono text-emerald">$19/mo</span>{" "}
          <span className="text-base font-normal text-text-secondary">
            &mdash; Instant access. Cancel anytime.
          </span>
        </p>
      </div>

      <CTAButton className="mb-4" label="Join The AI Growth Engine — $19/mo →" />
      <p className="mb-10 text-sm text-text-secondary">
        🔒 60-day money-back guarantee &bull; No contracts &bull; No upsell
        tricks on this page
      </p>
      <p className="text-sm text-text-secondary">
        Questions? Email max@maxwellmayes.com &mdash; I read every message.
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE — 12-Section Conversion Flow
   Pain Agitation → Hope Restoration → Problem Redefinition →
   Solution Reveal → Social Proof → Value Stack → Future Pacing →
   Risk Reversal → Urgency CTA
   ───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <MetaPixel />
      <GoogleAnalytics />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <HeroSection />
        <SocialProofSection />
        <DichotomySection />
        <PainSection />
        <HopeSection />
        <SolutionSection />
        <SystemSection />
        <ValueStackSection />
        <FuturePacingSection />
        <GuaranteeSection />
        <FAQSection />
        <FinalCTASection />
      </main>
    </>
  );
}
