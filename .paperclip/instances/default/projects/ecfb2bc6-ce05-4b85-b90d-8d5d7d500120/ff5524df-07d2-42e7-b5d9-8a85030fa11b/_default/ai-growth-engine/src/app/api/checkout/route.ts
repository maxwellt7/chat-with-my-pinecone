import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICES } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { plan, orderBump } = await req.json();

    if (plan !== "monthly" && plan !== "annual") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const lineItems: { price: string; quantity: number }[] = [];

    if (plan === "monthly") {
      lineItems.push({ price: PRICES.monthly, quantity: 1 });
    } else {
      lineItems.push({ price: PRICES.annual, quantity: 1 });
    }

    // One-time prices are supported in subscription mode — charged on the first invoice
    if (orderBump) {
      lineItems.push({ price: PRICES.orderBump, quantity: 1 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      allow_promotion_codes: true,
      metadata: { plan, orderBump: orderBump ? "true" : "false" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
