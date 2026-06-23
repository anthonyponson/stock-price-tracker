"use client";

import { useEffect, useState } from "react";

interface Props {
  onAddStock: (symbol: string) => void;
}

interface SearchResult {
  description: string;
  symbol: string;
}

const STOCK_SUGGESTIONS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "SBIN",
  "ITC",
  "WIPRO",
  "ADANIPORTS",
  "HINDUNILVR",
  "GOLDBEES",
]

export default function SearchBar({ onAddStock }: Props) {
<<<<<<< HEAD
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
=======
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState("")

  function handleChange(value: string) {
    setInput(value)

    if (!value) {
      setSuggestions([])
      return
    }

    const filtered = STOCK_SUGGESTIONS.filter((stock) =>
      stock.toLowerCase().includes(value.toLowerCase())
    )

    setSuggestions(filtered)
  }

  async function handleAddStock(symbol: string) {
    try {
      setError("")

      const res = await fetch(`/api/stocks?symbols=${symbol}`)
      const data = await res.json()
>>>>>>> b960aa31bc6e290b85c55af2783eb5ed18908429

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

<<<<<<< HEAD
    } catch (error) {
      console.error(error);

      setError("Failed to add stock");
=======
      setInput("")
      setSuggestions([])
    } catch {
      setError("Something went wrong")
>>>>>>> b960aa31bc6e290b85c55af2783eb5ed18908429
    }
  }

  return (
<<<<<<< HEAD
    <div className="px-4 md:px-10 relative">
=======
    <div className="px-10 relative">
>>>>>>> b960aa31bc6e290b85c55af2783eb5ed18908429
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
<<<<<<< HEAD
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search stocks..."
          className="w-full bg-slate-800 rounded-xl px-4 py-3 outline-none text-white"
        />

        <button
          onClick={() => addStock(input)}
          className="bg-green-500 px-6 rounded-xl font-semibold"
=======
          onChange={(e) => handleChange(e.target.value)}
          className="bg-slate-800 text-white px-4 py-3 rounded-xl outline-none w-full"
        />

        <button
          onClick={() => handleAddStock(input.toUpperCase())}
          className="bg-green-500 hover:bg-green-600 px-6 rounded-xl font-semibold"
>>>>>>> b960aa31bc6e290b85c55af2783eb5ed18908429
        >
          Add
        </button>
      </div>

<<<<<<< HEAD
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
=======
      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute left-10 right-10 bg-slate-800 mt-2 rounded-xl shadow-lg z-10">
          {suggestions.map((stock) => (
            <div
              key={stock}
              onClick={() => handleAddStock(stock)}
              className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
            >
              {stock}
>>>>>>> b960aa31bc6e290b85c55af2783eb5ed18908429
            </div>
          ))}
        </div>
      )}

<<<<<<< HEAD
      {error && (
        <p className="text-red-500 mt-2">
          {error}
        </p>
      )}
=======
      {error && <p className="text-red-500 mt-2">{error}</p>}
>>>>>>> b960aa31bc6e290b85c55af2783eb5ed18908429
    </div>
  );
}