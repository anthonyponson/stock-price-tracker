import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { symbol, targetPrice } = body;

    if (!symbol || !targetPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newAlert = await Alert.create({
      symbol,
      targetPrice,
    });

    return NextResponse.json({
      success: true,
      data: newAlert,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}