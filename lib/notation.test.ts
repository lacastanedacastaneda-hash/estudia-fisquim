import { describe, expect, it } from "vitest";
import { chargeValue, formatCharge, formatNumber, formulaText, ionSymbol, isotopeText } from "./notation";

describe("notation", () => {
  it("formats charges", () => {
    expect(formatCharge(2)).toBe("2+");
    expect(formatCharge(1)).toBe("+");
    expect(formatCharge(-1)).toBe("−");
    expect(formatCharge(-3)).toBe("3−");
    expect(chargeValue(2)).toBe("+2");
    expect(chargeValue(-1)).toBe("−1");
  });

  it("writes ion and isotope symbols with superscripts and subscripts", () => {
    expect(ionSymbol("Ca", 2)).toBe("Ca²⁺");
    expect(ionSymbol("Cl", -1)).toBe("Cl⁻");
    expect(ionSymbol("N", -3)).toBe("N³⁻");
    expect(ionSymbol("Na", 0)).toBe("Na");
    expect(isotopeText("Cl", 37, 17)).toBe("³⁷₁₇Cl");
    expect(isotopeText("Cl", 35, 17, -1)).toBe("³⁵₁₇Cl⁻");
  });

  it("formats numbers with a decimal comma and a real minus sign", () => {
    expect(formatNumber(35.484)).toBe("35,48");
    expect(formatNumber(2653)).toBe("2653");
    expect(formatNumber(-140)).toBe("−140");
  });

  it("turns formula digits into subscripts", () => {
    expect(formulaText("Al2(SO4)3")).toBe("Al₂(SO₄)₃");
  });
});
