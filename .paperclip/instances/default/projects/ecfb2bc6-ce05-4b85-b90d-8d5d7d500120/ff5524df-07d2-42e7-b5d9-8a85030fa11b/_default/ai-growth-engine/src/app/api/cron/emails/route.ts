import { NextRequest, NextResponse } from "next/server";
import { processDripEmails } from "@/lib/email-service";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processDripEmails();

  console.log("Drip email cron completed:", result);
  return NextResponse.json({
    ok: true,
    sent: result.sent,
    errors: result.errors,
  });
}
