import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const symbols =
      searchParams.get("symbols")?.split(",") || [];

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const yahooSymbol = `${symbol}.NS`;

          const res = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`
          );

          const data = await res.json();

          if (
            !data.chart ||
            !data.chart.result ||
            !data.chart.result[0]
          ) {
            return null;
          }

          const result = data.chart.result[0];

          return {
            symbol,
            price: result.meta.regularMarketPrice,
            previousClose: result.meta.previousClose,
          };

        } catch {
          return null;
        }
      })
    );

    const filteredResults =
      results.filter(Boolean);

    return NextResponse.json(filteredResults);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}