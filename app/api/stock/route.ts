import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Stock from "@/models/Stock";

export async function GET() {
  try {
    await connectDB();

    const stocks = await Stock.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(stocks);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const stock = await Stock.create({
      symbol: body.symbol,
    });

    return NextResponse.json(stock);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create stock" },
      { status: 500 }
    );
  }
}