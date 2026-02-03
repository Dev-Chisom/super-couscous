"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, ColorType } from "lightweight-charts";
import { useTheme } from "next-themes";
import type { StockPrice } from "@/types";

interface StockChartProps {
  data: StockPrice[];
  height?: number;
  className?: string;
}

export function StockChart({ data, height = 400, className }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: isDark ? "#0a0a0a" : "white" },
        textColor: isDark ? "#ededed" : "#171717",
      },
      grid: {
        vertLines: { color: isDark ? "#262626" : "#f0f0f0" },
        horzLines: { color: isDark ? "#262626" : "#f0f0f0" },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const formattedData = data.map((price) => {
      const date = new Date(price.time);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      return {
        time: dateStr as any,
        open: price.open,
        high: price.high,
        low: price.low,
        close: price.close,
      };
    });

    candlestickSeries.setData(formattedData);

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, [height, isDark]);

  useEffect(() => {
    if (!seriesRef.current || !data.length) return;

    const formattedData = data.map((price) => {
      const date = new Date(price.time);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      return {
        time: dateStr as any,
        open: price.open,
        high: price.high,
        low: price.low,
        close: price.close,
      };
    });

    seriesRef.current.setData(formattedData);
  }, [data]);

  return <div ref={chartContainerRef} className={className} />;
}
