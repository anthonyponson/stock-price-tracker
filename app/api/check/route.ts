import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import { sendTelegramMessage } from "@/lib/telegram";

const COOLDOWN_HOURS = 24;

export async function GET(req: NextRequest) {
  console.log("========== API CHECK STARTED ==========");

  const secret = req.headers.get("x-cron-secret");

  if (secret !== process.env.CRON_SECRET) {
    console.log("❌ Unauthorized");

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("✅ Authorized");

  try {
    await connectDB();

    const alerts = await Alert.find();

    console.log(`Found ${alerts.length} alerts`);

    const cooldown =
      COOLDOWN_HOURS * 60 * 60 * 1000;

    for (const alert of alerts) {
      console.log("-----------------------------");
      console.log(`Checking ${alert.symbol}`);

      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${alert.symbol}`
      );

      const data = await res.json();

      if (!data.chart?.result?.[0]?.meta?.regularMarketPrice) {
        console.log(`❌ Failed to fetch ${alert.symbol}`);
        continue;
      }

      const currentPrice =
        data.chart.result[0].meta.regularMarketPrice;

      alert.currentPrice = currentPrice;

      const shouldTrigger =
  currentPrice <= alert.targetPrice;

      console.log("Current:", currentPrice);
      console.log("Target :", alert.targetPrice);
      console.log("Should Trigger:", shouldTrigger);

      if (!shouldTrigger) {
        await alert.save();
        continue;
      }

      const now = new Date();

      console.log("lastTriggeredAt:", alert.lastTriggeredAt);

      const canNotify =
        !alert.lastTriggeredAt ||
        now.getTime() -
          new Date(alert.lastTriggeredAt).getTime() >=
          cooldown;

      console.log("Can Notify:", canNotify);

      if (!canNotify) {
        await alert.save();
        continue;
      }

      console.log("📨 Sending Telegram...");

      await sendTelegramMessage(
`🚨 Stock Alert

${alert.symbol}

Current Price: ₹${currentPrice}

Target Price: ₹${alert.targetPrice}`
      );

      console.log("✅ Telegram Sent");

      alert.lastTriggeredAt = now;

      await alert.save();
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed",
      },
      {
        status: 500,
      }
    );
  }
}