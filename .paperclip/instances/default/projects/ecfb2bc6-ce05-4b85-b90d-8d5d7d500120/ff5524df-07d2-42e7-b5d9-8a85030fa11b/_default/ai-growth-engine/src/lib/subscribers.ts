import { getRedis } from "./redis";

export type SubscriberStatus = "active" | "churned" | "payment_failed";
export type SequenceType = "welcome" | "nurture" | "sales";

export interface Subscriber {
  email: string;
  customerId: string;
  plan: string;
  orderBump: boolean;
  status: SubscriberStatus;
  signupAt: string; // ISO date
  lastEmailIndex: number; // 0-based index into the full 15-email sequence
  lastEmailSentAt: string | null;
}

const SUBSCRIBER_PREFIX = "subscriber:";
const SUBSCRIBERS_SET = "subscribers:active";

export async function createSubscriber(data: {
  email: string;
  customerId: string;
  plan: string;
  orderBump: boolean;
}): Promise<Subscriber> {
  const redis = getRedis();
  const subscriber: Subscriber = {
    email: data.email,
    customerId: data.customerId,
    plan: data.plan,
    orderBump: data.orderBump,
    status: "active",
    signupAt: new Date().toISOString(),
    lastEmailIndex: -1, // no emails sent yet
    lastEmailSentAt: null,
  };

  await redis.set(`${SUBSCRIBER_PREFIX}${data.email}`, JSON.stringify(subscriber));
  await redis.sadd(SUBSCRIBERS_SET, data.email);
  return subscriber;
}

export async function getSubscriber(email: string): Promise<Subscriber | null> {
  const redis = getRedis();
  const data = await redis.get<string>(`${SUBSCRIBER_PREFIX}${email}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data as unknown as Subscriber;
}

export async function updateSubscriber(
  email: string,
  updates: Partial<Pick<Subscriber, "status" | "lastEmailIndex" | "lastEmailSentAt">>
): Promise<void> {
  const redis = getRedis();
  const existing = await getSubscriber(email);
  if (!existing) return;

  const updated = { ...existing, ...updates };
  await redis.set(`${SUBSCRIBER_PREFIX}${email}`, JSON.stringify(updated));

  if (updates.status === "churned") {
    await redis.srem(SUBSCRIBERS_SET, email);
  }
}

export async function getActiveSubscribers(): Promise<Subscriber[]> {
  const redis = getRedis();
  const emails = await redis.smembers(SUBSCRIBERS_SET);
  const subscribers: Subscriber[] = [];

  for (const email of emails) {
    const sub = await getSubscriber(email);
    if (sub && sub.status === "active") {
      subscribers.push(sub);
    }
  }

  return subscribers;
}
