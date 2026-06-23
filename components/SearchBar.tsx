"use client";

import { useEffect, useState } from "react";

interface Props {
  onAddStock: (symbol: string) => void;
}

interface SearchResult {
  description: string;
  symbol: string;
}

export default function SearchBar({ onAddStock }: Props) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!input.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(input)}`
        );

        const data = await res.json();

        setResults(data.slice(0, 8));
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [input]);

  async function addStock(symbol: string) {
    try {
      setError("");

      const res = await fetch(
        `/api/stocks?symbols=${symbol}`
      );

      const data = await res.json();

      if (
        !data.length ||
        !data[0] ||
        !data[0].price
      ) {
        setError("Stock not found");
        return;
      }

      onAddStock(symbol);

      setInput("");
      setResults([]);

    } catch (error) {
      console.error(error);

      setError("Failed to add stock");
    }
  }

  return (
    <div className="px-4 md:px-10 relative">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search stocks..."
          className="w-full bg-slate-800 rounded-xl px-4 py-3 outline-none text-white"
        />

        <button
          onClick={() => addStock(input)}
          className="bg-green-500 px-6 rounded-xl font-semibold"
        >
          Add
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute left-4 right-4 md:left-10 md:right-10 mt-2 bg-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
          {results.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => addStock(stock.symbol)}
              className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700"
            >
              <div className="font-semibold">
                {stock.symbol}
              </div>

              <div className="text-sm text-slate-400">
                {stock.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}