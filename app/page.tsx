"use client"

import { useState } from "react"

import SearchBar from "@/components/SearchBar"
import StockList from "@/components/stockList"

export default function HomePage() {
  const [stocks, setStocks] = useState(["RELIANCE", "TCS", "INFY", "HDFCBANK"])

  function addStock(symbol: string) {
    if (stocks.includes(symbol)) return

    setStocks((prev) => [...prev, symbol])
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-2">Stock Alert Dashboard</h1>

        <p className="text-slate-400">
          Track stocks and resssceive alerts instantly.
        </p>
      </div>

      <SearchBar onAddStock={addStock} />

      <StockList stocks={stocks} />
    </main>
  )
}
