import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICES } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { trial } = await req.json();

  const priceId = trial ? PRICES.innerCircleTrial : PRICES.innerCircle;
  const origin = req.headers.get("origin") || "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/thank-you?upgraded=true`,
    cancel_url: `${origin}/upsell`,
    allow_promotion_codes: true,
    metadata: { product: "inner_circle", trial: trial ? "true" : "false" },
  });

  return NextResponse.json({ url: session.url });
}
