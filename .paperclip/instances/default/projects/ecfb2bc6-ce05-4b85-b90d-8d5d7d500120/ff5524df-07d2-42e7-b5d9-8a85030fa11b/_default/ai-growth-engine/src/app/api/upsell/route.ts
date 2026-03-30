import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, PRICES } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { trial } = await req.json();

    const priceId = trial ? PRICES.innerCircleTrial : PRICES.innerCircle;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/thank-you?upgraded=true`,
      cancel_url: `${origin}/upsell`,
      allow_promotion_codes: true,
      metadata: { product: "inner_circle", trial: trial ? "true" : "false" },
    };

    // Apply $50-off coupon for downsell trial ($97 -> $47 first month)
    if (trial && process.env.STRIPE_INNER_CIRCLE_TRIAL_COUPON) {
      params.discounts = [{ coupon: process.env.STRIPE_INNER_CIRCLE_TRIAL_COUPON }];
    }

    const session = await getStripe().checkout.sessions.create(params);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upsell checkout failed";
    console.error("Upsell error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
