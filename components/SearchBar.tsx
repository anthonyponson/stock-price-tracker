"use client"

import { useState } from "react"

interface Props {
  onAddStock: (symbol: string) => void
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

      if (
        !data.length ||
        !data[0] ||
        !data[0].price ||
        !data[0].previousClose
      ) {
        setError("Stock not found")
        return
      }

      onAddStock(symbol)

      setInput("")
      setSuggestions([])
    } catch {
      setError("Something went wrong")
    }
  }

  return (
    <div className="px-10 relative">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search stock (e.g. SBIN)"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-slate-800 text-white px-4 py-3 rounded-xl outline-none w-full"
        />

        <button
          onClick={() => handleAddStock(input.toUpperCase())}
          className="bg-green-500 hover:bg-green-600 px-6 rounded-xl font-semibold"
        >
          Add
        </button>
      </div>

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
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
