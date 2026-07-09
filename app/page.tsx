
import SearchBar from "@/components/SearchBar";
import StockList from "@/components/stockList";
import AlertList from "@/components/AlertList";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-2">
          Stock Alert Dashboard
        </h1>

        <p className="text-slate-400">
          Track stocks and receive alerts instantly.
        </p>
      </div>

      <SearchBar />

      <StockList />

      <AlertList />
    </main>
  );
}