import { describe, expect, it } from "vitest";
import { ELEMENTS } from "./elements";
import { EMPTY_ISOTOPE_ANSWERS, correctIsotopeExercise, generateIsotopeExercise } from "./isotopes";

const cl = ELEMENTS.find((e) => e.symbol === "Cl")!;

describe("element isotope data", () => {
  it("has A ≥ Z for every isotope (A = Z only for hydrogen-1)", () => {
    for (const e of ELEMENTS) {
      expect(e.isotopes.length).toBeGreaterThan(0);
      for (const a of e.isotopes) expect(a > e.z || (a === e.z && e.z === 1)).toBe(true);
    }
  });
});

describe("correctIsotopeExercise", () => {
  it("counts particles of an ion", () => {
    const r = correctIsotopeExercise(
      { kind: "particles", element: cl, a: 35, charge: -1 },
      { ...EMPTY_ISOTOPE_ANSWERS, protons: "17", neutrons: "18", electrons: "18" },
    );
    expect(r.ok).toBe(true);
    expect(r.steps).toContain("Neutrons = A − Z = 35 − 17 = 18.");
  });

  it("expects Z electrons for a neutral atom", () => {
    const r = correctIsotopeExercise(
      { kind: "particles", element: cl, a: 37, charge: 0 },
      { ...EMPTY_ISOTOPE_ANSWERS, protons: "17", neutrons: "20", electrons: "18" },
    );
    expect(r.fields.map((f) => f.ok)).toEqual([true, true, false]);
  });

  it("finds Z and A from protons and neutrons", () => {
    const r = correctIsotopeExercise(
      { kind: "notation", element: cl, a: 37, charge: 0 },
      { ...EMPTY_ISOTOPE_ANSWERS, z: "17", a: "37" },
    );
    expect(r.ok).toBe(true);
    expect(r.steps.at(-1)).toBe("L'isòtop s'escriu ³⁷₁₇Cl (clor-37).");
  });
});

describe("generateIsotopeExercise", () => {
  it("uses real isotopes, and ions only in particle exercises", () => {
    let prev = generateIsotopeExercise();
    for (let i = 0; i < 3000; i++) {
      const ex = generateIsotopeExercise(prev);
      expect(ex.element.isotopes).toContain(ex.a);
      if (ex.charge !== 0) {
        expect(ex.kind).toBe("particles");
        expect(ex.element.ions).toContain(ex.charge);
      }
      prev = ex;
    }
  });
});
