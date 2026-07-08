import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  console.log("Received Secret:", secret);
  console.log("Expected Secret:", process.env.CRON_SECRET);

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const alerts = await Alert.find({
      triggered: false,
    });

    for (const alert of alerts) {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${alert.symbol}`,
      );

      const data = await res.json();

      if (!data.chart?.result?.[0]?.meta?.regularMarketPrice) {
        console.log(`❌ Failed to fetch ${alert.symbol}`);
        continue;
      }

      const currentPrice = data.chart.result[0].meta.regularMarketPrice;
      12;

      let shouldTrigger = false;

      if (alert.condition === "below" && currentPrice <= alert.targetPrice) {
        shouldTrigger = true;
      }

      if (alert.condition === "above" && currentPrice >= alert.targetPrice) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        await sendTelegramMessage(
          `🚨 Stock Alert

${alert.symbol}

Current Price: ₹${currentPrice}

Target Price: ₹${alert.targetPrice}`,
        );

        alert.triggered = true;
        alert.currentPrice = currentPrice;

        await alert.save();
      }
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
      },
    );
  }
}
