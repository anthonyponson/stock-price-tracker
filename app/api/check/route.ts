import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import { sendTelegramMessage } from "@/lib/telegram";

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

    // Only check alerts that haven't been triggered yet
    const alerts = await Alert.find({
      triggered: false,
    });

    console.log(`Found ${alerts.length} active alerts`);

    for (const alert of alerts) {
      console.log("-----------------------------");
      console.log(`Checking ${alert.symbol}`);

      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${alert.symbol}`
      );

      const data = await res.json();

      const currentPrice =
        data.chart?.result?.[0]?.meta?.regularMarketPrice;

      if (!currentPrice) {
        console.log(`❌ Failed to fetch ${alert.symbol}`);
        continue;
      }

      alert.currentPrice = currentPrice;

      console.log("Current Price:", currentPrice);
      console.log("Target Price :", alert.targetPrice);

      // Price hasn't reached target yet
      if (currentPrice > alert.targetPrice) {
        await alert.save();
        console.log("⏳ Target not reached");
        continue;
      }

      console.log("📨 Sending Telegram...");

      await sendTelegramMessage(
        `🚨 Stock Alert

${alert.symbol}

Current Price: ₹${currentPrice}

Target Price: ₹${alert.targetPrice}

✅ Target reached!`
      );

      console.log("✅ Telegram Sent");

      // Mark alert as completed
      alert.triggered = true;
      alert.triggeredAt = new Date();

      await alert.save();

      console.log("✅ Alert marked as triggered");
    }

    return NextResponse.json({
      success: true,
      checked: alerts.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to check alerts",
      },
      {
        status: 500,
      }
    );
  }
}