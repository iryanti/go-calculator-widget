// src/core/types.ts

export type Country = "KR" | "CN" | "JP";
export type RoundingMode = "none" | "ceil_1000" | "round_1000";

export type CalcInput = {
  country: Country;
  drop: number;
  rate: number | null;

  tax: number;

  shippingOverseas: number;
  takers: number;
  otherFee: number;
};

export type CalcOutput = {
  base: number;
  tax: number;
  shippingShare: number;
  otherFee: number;

  totalRaw: number;
  total: number;

  warnings: string[];
};