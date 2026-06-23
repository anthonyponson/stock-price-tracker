"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface StockData {
  symbol: string;
  price: number;
  previousClose: number;
}

interface Props {
  stocks: string[];
}

export default function StockList({ stocks }: Props) {
  const [stockData, setStockData] = useState<StockData[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const query = stocks.join(",");

        const res = await fetch(`/api/stocks?symbols=${query}`);

        const data = await res.json();

        setStockData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, [stocks]);

  if (loading) {
    return <div className="p-10 text-white">Loading stocks...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-10">
      {stockData.map((stock) => {
        const isPositive = stock.price >= stock.previousClose;

        const percentage = (
          ((stock.price - stock.previousClose) / stock.previousClose) *
          100
        ).toFixed(2);

        return (
          <Link href={`/stocks/${stock.symbol}`} key={stock.symbol}>
            <div className="bg-slate-800 rounded-2xl p-5 shadow-lg hover:bg-slate-700 transition cursor-pointer">
              <h2 className="text-xl font-bold text-white">{stock.symbol}</h2>

              <p className="text-3xl font-semibold text-white mt-3">
                ₹{stock.price}
              </p>

              <p
                className={`mt-2 font-medium ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isPositive ? "+" : ""}
                {percentage}%
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
