import Stripe from "stripe";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  }
  return _stripe;
}

export const PRICES = {
  monthly: requireEnv("STRIPE_PRICE_MONTHLY"),
  annual: requireEnv("STRIPE_PRICE_ANNUAL"),
  orderBump: requireEnv("STRIPE_PRICE_ORDER_BUMP"),
  innerCircle: requireEnv("STRIPE_PRICE_INNER_CIRCLE"),
  innerCircleTrial: requireEnv("STRIPE_PRICE_INNER_CIRCLE_TRIAL"),
} as const;
