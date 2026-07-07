"use client";

import { useEffect, useState } from "react";

interface Alert {
  _id: string;
  symbol: string;
  targetPrice: number;
}

export default function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      const res = await fetch("/api/alert");
      const data = await res.json();

      if (Array.isArray(data)) {
        setAlerts(data);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteAlert(id: string) {
    try {
      await fetch(`/api/alert/${id}`, {
        method: "DELETE",
      });

      setAlerts((prev) => prev.filter((alert) => alert._id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <p className="text-slate-400 mt-8 px-10">Loading alerts...</p>;
  }

  return (
    <div className="px-10 mt-10">
      <h2 className="text-2xl font-bold mb-4">Saved Alerts</h2>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <div
            key={alert._id}
            className="bg-slate-800 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{alert.symbol}</h3>

              <p className="text-slate-400">
                Target Price: ₹{alert.targetPrice}
              </p>
            </div>

            <button
              onClick={() => deleteAlert(alert._id)}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
