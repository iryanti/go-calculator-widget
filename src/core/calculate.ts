// src/core/calculate.ts
import type { CalcInput, CalcOutput } from "./types";

const toNonNegativeNumber = (value: unknown): number => {
  const n = Number(value);
  if (!Number.isFinite(n) || Number.isNaN(n)) return 0;
  return n < 0 ? 0 : n;
};

export function calculate(input: CalcInput): CalcOutput {
  const warnings: string[] = [];

  const drop = toNonNegativeNumber(input.drop);
  const rate = toNonNegativeNumber(input.rate);
  const tax = toNonNegativeNumber(input.tax);

  const shippingOverseas = toNonNegativeNumber(input.shippingOverseas);
  const takers = toNonNegativeNumber(input.takers);
  const otherFee = toNonNegativeNumber(input.otherFee);

  let base = 0;

  if (input.country === "KR") {
    if (!rate) warnings.push("Rate is required for KR/CN");
    base = drop * 10000 * rate;
  } else if (input.country === "CN") {
    if (!rate) warnings.push("Rate is required for KR/CN");
    base = drop * rate;
  } else {
    // JP
    base = drop;
  }

  const shippingShare = takers > 0 ? shippingOverseas / takers : 0;

  const totalRaw = base + tax + shippingShare + otherFee;

  const total = totalRaw;

  return {
    base,
    tax,
    shippingShare,
    otherFee,
    totalRaw,
    total,
    warnings,
  };
}
