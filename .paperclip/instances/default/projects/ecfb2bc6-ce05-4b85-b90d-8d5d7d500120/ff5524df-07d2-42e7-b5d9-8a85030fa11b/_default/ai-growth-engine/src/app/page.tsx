import Link from "next/link";
import { MetaPixel, GoogleAnalytics } from "@/lib/tracking";

function CTAButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/checkout"
      className={`cta-gradient inline-block rounded-lg px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/25 ${className}`}
    >
      Get Instant Access &mdash; $19/mo
    </Link>
  );
}

function SocialProofBar() {
  const stats = [
    "$100M+ client revenue",
    "54+ offers launched",
    "$150M+ ad spend managed",
    "PE exit: $13M → $60M",
  ];
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {stats.map((stat) => (
        <span
          key={stat}
          className="font-mono text-sm text-text-secondary md:text-base"
        >
          {stat}
        </span>
      ))}
    </div>
  );
}

function PainCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h4 className="mb-3 text-lg font-bold text-text-primary">{title}</h4>
      <p className="text-text-secondary leading-relaxed">{body}</p>
    </div>
  );
}

function ProofCard({
  company,
  description,
}: {
  company: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h4 className="mb-2 text-lg font-bold text-accent">{company}</h4>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

function ValueItem({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h4 className="text-lg font-bold text-text-primary">{title}</h4>
        <span className="shrink-0 font-mono text-sm text-amber">
          Value: {value}
        </span>
      </div>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    {
      label: "Proof",
      them: '"Multiple 7-figure businesses" (unnamed)',
      us: "Attora, VH Labs, ASL, Innosupps, Genius (named, verifiable)",
    },
    {
      label: "AI credibility",
      them: "Learned prompt engineering last year",
      us: "Running multi-agent systems in production",
    },
    {
      label: "Exit proof",
      them: "None",
      us: "Sold company to PE ($13M → $60M)",
    },
    {
      label: "Ad spend",
      them: '"I\'ve spent a lot on ads"',
      us: "$150M+ managed, verifiable",
    },
    {
      label: "Guarantee",
      them: "30 days (if any)",
      us: "60 days, no questions",
    },
    {
      label: "What you get",
      them: "Generic training + community",
      us: "Real systems pulled from named companies",
    },
    {
      label: "Tone",
      them: "Guru teaching students",
      us: "Operator briefing peers",
    },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-sm font-semibold text-text-secondary" />
            <th className="px-4 py-3 text-sm font-semibold text-text-secondary">
              Typical AI &ldquo;Expert&rdquo;
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-accent">
              The AI Growth Engine
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/50">
              <td className="px-4 py-3 font-semibold text-text-primary">
                {row.label}
              </td>
              <td className="px-4 py-3 text-text-secondary">{row.them}</td>
              <td className="px-4 py-3 text-text-primary">{row.us}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-border py-6">
      <h4 className="mb-2 text-lg font-bold text-text-primary">{q}</h4>
      <p className="text-text-secondary leading-relaxed">{a}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <MetaPixel />
      <GoogleAnalytics />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* HERO */}
        <section className="py-16 text-center md:py-24">
          <p className="mb-6 font-mono text-sm text-amber">
            $150M+ in ad spend. 54+ offer launches. 1 PE exit.
          </p>
          <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            The Exact AI Systems I Use to Run Multiple 7-Figure Businesses
            &mdash;{" "}
            <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
              Now Yours for $19/mo
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-text-secondary md:text-xl">
            I&rsquo;ve generated $100M+ in client revenue across Attora, VH
            Labs, Innosupps, ASL, and Genius. I scaled a construction company
            from $13M to $60M and sold it to private equity. Now I&rsquo;m
            opening the vault on every AI system, template, and playbook my
            team runs daily &mdash; so you can install proven growth
            infrastructure instead of chasing the next shiny tool.
          </p>
          <CTAButton className="mb-4" />
          <p className="mb-10 text-sm text-text-secondary">
            60-day money-back guarantee. Cancel anytime. No contracts.
          </p>
          <SocialProofBar />
        </section>

        {/* PROBLEM */}
        <section className="py-16">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
            You Know AI Matters. You Just Can&rsquo;t Execute.
          </h2>
          <p className="mx-auto mb-10 max-w-3xl text-center text-text-secondary">
            You&rsquo;re doing $10K-50K/mo. You&rsquo;re good at what you
            do. But every week there&rsquo;s a new AI tool, a new workflow, a
            new &ldquo;game-changing&rdquo; automation &mdash; and you&rsquo;re
            stuck in the same loop:
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <PainCard
              title="The Tool Trap"
              body="You've signed up for 14 AI tools this year. You've mastered zero. Each one promised to &quot;transform your business&quot; and each one sits unused after the free trial. The problem isn't the tools — it's that nobody's showing you how they fit into an actual growth system."
            />
            <PainCard
              title="The Guru Mirage"
              body="Every &quot;AI expert&quot; in your feed launched their course 6 months ago. Their proof? Screenshots of ChatGPT outputs and a rented Lambo. You need guidance from someone who's actually running AI systems inside real companies — not someone who learned prompt engineering last quarter."
            />
            <PainCard
              title="The Execution Gap"
              body="You know what you should be doing. You've watched the YouTube videos. You've saved the Twitter threads. But between client work, team management, and actually running your business — when exactly are you supposed to build an AI infrastructure from scratch?"
            />
          </div>
        </section>

        {/* BRIDGE */}
        <section className="py-16">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            What If You Could Just Install What Already Works?
          </h2>
          <div className="mx-auto max-w-3xl space-y-4 text-text-secondary leading-relaxed">
            <p>
              I didn&rsquo;t learn AI from a course. I learned it by deploying
              systems across real companies with real revenue at stake.
            </p>
            <p>
              My team runs AI agents that manage entire marketing operations. We
              built a personalization engine that cut customer acquisition costs
              by 20% &mdash; across multiple brands simultaneously. We use AI
              to launch offers, write copy, analyze calls, and manage creative
              production.
            </p>
            <p>
              These aren&rsquo;t experiments. They&rsquo;re production systems
              running right now inside companies you can Google.
            </p>
            <p className="text-text-primary font-semibold">
              The systems that took us years and millions to build can be
              templated, simplified, and handed to any operator willing to
              implement them. That&rsquo;s what The AI Growth Engine is.
            </p>
          </div>
        </section>

        {/* PROOF */}
        <section className="py-16">
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
            I Don&rsquo;t Talk Theory. I Show Receipts.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <ProofCard
              company="Attora"
              description="Built the AI-powered growth infrastructure for a health & wellness brand. Deployed personalization systems that reduced CAC across every acquisition channel."
            />
            <ProofCard
              company="VH Labs"
              description="My marketing agency runs on AI. Multi-agent systems handle creative production, copy generation, media buying analysis, and client reporting. Not as demos — as daily operations."
            />
            <ProofCard
              company="Innosupps"
              description="Scaled supplement brand using AI-driven creative testing and automated funnel optimization. Named brand, verifiable results."
            />
            <ProofCard
              company="ASL (Acquisition Systems)"
              description="Built acquisition infrastructure serving multiple verticals. AI systems manage lead scoring, audience segmentation, and campaign optimization at scale."
            />
            <ProofCard
              company="Construction PE Exit"
              description="Took a $13M construction company, installed operational systems, scaled to $60M, and sold to private equity. Proof that systems thinking works in any industry."
            />
          </div>
        </section>

        {/* PERSONALIZATION ENGINE */}
        <section className="py-16">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">
            The System That Cuts Your Customer Acquisition Cost by 20%
          </h2>
          <div className="mx-auto mb-8 max-w-fit rounded-lg border border-border bg-bg-secondary px-6 py-3 text-center">
            <p className="font-mono text-sm text-amber">
              20% CAC reduction. Deployed across multiple brands. Running in
              production right now.
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 text-text-secondary leading-relaxed">
            <p>
              Most operators run the same ads to the same audiences with the
              same landing pages and wonder why costs keep climbing.
            </p>
            <p>
              The Personalization Engine changes every touchpoint based on
              who&rsquo;s actually looking. Different creative for different
              awareness levels. Different landing page elements for different
              traffic sources. Different email sequences based on engagement
              behavior.
            </p>
            <p>
              This isn&rsquo;t &ldquo;personalize your subject line with
              &#123;first_name&#125;.&rdquo; This is infrastructure-level
              personalization that compounds over time.
            </p>
            <p className="text-text-primary font-semibold">
              This is the kind of system that separates operators from everyone
              else. And you won&rsquo;t find it in any $17/mo guru community
              &mdash; because nobody else is running one.
            </p>
          </div>
        </section>

        {/* VALUE STACK */}
        <section className="py-16">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
            Everything Inside The AI Growth Engine
          </h2>
          <div className="grid gap-4">
            <ValueItem
              title="AI Growth Playbook (Video Training)"
              value="$2,997"
              description="6-module deep dive: offer creation, funnel architecture, AI integration, ad creative systems, backend automation, and scaling frameworks. Not theory — these are the exact processes my team follows."
            />
            <ValueItem
              title="Monthly Live Call with Max + Weekly Async Q&A"
              value="$4,997"
              description="Once a month, get on a live call with me. Bring your specific situation. Between calls, drop questions in the community and get async responses from me and my team weekly via Loom and written replies."
            />
            <ValueItem
              title="AI Agent Templates"
              value="$3,997"
              description="Pre-built automation templates pulled directly from my companies. Content generation, lead scoring, funnel optimization, creative testing — ready to deploy, not ready to demo."
            />
            <ValueItem
              title="Funnel Swipe File"
              value="$1,997"
              description="10+ high-converting funnel templates from campaigns that have generated millions in revenue. Annotated with what worked, what didn't, and why."
            />
            <ValueItem
              title="Ad Creative Library"
              value="$2,497"
              description="Winning ad templates and scripts from $150M+ in managed ad spend. Hooks, angles, formats — tested across multiple verticals and brands."
            />
            <ValueItem
              title="Private Operator Community"
              value="$1,997"
              description={`This is not a "Facebook Group." It's a curated community of operators who are actually building. No gurus. No "what niche should I pick" questions. Real operators, real problems, real solutions.`}
            />
            <ValueItem
              title="Monthly AI Tool Drop"
              value="$2,497"
              description="Every month, my team releases a new AI tool, workflow, or automation that we've tested internally. You get it before anyone else, with implementation instructions."
            />
            <ValueItem
              title="Personalization Engine Walkthrough"
              value="$1,497"
              description="The complete breakdown of how we built the system that cuts CAC by 20%. Architecture, implementation steps, measurement framework. This alone is worth more than a year of membership."
            />
          </div>

          <div className="mt-12 text-center">
            <p className="mb-2 font-mono text-2xl text-amber line-through">
              Total Value: $22,476
            </p>
            <p className="mb-6 text-4xl font-extrabold md:text-5xl">
              Your investment:{" "}
              <span className="font-mono text-emerald">$19/mo</span>
            </p>
            <p className="mb-6 text-text-secondary">
              That&rsquo;s less than a Netflix subscription. Less than two
              coffees a week. Less than the monthly fee on any single AI tool
              you&rsquo;re probably not using anyway.
            </p>
            <CTAButton />
          </div>
        </section>

        {/* COMPARISON */}
        <section className="py-16">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
            This Isn&rsquo;t Another Guru Community
          </h2>
          <ComparisonTable />
        </section>

        {/* GUARANTEE */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-amber/30 bg-bg-secondary p-8 text-center md:p-12">
            <div className="mb-4 text-4xl">🛡️</div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              60-Day Money-Back Guarantee
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Try everything inside The AI Growth Engine for a full 60 days.
                Go through the training. Join the calls. Use the templates.
                Deploy the systems.
              </p>
              <p>
                If you don&rsquo;t find at least ONE thing worth 100x what you
                paid, email me and I&rsquo;ll refund every penny. No questions.
                No hoops. No &ldquo;exit survey.&rdquo;
              </p>
              <p className="text-text-primary font-semibold">
                The risk isn&rsquo;t joining. The risk is spending another 6
                months watching your competitors install the systems you keep
                putting off.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 text-center">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            You&rsquo;ve Read This Far. You Already Know.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-text-secondary">
            You&rsquo;re not the type to sit in another guru&rsquo;s audience
            clapping at screenshots. You&rsquo;re an operator. You want
            systems that work, built by someone who&rsquo;s actually built
            them.
          </p>
          <p className="mb-2 font-mono text-lg text-text-secondary line-through">
            $22,476 in total value
          </p>
          <p className="mb-2 font-mono text-lg text-text-secondary line-through">
            $97/mo (what this should cost)
          </p>
          <p className="mb-6 text-4xl font-extrabold">
            <span className="font-mono text-emerald">$19/mo</span>{" "}
            <span className="text-xl font-normal text-text-secondary">
              &mdash; Instant access. Cancel anytime.
            </span>
          </p>
          <CTAButton className="mb-4" />
          <p className="mb-10 text-sm text-text-secondary">
            60-day money-back guarantee. No contracts. No upsell tricks on
            this page.
          </p>
          <p className="text-sm text-text-secondary">
            Questions? Email max@maxwellmayes.com. I read every message.
          </p>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-3xl">
            <FAQItem
              q="Is this just another community?"
              a="No. Communities are a feature, not the product. The core value is the AI systems, templates, and playbooks pulled from real companies. The community is where operators help each other implement."
            />
            <FAQItem
              q="What if I'm not technical?"
              a="You don't need to be. Every template comes with implementation instructions written for operators, not developers. If you can use a spreadsheet, you can deploy these systems."
            />
            <FAQItem
              q='How is this different from other AI "experts"?'
              a="Name one company they built these systems for. I'll wait. The AI Growth Engine is built on systems running inside Attora, VH Labs, Innosupps, ASL, and Genius — companies you can verify. That's the difference between theory and production."
            />
            <FAQItem
              q="What's the catch at $19/mo?"
              a="No catch. This is the front door to my ecosystem. If the systems work for you (they will), some members choose to go deeper with advanced programs or agency services. But $19/mo gets you everything listed on this page, and the 60-day guarantee means you risk nothing."
            />
            <FAQItem
              q="Can I cancel anytime?"
              a='Yes. No contracts. No cancellation fees. No "retention specialist" calls. One click and you&apos;re out. I&apos;d rather have 100 committed operators than 1,000 people who forgot to cancel.'
            />
            <FAQItem
              q="How much time does this take?"
              a="The monthly live call is 60-90 minutes. Weekly async Q&A is on your schedule. Template deployment varies — some take 30 minutes, some take a few hours. You move at your own pace."
            />
          </div>
        </section>
      </main>
    </>
  );
}
