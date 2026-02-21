import { useState } from "react";
import type { Country } from "../../core/types";

export function useLiveRate() {
  const [rate, setRate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const todayKey = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  async function fetchRate(country: Country) {
    if (country === "JP") return;

    const base = country === "KR" ? "KRW" : "CNY";
    const cacheKey = `go_rate_${base}_${todayKey()}`;

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setRate(cached);
      setUpdatedAt(new Date().toLocaleString("en-GB"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://open.er-api.com/v6/latest/${base}`
      );
      const data = await res.json();

      const idr = data?.rates?.IDR;
      if (!idr) throw new Error("Rate not found");

      const formatted =
        country === "KR"
          ? idr.toFixed(2)
          : Math.round(idr).toString();

      setRate(formatted);
      setUpdatedAt(new Date().toLocaleString("en-GB"));
      localStorage.setItem(cacheKey, formatted);
    } catch {
      setError("Failed to fetch rate");
    } finally {
      setLoading(false);
    }
  }

  return {
    rate,
    setRate,
    loading,
    error,
    updatedAt,
    fetchRate,
  };
}