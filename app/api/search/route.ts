import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    const response = await fetch(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
        query
      )}`
    );

    const data = await response.json();

    const stocks =
  data.quotes
    ?.filter((item: any) => {
      return (
        item.symbol &&
        (
          item.symbol.endsWith(".NS") ||
          item.symbol.endsWith(".BO")
        )
      );
    })
    .map((item: any) => ({
      symbol: item.symbol,
      name:
        item.shortname ||
        item.longname ||
        item.symbol,
    })) || [];
    
    return NextResponse.json(stocks);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}