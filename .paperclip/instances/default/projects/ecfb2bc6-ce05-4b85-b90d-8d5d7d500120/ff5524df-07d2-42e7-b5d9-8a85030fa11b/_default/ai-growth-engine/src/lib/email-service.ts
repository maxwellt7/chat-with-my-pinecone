import { getResend, EMAIL_FROM } from "./resend";
import { getEmailByIndex, getNextEmail, shouldSendEmail, type EmailEntry } from "./email-sequences";
import {
  createSubscriber,
  getSubscriber,
  updateSubscriber,
  getActiveSubscribers,
} from "./subscribers";
import DripEmail from "@/emails/drip-email";

export async function onCheckoutCompleted(data: {
  email: string;
  customerId: string;
  plan: string;
  orderBump: boolean;
}): Promise<void> {
  const existing = await getSubscriber(data.email);
  if (existing) {
    console.log(`Subscriber ${data.email} already exists, skipping`);
    return;
  }

  await createSubscriber(data);

  // Send Email 1 (welcome) immediately
  const firstEmail = getEmailByIndex(0);
  if (firstEmail) {
    await sendDripEmail(data.email, firstEmail);
    await updateSubscriber(data.email, {
      lastEmailIndex: 0,
      lastEmailSentAt: new Date().toISOString(),
    });
  }
}

export async function onSubscriptionCancelled(email: string): Promise<void> {
  await updateSubscriber(email, { status: "churned" });
}

export async function onPaymentFailed(email: string): Promise<void> {
  await updateSubscriber(email, { status: "payment_failed" });
}

export async function processDripEmails(): Promise<{
  sent: number;
  errors: number;
}> {
  const subscribers = await getActiveSubscribers();
  let sent = 0;
  let errors = 0;

  for (const sub of subscribers) {
    const nextEmail = getNextEmail(sub.lastEmailIndex);
    if (!nextEmail) continue; // sequence complete

    const signupDate = new Date(sub.signupAt);
    if (!shouldSendEmail(signupDate, nextEmail)) continue; // not time yet

    try {
      await sendDripEmail(sub.email, nextEmail);
      await updateSubscriber(sub.email, {
        lastEmailIndex: nextEmail.index,
        lastEmailSentAt: new Date().toISOString(),
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send email ${nextEmail.index} to ${sub.email}:`, err);
      errors++;
    }
  }

  return { sent, errors };
}

async function sendDripEmail(to: string, email: EmailEntry): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: email.subject,
    react: DripEmail({
      preheader: email.preheader,
      body: email.body,
    }),
  });

  console.log(`Sent email ${email.index} (${email.sequence}) to ${to}: "${email.subject}"`);
}
