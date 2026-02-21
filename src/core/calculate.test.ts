import { describe, it, expect } from "vitest";
import { calculate } from "./calculate";
import type { CalcInput } from "./types";

describe("calculate()", () => {
  it("KR: base = drop × 10000 × rate, total includes tax", () => {
    const input: CalcInput = {
      country: "KR",
      drop: 0.6,
      rate: 11.7,
      tax: 5000,
      shippingOverseas: 0,
      takers: 0,
      otherFee: 0,
    };

    const r = calculate(input);

    expect(r.base).toBeCloseTo(70200, 5);
    expect(r.total).toBeCloseTo(75200, 5);
    expect(r.warnings).toHaveLength(0);
  });

  it("CN: base = drop × rate", () => {
    const input: CalcInput = {
      country: "CN",
      drop: 10,
      rate: 2465,
      tax: 0,
      shippingOverseas: 0,
      takers: 0,
      otherFee: 0,
    };

    const r = calculate(input);

    expect(r.base).toBeCloseTo(24650, 5);
    expect(r.total).toBeCloseTo(24650, 5);
    expect(r.warnings).toHaveLength(0);
  });

  it("JP: base = drop (rate ignored)", () => {
    const input: CalcInput = {
      country: "JP",
      drop: 112000,
      rate: 0, // will be sanitized anyway; JP ignores rate conceptually
      tax: 6000,
      shippingOverseas: 0,
      takers: 0,
      otherFee: 0,
    };

    const r = calculate(input);

    expect(r.base).toBeCloseTo(112000, 5);
    expect(r.total).toBeCloseTo(118000, 5);
    expect(r.warnings).toHaveLength(0);
  });

  it("Shipping split: shippingOverseas / takers", () => {
    const input: CalcInput = {
      country: "CN",
      drop: 20,
      rate: 2465,
      tax: 0,
      shippingOverseas: 40000,
      takers: 4,
      otherFee: 2000,
    };

    const r = calculate(input);

    // base = 20*2465 = 49300
    // shippingShare = 40000/4 = 10000
    // total = 49300 + 0 + 10000 + 2000 = 61300
    expect(r.shippingShare).toBeCloseTo(10000, 5);
    expect(r.total).toBeCloseTo(61300, 5);
  });

  it("Rate missing for KR/CN triggers warning and base becomes 0", () => {
    const input: CalcInput = {
      country: "KR",
      drop: 1,
      rate: 0, // missing
      tax: 5000,
      shippingOverseas: 0,
      takers: 0,
      otherFee: 0,
    };

    const r = calculate(input);

    expect(r.base).toBe(0);
    expect(r.warnings).toContain("Rate is required for KR/CN");
  });

  it("Negative values are treated as 0", () => {
    const input: CalcInput = {
      country: "CN",
      drop: -10,
      rate: -2465,
      tax: -1,
      shippingOverseas: -999,
      takers: -2,
      otherFee: -50,
    };

    const r = calculate(input);

    expect(r.base).toBe(0);
    expect(r.tax).toBe(0);
    expect(r.shippingShare).toBe(0);
    expect(r.otherFee).toBe(0);
    expect(r.total).toBe(0);

    // Because rate sanitized to 0 for CN -> warning exists
    expect(r.warnings).toContain("Rate is required for KR/CN");
  });
});