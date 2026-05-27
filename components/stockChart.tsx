"use client";

import {
  createChart,
  ColorType,
  LineSeries,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

export default function StockChart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: 800,
      height: 400,

      layout: {
        background: {
          type: ColorType.Solid,
          color: "#0f172a",
        },
        textColor: "#ffffff",
      },

      grid: {
        vertLines: {
          color: "#1e293b",
        },
        horzLines: {
          color: "#1e293b",
        },
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
  color: "#22c55e",
  lineWidth: 3,
});

    lineSeries.setData([
      { time: "2025-05-01", value: 2400 },
      { time: "2025-05-02", value: 2410 },
      { time: "2025-05-03", value: 2390 },
      { time: "2025-05-04", value: 2450 },
      { time: "2025-05-05", value: 2470 },
    ]);

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div className="flex justify-center items-center p-10">
      <div ref={chartContainerRef} />
    </div>
  );
}