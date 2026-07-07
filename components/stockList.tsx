"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Stock {
  symbol: string;
  price: number;
  previousClose: number;
}

export default function StockList() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
  }, []);

  async function fetchStocks() {
    try {
      // Fetch saved stocks from MongoDB
      const dbRes = await fetch("/api/stock");
      const dbStocks = await dbRes.json();

      if (!dbStocks.length) {
        setStocks([]);
        return;
      }

      const symbols = dbStocks
        .map((stock: any) => stock.symbol)
        .join(",");

      // Fetch live prices from Yahoo route
      const stockRes = await fetch(
        `/api/stocks?symbols=${symbols}`
      );

      const stockData = await stockRes.json();

      setStocks(stockData);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <p className="px-10 mt-10 text-slate-400">
        Loading stocks...
      </p>
    );
  }

  if (stocks.length === 0) {
    return (
      <p className="px-10 mt-10 text-slate-400">
        No stocks added yet.
      </p>
    );
  }

  return (
    <div className="p-10">
      <div className="grid md:grid-cols-4 gap-6">
        {stocks.map((stock) => {
          const change =
            ((stock.price - stock.previousClose) /
              stock.previousClose) *
            100;

          return (
            <Link
              key={stock.symbol}
              href={`/stocks/${stock.symbol}`}
              className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-700 transition-all duration-300 cursor-pointer"
            >
              <h2 className="font-bold text-2xl">
                {stock.symbol}
              </h2>

              <p className="text-4xl font-bold mt-4">
                ₹{stock.price}
              </p>

              <p
                className={`mt-3 ${
                  change >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {change.toFixed(2)}%
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}