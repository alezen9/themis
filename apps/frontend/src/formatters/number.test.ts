import { describe, expect, it } from "vitest";

import { formatNumber } from "./number";

describe("formatNumber", () => {
  it("formats standard numbers with two decimals by default", () => {
    expect(formatNumber(12)).toBe("12.00");
    expect(formatNumber(1234.567)).toBe("1'234.57");
    expect(formatNumber(557_066.67)).toBe("557'066.67");
  });

  it("uses engineering notation for very large and very small numbers", () => {
    expect(formatNumber(1_000_000)).toBe("1e6");
    expect(formatNumber(1_230_000)).toBe("1.23e6");
    expect(formatNumber(0.00123)).toBe("1.23e-3");
    expect(formatNumber(0.000123)).toBe("123e-6");
  });

  it("formats dimensions as integers or fixed two-decimal values", () => {
    expect(formatNumber(300, "dimension")).toBe("300");
    expect(formatNumber(6.3, "dimension")).toBe("6.30");
    expect(formatNumber(5381, "dimension")).toBe("5'381");
    expect(formatNumber(5381.25, "dimension")).toBe("5'381.25");
  });
});
