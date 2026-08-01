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

    const alerts = await Alert.find();

    console.log(`Found ${alerts.length} alerts`);

    for (const alert of alerts) {
      console.log("-----------------------------");
      console.log(`Checking ${alert.symbol}`);

      try {
        // Get current stock price
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${alert.symbol}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          console.log(
            `❌ Yahoo request failed for ${alert.symbol}: ${res.status}`
          );

          continue;
        }

        const data = await res.json();

        const currentPrice =
          data.chart?.result?.[0]?.meta?.regularMarketPrice;

        if (typeof currentPrice !== "number") {
          console.log(
            `❌ Current price not found for ${alert.symbol}`
          );

          continue;
        }

        console.log("Current Price:", currentPrice);
        console.log("Target Price :", alert.targetPrice);

        // Only trigger when current price
        // reaches or goes below target price
        const shouldTrigger =
          currentPrice <= alert.targetPrice;

        console.log("Should Trigger:", shouldTrigger);

        // Target hasn't been reached yet
        if (!shouldTrigger) {
          alert.currentPrice = currentPrice;

          await alert.save();

          console.log("⏭️ Target not reached");

          continue;
        }

        console.log("📨 Sending Telegram...");

        await sendTelegramMessage(
`🚨 Stock Alert

${alert.symbol}

Current Price: ₹${currentPrice}

Target Price: ₹${alert.targetPrice}

Target price reached!`
        );

        console.log("✅ Telegram Sent");

        // Delete the alert after successful notification
        await Alert.findByIdAndDelete(alert._id);

        console.log(`🗑️ Alert deleted: ${alert.symbol}`);
      } catch (alertError) {
        console.error(
          `❌ Error checking ${alert.symbol}:`,
          alertError
        );

        continue;
      }
    }

    console.log("========== API CHECK FINISHED ==========");

    return NextResponse.json({
      success: true,
      alertsChecked: alerts.length,
    });
  } catch (error) {
    console.error("❌ CHECK API ERROR:", error);

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