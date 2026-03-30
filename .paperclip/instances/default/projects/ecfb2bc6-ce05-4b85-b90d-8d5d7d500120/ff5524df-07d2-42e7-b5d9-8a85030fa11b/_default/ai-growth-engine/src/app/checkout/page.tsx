"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/tracking";

type Plan = "monthly" | "annual";

export default function CheckoutPage() {
  const [plan, setPlan] = useState<Plan>("annual");
  const [orderBump, setOrderBump] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    trackEvent("InitiateCheckout", {
      value: plan === "monthly" ? 19 : 149,
      currency: "USD",
    });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, orderBump }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-center text-3xl font-extrabold md:text-4xl">
        Complete Your Order
      </h1>
      <p className="mb-10 text-center text-text-secondary">
        Secure checkout powered by Stripe. Cancel anytime.
      </p>

      {/* Plan Selection */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => setPlan("monthly")}
          className={`rounded-xl border-2 p-6 text-left transition-all ${
            plan === "monthly"
              ? "border-accent bg-bg-secondary"
              : "border-border hover:border-border/80"
          }`}
        >
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Monthly
          </p>
          <p className="text-3xl font-extrabold">
            <span className="font-mono">$19</span>
            <span className="text-base font-normal text-text-secondary">
              /mo
            </span>
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Cancel anytime. No contracts.
          </p>
        </button>

        <button
          onClick={() => setPlan("annual")}
          className={`relative rounded-xl border-2 p-6 text-left transition-all ${
            plan === "annual"
              ? "border-emerald bg-bg-secondary"
              : "border-border hover:border-border/80"
          }`}
        >
          <span className="absolute -top-3 right-4 rounded-full bg-emerald px-3 py-0.5 text-xs font-bold text-black">
            SAVE 35%
          </span>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Annual
          </p>
          <p className="text-3xl font-extrabold">
            <span className="font-mono">$149</span>
            <span className="text-base font-normal text-text-secondary">
              /yr
            </span>
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            That&rsquo;s{" "}
            <span className="font-mono text-emerald">$12.42/mo</span>.
            Best value.
          </p>
        </button>
      </div>

      {/* Order Bump */}
      <div
        onClick={() => setOrderBump(!orderBump)}
        className={`mb-8 cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all ${
          orderBump
            ? "border-amber bg-amber/5"
            : "border-border hover:border-amber/50"
        }`}
      >
        <div className="mb-2 flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
              orderBump
                ? "border-amber bg-amber text-black"
                : "border-border"
            }`}
          >
            {orderBump && (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-bold text-amber">
              YES! Add the Personalization Engine Blueprint &mdash;{" "}
              <span className="font-mono">$47</span>{" "}
              <span className="text-sm font-normal text-text-secondary">
                (one-time)
              </span>
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              The complete implementation guide for the system that cuts CAC by
              20%. Step-by-step architecture, code templates, and measurement
              framework. Deploy in a weekend.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-xl border border-border bg-bg-secondary p-6">
        <h3 className="mb-4 font-bold">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">
              AI Growth Engine ({plan === "monthly" ? "Monthly" : "Annual"})
            </span>
            <span className="font-mono">
              {plan === "monthly" ? "$19/mo" : "$149/yr"}
            </span>
          </div>
          {orderBump && (
            <div className="flex justify-between">
              <span className="text-text-secondary">
                Personalization Engine Blueprint
              </span>
              <span className="font-mono">$47</span>
            </div>
          )}
          <div className="mt-2 border-t border-border pt-2">
            <div className="flex justify-between font-bold">
              <span>Due today</span>
              <span className="font-mono text-emerald">
                ${plan === "monthly" ? 19 + (orderBump ? 47 : 0) : 149 + (orderBump ? 47 : 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="cta-gradient w-full rounded-lg px-8 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? "Redirecting to Stripe..." : "Complete Order — Secure Checkout"}
      </button>

      <div className="mt-6 space-y-2 text-center text-xs text-text-secondary">
        <p>🔒 256-bit SSL encryption. Your data is safe.</p>
        <p>60-day money-back guarantee. Cancel anytime.</p>
      </div>
    </main>
  );
}
