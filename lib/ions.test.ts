import { describe, expect, it } from "vitest";
import { ELEMENTS } from "./elements";
import { EMPTY_ION_ANSWERS, correctIonExercise, generateIonExercise, parseCharge } from "./ions";

const el = (symbol: string) => ELEMENTS.find((e) => e.symbol === symbol)!;

describe("parseCharge", () => {
  it.each([
    ["2+", 2],
    ["+2", 2],
    ["2-", -2],
    ["-2", -2],
    ["2−", -2],
    ["+", 1],
    ["-", -1],
    ["−", -1],
    ["3", 3],
    [" 1 - ", -1],
    ["+2+", null],
    ["0", null],
    ["a", null],
    ["", null],
  ])("%j → %j", (input, expected) => {
    expect(parseCharge(input)).toBe(expected);
  });
});

describe("correctIonExercise", () => {
  it("grades protons, electrons and type", () => {
    const ok = correctIonExercise(
      { kind: "particles", element: el("Ca"), charge: 2 },
      { ...EMPTY_ION_ANSWERS, protons: "20", electrons: "18", type: "cation" },
    );
    expect(ok.ok).toBe(true);

    const wrong = correctIonExercise(
      { kind: "particles", element: el("O"), charge: -2 },
      { ...EMPTY_ION_ANSWERS, protons: "8", electrons: "6", type: "anion" },
    );
    expect(wrong.ok).toBe(false);
    expect(wrong.fields.map((f) => f.ok)).toEqual([true, false, true]);
    expect(wrong.steps).toContain("Electrons = Z + 2 = 8 + 2 = 10.");
  });

  it("grades the charge from protons and electrons", () => {
    const r = correctIonExercise(
      { kind: "charge", element: el("O"), charge: -2 },
      { ...EMPTY_ION_ANSWERS, charge: "2-", type: "anion" },
    );
    expect(r.ok).toBe(true);
  });
});

describe("generateIonExercise", () => {
  it("only uses real ion charges and never repeats the previous exercise", () => {
    let prev = generateIonExercise();
    for (let i = 0; i < 2000; i++) {
      const ex = generateIonExercise(prev);
      expect(ex.element.ions).toContain(ex.charge);
      expect(ex.element.z === prev.element.z && ex.charge === prev.charge).toBe(false);
      prev = ex;
    }
  });
});
