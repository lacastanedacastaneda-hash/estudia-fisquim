import { describe, expect, it } from "vitest";
import { ELEMENTS } from "./elements";
import { EMPTY_PT_ANSWERS, COMMON_Z, correctPTExercise, generatePTExercise } from "./periodic-quiz";
import { COMPOUNDS } from "./formulation";
import { PERIODIC_TABLE, articled, byZ, massText, normalizeName, valencesText, type Category } from "./periodic-table";

const bySymbol = (symbol: string) => PERIODIC_TABLE.find((e) => e.symbol === symbol)!;

describe("periodic table data", () => {
  it("has 118 elements with unique symbols", () => {
    expect(PERIODIC_TABLE).toHaveLength(118);
    expect(new Set(PERIODIC_TABLE.map((e) => e.symbol)).size).toBe(118);
  });

  it.each<[string, number, number | null, Category]>([
    ["H", 1, 1, "nonmetal"],
    ["He", 1, 18, "noble-gas"],
    ["B", 2, 13, "metalloid"],
    ["Al", 3, 13, "post-transition"],
    ["K", 4, 1, "alkali"],
    ["Sc", 4, 3, "transition"],
    ["Zn", 4, 12, "transition"],
    ["Se", 4, 16, "nonmetal"],
    ["Te", 5, 16, "metalloid"],
    ["I", 5, 17, "halogen"],
    ["Ba", 6, 2, "alkaline-earth"],
    ["La", 6, null, "lanthanide"],
    ["Lu", 6, null, "lanthanide"],
    ["Hf", 6, 4, "transition"],
    ["Pb", 6, 14, "post-transition"],
    ["Rn", 6, 18, "noble-gas"],
    ["Ac", 7, null, "actinide"],
    ["Rf", 7, 4, "transition"],
    ["Og", 7, 18, "noble-gas"],
  ])("%s: period %i, group %s, %s", (symbol, period, group, category) => {
    const e = bySymbol(symbol);
    expect([e.period, e.group, e.category]).toEqual([period, group, category]);
  });

  it("never puts two elements in the same cell", () => {
    const cells = PERIODIC_TABLE.filter((e) => e.group !== null).map((e) => `${e.period}-${e.group}`);
    expect(new Set(cells).size).toBe(cells.length);
    expect(cells).toHaveLength(118 - 30);
  });

  it("matches the names and symbols of the exercise element data", () => {
    for (const e of ELEMENTS) {
      expect(byZ(e.z).symbol).toBe(e.symbol);
      expect(byZ(e.z).name).toBe(e.name);
    }
  });

  it("has valences for every element except noble gases and elements from Z = 104", () => {
    for (const e of PERIODIC_TABLE) {
      const expectNone = e.category === "noble-gas" || e.z >= 104;
      expect(e.valences.length === 0).toBe(expectNone);
      expect(new Set(e.valences).size).toBe(e.valences.length);
      expect(e.valences).not.toContain(0);
    }
  });

  it("shows valences with signs, or why there are none", () => {
    expect(valencesText(bySymbol("Cl"))).toBe("+1, +3, +5, +7, −1");
    expect(valencesText(bySymbol("Fe"))).toBe("+2, +3");
    expect(valencesText(bySymbol("Ne"))).toContain("gas noble");
    expect(valencesText(bySymbol("Og"))).toContain("gas noble");
    expect(valencesText(bySymbol("Rf"))).toContain("Sense dades");
  });

  it("agrees with the ion charges and the formulation data", () => {
    for (const e of ELEMENTS) {
      for (const charge of e.ions) expect(byZ(e.z).valences, `${e.symbol} ${charge}`).toContain(charge);
    }
    for (const c of COMPOUNDS) {
      if (c.special) continue;
      const cation = bySymbol(c.cation.symbol);
      // Les valències positives decideixen si el nom de Stock porta xifra romana: han de coincidir.
      expect(cation.valences.filter((v) => v > 0), c.cation.symbol).toEqual(c.cation.valences);
      expect(bySymbol(c.anion.symbol).valences, c.anion.symbol).toContain(-c.anion.charge);
    }
  });

  it("shows masses with a comma, and in parentheses when there is no stable isotope", () => {
    expect(massText(bySymbol("Fe"))).toBe("55,845");
    expect(massText(bySymbol("Tc"))).toBe("(98)");
    expect(massText(bySymbol("U"))).toBe("238,03");
  });
});

describe("Catalan helpers", () => {
  it("adds the right article", () => {
    expect(articled("Ferro")).toEqual({ el: "el ferro", de: "del ferro" });
    expect(articled("Or")).toEqual({ el: "l'or", de: "de l'or" });
    expect(articled("Plata")).toEqual({ el: "la plata", de: "de la plata" });
    expect(articled("Hidrogen").de).toBe("de l'hidrogen");
  });

  it("compares names ignoring accents, case and the middle dot", () => {
    expect(normalizeName("  Beril.li ")).toBe(normalizeName("Beril·li"));
    expect(normalizeName("Niquel")).toBe(normalizeName("Níquel"));
  });
});

describe("periodic table quiz", () => {
  const answers = EMPTY_PT_ANSWERS;

  it("requires the right capitalization for symbols", () => {
    const r = correctPTExercise({ kind: "symbol", z: 27 }, { ...answers, text: "CO" });
    expect(r.ok).toBe(false);
    expect(r.steps.at(-1)).toContain("majúscules");
    expect(correctPTExercise({ kind: "symbol", z: 26 }, { ...answers, text: "Fe" }).ok).toBe(true);
  });

  it("accepts names without accents or middle dot, and alternative names", () => {
    expect(correctPTExercise({ kind: "name", z: 4 }, { ...answers, text: "beril.li" }).ok).toBe(true);
    expect(correctPTExercise({ kind: "name", z: 74 }, { ...answers, text: "wolframi" }).ok).toBe(true);
  });

  it("grades group and period, type, and locating on the table", () => {
    expect(correctPTExercise({ kind: "position", z: 26 }, { ...answers, group: "8", period: "4" }).ok).toBe(true);
    const h = correctPTExercise({ kind: "type", z: 1 }, { ...answers, type: "metall" });
    expect(h.ok).toBe(false);
    expect(h.steps.at(-1)).toContain("L'hidrogen és una excepció");
    const locate = correctPTExercise({ kind: "locate", z: 79 }, { ...answers, picked: 47 });
    expect(locate.ok).toBe(false);
    expect(locate.steps).toContain("Has tocat la plata (Ag), que és al període 5 (fila) i al grup 11 (columna).");
  });

  it("only asks about common elements, and never asks the group of an f-block element", () => {
    let prev = generatePTExercise();
    for (let i = 0; i < 5000; i++) {
      const ex = generatePTExercise(prev);
      expect(COMMON_Z).toContain(ex.z);
      if (ex.kind === "position") expect(byZ(ex.z).group).not.toBeNull();
      expect(ex.z).not.toBe(prev.z);
      prev = ex;
    }
  });
});
