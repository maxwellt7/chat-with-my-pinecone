import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
  orderBump: process.env.STRIPE_PRICE_ORDER_BUMP!,
  innerCircle: process.env.STRIPE_PRICE_INNER_CIRCLE!,
  innerCircleTrial: process.env.STRIPE_PRICE_INNER_CIRCLE_TRIAL!,
} as const;
