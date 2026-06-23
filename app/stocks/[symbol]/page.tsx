interface Props {
  params: Promise<{
    symbol: string;
  }>;
}

export default async function StockDetailsPage({
  params,
}: Props) {
  const { symbol } = await params;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold">
        {symbol}
      </h1>

      <p className="text-slate-400 mt-2">
        Stock Details Page
      </p>
    </div>
  );
}