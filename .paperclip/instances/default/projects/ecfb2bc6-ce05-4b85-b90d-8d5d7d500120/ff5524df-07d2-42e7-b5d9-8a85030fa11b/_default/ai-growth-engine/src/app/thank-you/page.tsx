import { redirect } from "next/navigation";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(session_id);
  } catch {
    redirect("/");
  }

  if (session.payment_status !== "paid") {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mb-6 text-5xl">🎉</div>
      <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
        You&rsquo;re In. Welcome to The AI Growth Engine.
      </h1>
      <p className="mb-8 text-lg text-text-secondary">
        Your access is being activated right now. Here&rsquo;s what happens
        next:
      </p>

      <div className="mb-10 space-y-4 text-left">
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 font-mono text-sm font-bold text-accent">
              1
            </span>
            <div>
              <h3 className="font-bold">Check Your Email</h3>
              <p className="text-sm text-text-secondary">
                You&rsquo;ll receive your login credentials and community
                access link within the next 5 minutes.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 font-mono text-sm font-bold text-accent">
              2
            </span>
            <div>
              <h3 className="font-bold">Start with the AI Growth Playbook</h3>
              <p className="text-sm text-text-secondary">
                Module 1 takes about 45 minutes and gives you the foundation
                for everything else. Start here.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 font-mono text-sm font-bold text-accent">
              3
            </span>
            <div>
              <h3 className="font-bold">Introduce Yourself in the Community</h3>
              <p className="text-sm text-text-secondary">
                Tell us what you&rsquo;re building. The operators in this
                community are your new network &mdash; use them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upsell teaser */}
      <div className="rounded-2xl border border-accent/30 bg-bg-secondary p-8">
        <p className="mb-2 font-mono text-sm text-accent">
          EXCLUSIVE OFFER FOR NEW MEMBERS
        </p>
        <h2 className="mb-3 text-2xl font-bold">
          Want to Go Deeper? Join the Inner Circle.
        </h2>
        <p className="mb-6 text-text-secondary">
          Get direct access to Max and the VH Labs team. Weekly strategy
          calls, private Slack channel, and done-with-you implementation
          support.
        </p>
        <Link
          href="/upsell"
          className="cta-gradient inline-block rounded-lg px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
        >
          See the Inner Circle &mdash; $97/mo
        </Link>
      </div>

      <p className="mt-8 text-sm text-text-secondary">
        Questions? Email max@maxwellmayes.com
      </p>
    </main>
  );
}
