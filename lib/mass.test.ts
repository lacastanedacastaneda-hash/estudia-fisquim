import { describe, expect, it } from "vitest";
import {
  ATOMIC_MASS,
  EMPTY_MASS_ANSWERS,
  abundanceMass,
  correctMassExercise,
  generateMassExercise,
  molecularMass,
  parseFormula,
} from "./mass";
import { formatNumber } from "./notation";

describe("parseFormula", () => {
  it("counts atoms, multiplying groups in parentheses", () => {
    expect(parseFormula("Al2(SO4)3")).toEqual([["Al", 2], ["S", 3], ["O", 12]]);
    expect(parseFormula("Ca(OH)2")).toEqual([["Ca", 1], ["O", 2], ["H", 2]]);
    expect(parseFormula("Cu(NO3)2")).toEqual([["Cu", 1], ["N", 2], ["O", 6]]);
  });

  it("merges repeated elements", () => {
    expect(parseFormula("C2H5OH")).toEqual([["C", 2], ["H", 6], ["O", 1]]);
  });

  it("rejects malformed formulas", () => {
    expect(() => parseFormula("Ca(OH")).toThrow();
    expect(() => parseFormula("CaOH)2")).toThrow();
    expect(() => parseFormula("ca")).toThrow();
  });
});

describe("molecularMass", () => {
  it.each([
    ["H2SO4", 98.1],
    ["Al2(SO4)3", 342.3],
    ["C6H12O6", 180],
    ["Ca(OH)2", 74.1],
  ])("%s → %d u", (formula, mass) => {
    expect(molecularMass(formula)).toBe(mass);
  });
});

describe("correctMassExercise", () => {
  it("accepts an average atomic mass rounded to one decimal", () => {
    const r = correctMassExercise(
      {
        kind: "average",
        symbol: "Cl",
        name: "clor",
        of: "del clor",
        isotopes: [
          { a: 35, pct: 75.8 },
          { a: 37, pct: 24.2 },
        ],
      },
      { ...EMPTY_MASS_ANSWERS, mass: "35,5" },
    );
    expect(r.ok).toBe(true);
    expect(r.steps).toContain("M = (2653 + 895,4) / 100 = 3548,4 / 100 = 35,48 u");
  });

  it("solves the abundances of two isotopes", () => {
    const r = correctMassExercise(
      { kind: "abundance", a1: 63, a2: 65, x: 70 },
      { ...EMPTY_MASS_ANSWERS, pct1: "70", pct2: "30 %" },
    );
    expect(r.ok).toBe(true);
    expect(r.steps).toContain("x = (−140) / (−2) = 70");
  });

  it("grades molecular mass", () => {
    const ex = { kind: "molecular" as const, formula: "Ca(OH)2", name: "hidròxid de calci" };
    expect(correctMassExercise(ex, { ...EMPTY_MASS_ANSWERS, mass: "74,1" }).ok).toBe(true);
    expect(correctMassExercise(ex, { ...EMPTY_MASS_ANSWERS, mass: "57,1" }).ok).toBe(false);
  });
});

describe("generateMassExercise", () => {
  it("produces solvable exercises with known data", () => {
    let prev = generateMassExercise();
    for (let i = 0; i < 5000; i++) {
      const ex = generateMassExercise(prev);
      prev = ex;
      if (ex.kind === "molecular") {
        for (const [el] of parseFormula(ex.formula)) expect(ATOMIC_MASS[el]).toBeDefined();
      } else if (ex.kind === "average") {
        expect(ex.isotopes.reduce((s, i) => s + i.pct, 0)).toBeCloseTo(100, 9);
      } else {
        // La massa es mostra arrodonida: x s'ha de poder recuperar exactament a partir d'aquest valor.
        const shown = Number(formatNumber(abundanceMass(ex.a1, ex.a2, ex.x)).replace(",", "."));
        expect((100 * shown - 100 * ex.a2) / (ex.a1 - ex.a2)).toBeCloseTo(ex.x, 6);
      }
    }
  });
});
