import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  onCheckoutCompleted,
  onSubscriptionCancelled,
  onPaymentFailed,
} from "@/lib/email-service";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? "unknown";

      console.log("Checkout completed:", {
        customer: customerId,
        email,
        metadata: session.metadata,
      });

      if (email) {
        await onCheckoutCompleted({
          email,
          customerId,
          plan: session.metadata?.plan ?? "monthly",
          orderBump: session.metadata?.orderBump === "true",
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      console.log("Subscription cancelled:", {
        customer: customerId,
        id: subscription.id,
      });

      // Look up email from Stripe customer
      const customer = await getStripe().customers.retrieve(customerId);
      if (!customer.deleted && customer.email) {
        await onSubscriptionCancelled(customer.email);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

      console.log("Payment failed:", {
        customer: customerId,
        subscription: invoice.subscription,
      });

      if (customerId) {
        const customer = await getStripe().customers.retrieve(customerId);
        if (!customer.deleted && customer.email) {
          await onPaymentFailed(customer.email);
        }
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
