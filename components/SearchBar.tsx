"use client"

import { useState } from "react"

interface Props {
  onAddStock: (symbol: string) => void
}

export default function SearchBar({ onAddStock }: Props) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleAddStock() {
    if (!input.trim()) return

    try {
      setLoading(true)
      setError("")

      const symbol = input.toUpperCase()

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
    } catch (error) {
      console.error(error)

      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-10">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search stock (e.g. SBIN)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-slate-800 text-white px-4 py-3 rounded-xl outline-none w-full"
        />

        <button
          onClick={handleAddStock}
          className="bg-green-500 hover:bg-green-600 px-6 rounded-xl font-semibold"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
