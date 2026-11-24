import { describe, expect, it } from "vitest";
import {
  COMPOUNDS,
  correctFormulationExercise,
  displaySystematic,
  generateFormulationExercise,
  stockName,
  type BinaryCompound,
  type Compound,
  type Nomenclature,
} from "./formulation";

function compound(formula: string): Compound {
  const c = COMPOUNDS.find((x) => x.formula === formula);
  if (!c) throw new Error(`No hi ha ${formula}`);
  return c;
}

const binary = (formula: string) => compound(formula) as BinaryCompound;

describe("compound list", () => {
  it("has no duplicate formulas", () => {
    const formulas = COMPOUNDS.map((c) => c.formula);
    expect(new Set(formulas).size).toBe(formulas.length);
  });
});

describe("names", () => {
  it.each([
    ["Fe2O3", "triòxid de diferro", "òxid de ferro(III)"],
    ["FeO", "monòxid de ferro", "òxid de ferro(II)"],
    ["Na2O", "monòxid de disodi", "òxid de sodi"],
    ["Al2O3", "triòxid de dialumini", "òxid d'alumini"],
    ["CO2", "diòxid de carboni", "òxid de carboni(IV)"],
    ["N2O5", "pentaòxid de dinitrogen", "òxid de nitrogen(V)"],
    ["Cl2O7", "heptaòxid de diclor", "òxid de clor(VII)"],
    ["SO3", "triòxid de sofre", "òxid de sofre(VI)"],
    ["SnO2", "diòxid d'estany", "òxid d'estany(IV)"],
    ["Cu2O", "monòxid de dicoure", "òxid de coure(I)"],
    ["HgO", "monòxid de mercuri", "òxid de mercuri(II)"],
    ["Ag2O", "monòxid de diplata", "òxid de plata"],
    ["NaH", "hidrur de sodi", "hidrur de sodi"],
    ["CaH2", "dihidrur de calci", "hidrur de calci"],
    ["FeH3", "trihidrur de ferro", "hidrur de ferro(III)"],
    ["HCl", "clorur d'hidrogen", "clorur d'hidrogen"],
    ["H2S", "sulfur de dihidrogen", "sulfur d'hidrogen"],
    ["NaCl", "clorur de sodi", "clorur de sodi"],
    ["FeCl3", "triclorur de ferro", "clorur de ferro(III)"],
    ["Al2S3", "trisulfur de dialumini", "sulfur d'alumini"],
    ["PbI2", "diiodur de plom", "iodur de plom(II)"],
    ["Mg3N2", "dinitrur de trimagnesi", "nitrur de magnesi"],
    ["CCl4", "tetraclorur de carboni", "clorur de carboni(IV)"],
    ["SF6", "hexafluorur de sofre", "fluorur de sofre(VI)"],
    ["BeCl2", "diclorur de beril·li", "clorur de beril·li"],
  ])("%s: %s / %s", (formula, systematic, stock) => {
    expect(displaySystematic(binary(formula))).toBe(systematic);
    expect(stockName(binary(formula))).toBe(stock);
  });
});

function grade(direction: "to-name" | "to-formula", nomenclature: Nomenclature, formula: string, text: string) {
  return correctFormulationExercise({ direction, nomenclature, compound: compound(formula) }, { text }).ok;
}

describe("grading names", () => {
  it("is lenient with accents, case, spaces and elision", () => {
    expect(grade("to-name", "systematic", "Fe2O3", "trioxid de diferro")).toBe(true);
    expect(grade("to-name", "stock", "Fe2O3", "Òxid de ferro (III)")).toBe(true);
    expect(grade("to-name", "stock", "Fe2O3", "oxid de ferro(iii)")).toBe(true);
    expect(grade("to-name", "stock", "Al2O3", "oxid de alumini")).toBe(true);
    expect(grade("to-name", "systematic", "BeCl2", "diclorur de berilli")).toBe(true);
  });

  it("accepts the optional «mono» and both pentaòxid/pentòxid", () => {
    expect(grade("to-name", "systematic", "CaO", "òxid de calci")).toBe(true);
    expect(grade("to-name", "systematic", "NaCl", "monoclorur de sodi")).toBe(true);
    expect(grade("to-name", "systematic", "N2O5", "pentòxid de dinitrogen")).toBe(true);
  });

  it("rejects the wrong numeral or the wrong nomenclature", () => {
    expect(grade("to-name", "stock", "Fe2O3", "òxid de ferro(II)")).toBe(false);
    expect(grade("to-name", "stock", "Fe2O3", "triòxid de diferro")).toBe(false);
    expect(grade("to-name", "stock", "Fe2O3", "")).toBe(false);
  });

  it("accepts common or systematic names for special hydrides", () => {
    expect(grade("to-name", "any", "NH3", "amoniac")).toBe(true);
    expect(grade("to-name", "any", "NH3", "trihidrur de nitrogen")).toBe(true);
  });
});

describe("grading formulas", () => {
  it("accepts digits, subscripts and spaces but is case-sensitive", () => {
    expect(grade("to-formula", "stock", "Fe2O3", "Fe2O3")).toBe(true);
    expect(grade("to-formula", "stock", "Fe2O3", "Fe₂O₃")).toBe(true);
    expect(grade("to-formula", "stock", "Fe2O3", " Fe2 O3 ")).toBe(true);
    expect(grade("to-formula", "stock", "Fe2O3", "FE2O3")).toBe(false);
    expect(grade("to-formula", "stock", "Fe2O3", "Fe3O2")).toBe(false);
  });

  it("explains crossing and simplifying subscripts", () => {
    const r = correctFormulationExercise(
      { direction: "to-formula", nomenclature: "stock", compound: compound("SnO2") },
      { text: "" },
    );
    expect(r.steps.at(-1)).toBe("Simplifiquem els subíndexs dividint per 2 → SnO₂.");
  });
});

describe("generateFormulationExercise", () => {
  it("never repeats the previous compound and uses «any» only for special hydrides", () => {
    let prev = generateFormulationExercise();
    for (let i = 0; i < 5000; i++) {
      const ex = generateFormulationExercise(prev);
      expect(ex.compound.formula).not.toBe(prev.compound.formula);
      expect(ex.nomenclature === "any").toBe(ex.compound.special);
      prev = ex;
    }
  });
});
