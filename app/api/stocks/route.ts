import { NextResponse } from "next/server";

const STOCKS = [
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS",
  "HDFCBANK.NS",
];

export async function GET() {
  try {
    const results = await Promise.all(
      STOCKS.map(async (symbol) => {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
        );

        const data = await res.json();

        const result = data.chart.result[0];

        return {
          symbol: symbol.replace(".NS", ""),
          price: result.meta.regularMarketPrice,
          previousClose: result.meta.previousClose,
        };
      })
    );

    return NextResponse.json(results);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}