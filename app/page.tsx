import Image from "next/image";
import StockChart from "@/components/stockChart";
import StockList from "@/components/stockList";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <main className="min-h-screen bg-slate-900 text-white">
      
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-2">
          Stock Alert Dashboard
        </h1>

        <p className="text-slate-400">
          Track stocks and receive alerts instantly.
        </p>
      </div>

      {/* <StockChart /> */}
      <StockList />

    </main>
    </div>
  );
}
