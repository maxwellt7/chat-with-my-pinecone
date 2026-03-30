#!/usr/bin/env node
/**
 * One-time script to create Stripe products and prices for AI Growth Engine.
 * Run with: STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe.mjs
 */

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Set STRIPE_SECRET_KEY env var before running.");
  process.exit(1);
}

const stripe = new Stripe(key);

async function main() {
  console.log("Creating Stripe products and prices...\n");

  // 1. AI Growth Engine (Monthly) — $19/mo
  const engineProduct = await stripe.products.create({
    name: "AI Growth Engine",
    description:
      "The exact AI systems used to generate $100M+ in client revenue — templates, playbooks, and automations.",
  });

  const monthlyPrice = await stripe.prices.create({
    product: engineProduct.id,
    unit_amount: 1900,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "ai_growth_engine_monthly",
  });
  console.log(`STRIPE_PRICE_MONTHLY=${monthlyPrice.id}`);

  // 2. AI Growth Engine (Annual) — $149/yr
  const annualPrice = await stripe.prices.create({
    product: engineProduct.id,
    unit_amount: 14900,
    currency: "usd",
    recurring: { interval: "year" },
    lookup_key: "ai_growth_engine_annual",
  });
  console.log(`STRIPE_PRICE_ANNUAL=${annualPrice.id}`);

  // 3. Personalization Engine Blueprint (Order Bump) — $47 one-time
  const blueprintProduct = await stripe.products.create({
    name: "Personalization Engine Blueprint",
    description:
      "Complete implementation guide for the system that cuts CAC by 20%. Step-by-step architecture, code templates, and measurement framework.",
  });

  const orderBumpPrice = await stripe.prices.create({
    product: blueprintProduct.id,
    unit_amount: 4700,
    currency: "usd",
    lookup_key: "personalization_engine_blueprint",
  });
  console.log(`STRIPE_PRICE_ORDER_BUMP=${orderBumpPrice.id}`);

  // 4. Inner Circle (Monthly) — $97/mo
  const innerCircleProduct = await stripe.products.create({
    name: "Inner Circle",
    description:
      "Direct access to Max and the VH Labs team. Weekly strategy calls, private Slack channel, and done-with-you implementation support.",
  });

  const innerCirclePrice = await stripe.prices.create({
    product: innerCircleProduct.id,
    unit_amount: 9700,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "inner_circle_monthly",
  });
  console.log(`STRIPE_PRICE_INNER_CIRCLE=${innerCirclePrice.id}`);

  // 5. Inner Circle Trial (Downsell) — $47 first month, then $97/mo
  // Stripe doesn't natively support "first month at X then Y" in a single price.
  // Use a coupon for the first month discount instead.
  const innerCircleTrialPrice = await stripe.prices.create({
    product: innerCircleProduct.id,
    unit_amount: 9700,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "inner_circle_trial",
  });

  // Create a coupon: $50 off first month (making it $47)
  const coupon = await stripe.coupons.create({
    amount_off: 5000,
    currency: "usd",
    duration: "once",
    name: "Inner Circle - First Month Trial ($47)",
  });

  console.log(`STRIPE_PRICE_INNER_CIRCLE_TRIAL=${innerCircleTrialPrice.id}`);
  console.log(`STRIPE_INNER_CIRCLE_TRIAL_COUPON=${coupon.id}`);

  console.log("\n--- Summary ---");
  console.log("Products created:", engineProduct.id, blueprintProduct.id, innerCircleProduct.id);
  console.log("\nSet these environment variables in Vercel:");
  console.log(`STRIPE_PRICE_MONTHLY=${monthlyPrice.id}`);
  console.log(`STRIPE_PRICE_ANNUAL=${annualPrice.id}`);
  console.log(`STRIPE_PRICE_ORDER_BUMP=${orderBumpPrice.id}`);
  console.log(`STRIPE_PRICE_INNER_CIRCLE=${innerCirclePrice.id}`);
  console.log(`STRIPE_PRICE_INNER_CIRCLE_TRIAL=${innerCircleTrialPrice.id}`);
  console.log(`STRIPE_INNER_CIRCLE_TRIAL_COUPON=${coupon.id}`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
