"use client";

import { useState } from "react";

interface Props {
  symbol: string;
}

export default function AlertForm({
  symbol,
}: Props) {
  const [targetPrice, setTargetPrice] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function saveAlert() {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/alert",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            symbol,
            targetPrice:
              Number(targetPrice),
          }),
        }
      );

      const data =
        await res.json();

      setMessage(
        "Alert created successfully"
      );

      console.log(data);

    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to create alert"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 bg-slate-800 rounded-2xl p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">
        Create Alert
      </h2>

      <input
        type="number"
        placeholder="Target Price"
        value={targetPrice}
        onChange={(e) =>
          setTargetPrice(
            e.target.value
          )
        }
        className="w-full bg-slate-900 px-4 py-3 rounded-xl outline-none"
      />

      <button
        onClick={saveAlert}
        disabled={loading}
        className="mt-4 bg-green-500 px-5 py-3 rounded-xl font-semibold"
      >
        {loading
          ? "Saving..."
          : "Save Alert"}
      </button>

      {message && (
        <p className="mt-3 text-slate-300">
          {message}
        </p>
      )}
    </div>
  );
}