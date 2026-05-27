"use client";

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
    async function fetchStocks() {
      try {
        const res = await fetch("/api/stocks");

        const data = await res.json();

        setStocks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading stocks...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-10">
      {stocks.map((stock) => {
        const isPositive =
          stock.price >= stock.previousClose;

        const percentage =
          (
            ((stock.price - stock.previousClose) /
              stock.previousClose) *
            100
          ).toFixed(2);

        return (
          <div
            key={stock.symbol}
            className="bg-slate-800 rounded-2xl p-5 shadow-lg hover:bg-slate-700 transition"
          >
            <h2 className="text-xl font-bold text-white">
              {stock.symbol}
            </h2>

            <p className="text-3xl font-semibold text-white mt-3">
              ₹{stock.price}
            </p>

            <p
              className={`mt-2 font-medium ${
                isPositive
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {percentage}%
            </p>
          </div>
        );
      })}
    </div>
  );
}