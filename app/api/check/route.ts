import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  try {
    await connectDB();

    const alerts = await Alert.find({
      triggered: false,
    });

    for (const alert of alerts) {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${alert.symbol}`
      );

      const data = await res.json();

      const currentPrice =
        data.chart.result[0].meta
          .regularMarketPrice;

      let shouldTrigger = false;

      if (
        alert.condition === "below" &&
        currentPrice <= alert.targetPrice
      ) {
        shouldTrigger = true;
      }

      if (
        alert.condition === "above" &&
        currentPrice >= alert.targetPrice
      ) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        await sendTelegramMessage(
          `🚨 Stock Alert

${alert.symbol}

Current Price: ₹${currentPrice}

Target Price: ₹${alert.targetPrice}`
        );

        alert.triggered = true;
        alert.currentPrice =
          currentPrice;

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
      }
    );
  }
}