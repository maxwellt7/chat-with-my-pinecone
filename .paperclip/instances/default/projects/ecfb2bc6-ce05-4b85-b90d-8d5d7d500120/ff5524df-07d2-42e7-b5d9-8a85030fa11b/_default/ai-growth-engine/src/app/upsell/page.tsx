"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/tracking";

export default function UpsellPage() {
  const [loading, setLoading] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpsell(trial: boolean) {
    setLoading(true);
    setError(null);
    trackEvent("InitiateCheckout", {
      value: trial ? 47 : 97,
      currency: "USD",
      content_name: trial ? "Inner Circle Trial" : "Inner Circle",
    });

    try {
      const res = await fetch("/api/upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trial }),
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        setError("Unable to create checkout session. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="mb-4 font-mono text-sm text-accent">
          ONE-TIME OFFER FOR NEW MEMBERS
        </p>
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
          The Inner Circle: Direct Access to Max &amp; The VH Labs Team
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary">
          The AI Growth Engine gives you the systems. The Inner Circle gives
          you the team that built them &mdash; working alongside you to
          implement, optimize, and scale.
        </p>
      </div>

      <div className="mb-10 grid gap-4">
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 className="mb-2 font-bold">Weekly Strategy Calls</h3>
          <p className="text-text-secondary">
            Not Q&amp;A calls. Strategy sessions where we review your
            systems, identify bottlenecks, and plan next moves together.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 className="mb-2 font-bold">Private Slack Channel</h3>
          <p className="text-text-secondary">
            Direct messaging with Max and the VH Labs operators. Get
            answers in hours, not days.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 className="mb-2 font-bold">Done-With-You Implementation</h3>
          <p className="text-text-secondary">
            We don&rsquo;t just hand you templates. We help you deploy them
            inside your business. Hands on keyboards.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 className="mb-2 font-bold">Early Access to New Systems</h3>
          <p className="text-text-secondary">
            Inner Circle members get first access to every new AI system,
            tool, and automation we build &mdash; weeks before the general
            community.
          </p>
        </div>
      </div>

      <div className="text-center">
        {error && (
          <div className="mx-auto mb-4 max-w-md rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <button
          onClick={() => handleUpsell(false)}
          disabled={loading}
          className="cta-gradient w-full max-w-md rounded-lg px-8 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50"
        >
          {loading
            ? "Redirecting..."
            : "Join the Inner Circle — $97/mo"}
        </button>
        <p className="mt-3 text-sm text-text-secondary">
          Cancel anytime. 60-day money-back guarantee.
        </p>

        <button
          onClick={() => setShowDownsell(true)}
          className="mt-6 text-sm text-text-secondary underline hover:text-text-primary"
        >
          Not ready for the full commitment? See other options &rarr;
        </button>
      </div>

      {/* Downsell overlay */}
      {showDownsell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative max-w-lg rounded-2xl border border-border bg-bg-primary p-8">
            <button
              onClick={() => setShowDownsell(false)}
              className="absolute right-4 top-4 text-text-secondary hover:text-text-primary"
            >
              ✕
            </button>
            <h2 className="mb-2 text-center text-2xl font-bold">
              Wait &mdash; Try It for{" "}
              <span className="font-mono text-emerald">$47</span>
            </h2>
            <p className="mb-6 text-center text-text-secondary">
              Get your first month of the Inner Circle for just $47 (then
              $97/mo). Full access to everything. If it&rsquo;s not for you,
              cancel before month two.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleUpsell(true)}
                disabled={loading}
                className="w-full rounded-lg bg-emerald px-6 py-3 font-bold text-black transition-all hover:bg-emerald/90 disabled:opacity-50"
              >
                {loading
                  ? "Redirecting..."
                  : "Try the Inner Circle — $47 first month"}
              </button>
              <button
                onClick={() => setShowDownsell(false)}
                className="w-full rounded-lg border border-border px-6 py-3 text-sm text-text-secondary hover:text-text-primary"
              >
                No thanks, I&rsquo;ll stick with the AI Growth Engine
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
