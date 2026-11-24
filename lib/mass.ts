import { field, isClose, makeCorrection, type Correction } from "./exercise";
import { formatFixed, formatNumber, formulaText, superscript } from "./notation";
import { pick, randInt } from "./random";

// Lògica del mòdul de massa atòmica i molecular.

/** Abundàncies naturals (%), arrodonides perquè sumin 100. Massa de cada isòtop ≈ A. */
const NATURAL_ABUNDANCE: { symbol: string; name: string; of: string; isotopes: { a: number; pct: number }[] }[] = [
  { symbol: "Li", name: "liti", of: "del liti", isotopes: [{ a: 6, pct: 7.6 }, { a: 7, pct: 92.4 }] },
  { symbol: "C", name: "carboni", of: "del carboni", isotopes: [{ a: 12, pct: 98.9 }, { a: 13, pct: 1.1 }] },
  { symbol: "Ne", name: "neó", of: "del neó", isotopes: [{ a: 20, pct: 90.5 }, { a: 21, pct: 0.3 }, { a: 22, pct: 9.2 }] },
  { symbol: "Mg", name: "magnesi", of: "del magnesi", isotopes: [{ a: 24, pct: 79.0 }, { a: 25, pct: 10.0 }, { a: 26, pct: 11.0 }] },
  { symbol: "Cl", name: "clor", of: "del clor", isotopes: [{ a: 35, pct: 75.8 }, { a: 37, pct: 24.2 }] },
  { symbol: "K", name: "potassi", of: "del potassi", isotopes: [{ a: 39, pct: 93.3 }, { a: 41, pct: 6.7 }] },
  { symbol: "Cu", name: "coure", of: "del coure", isotopes: [{ a: 63, pct: 69.2 }, { a: 65, pct: 30.8 }] },
  { symbol: "Br", name: "brom", of: "del brom", isotopes: [{ a: 79, pct: 50.7 }, { a: 81, pct: 49.3 }] },
  { symbol: "Rb", name: "rubidi", of: "del rubidi", isotopes: [{ a: 85, pct: 72.2 }, { a: 87, pct: 27.8 }] },
  { symbol: "Ag", name: "plata", of: "de la plata", isotopes: [{ a: 107, pct: 51.8 }, { a: 109, pct: 48.2 }] },
];

/** Masses atòmiques (u) amb un decimal, com a les taules de 3r d'ESO. */
export const ATOMIC_MASS: Record<string, number> = {
  H: 1.0, C: 12.0, N: 14.0, O: 16.0, Na: 23.0, Mg: 24.3, Al: 27.0, P: 31.0, S: 32.1,
  Cl: 35.5, K: 39.1, Ca: 40.1, Fe: 55.8, Cu: 63.5, Zn: 65.4, Br: 79.9, Ag: 107.9,
};

const COMPOUNDS: { formula: string; name: string }[] = [
  { formula: "H2O", name: "aigua" },
  { formula: "CO2", name: "diòxid de carboni" },
  { formula: "SO2", name: "diòxid de sofre" },
  { formula: "NH3", name: "amoníac" },
  { formula: "CH4", name: "metà" },
  { formula: "O2", name: "oxigen" },
  { formula: "NaCl", name: "clorur de sodi" },
  { formula: "KBr", name: "bromur de potassi" },
  { formula: "MgCl2", name: "clorur de magnesi" },
  { formula: "CaCl2", name: "clorur de calci" },
  { formula: "ZnCl2", name: "clorur de zinc" },
  { formula: "NaOH", name: "hidròxid de sodi" },
  { formula: "Ca(OH)2", name: "hidròxid de calci" },
  { formula: "Mg(OH)2", name: "hidròxid de magnesi" },
  { formula: "Fe(OH)3", name: "hidròxid de ferro(III)" },
  { formula: "Fe2O3", name: "òxid de ferro(III)" },
  { formula: "HNO3", name: "àcid nítric" },
  { formula: "H2SO4", name: "àcid sulfúric" },
  { formula: "H3PO4", name: "àcid fosfòric" },
  { formula: "CaCO3", name: "carbonat de calci" },
  { formula: "Na2CO3", name: "carbonat de sodi" },
  { formula: "KNO3", name: "nitrat de potassi" },
  { formula: "AgNO3", name: "nitrat de plata" },
  { formula: "CuSO4", name: "sulfat de coure(II)" },
  { formula: "Cu(NO3)2", name: "nitrat de coure(II)" },
  { formula: "Al2(SO4)3", name: "sulfat d'alumini" },
  { formula: "C2H5OH", name: "etanol" },
  { formula: "C6H12O6", name: "glucosa" },
  { formula: "C12H22O11", name: "sacarosa" },
];

/** Compta els àtoms de cada element, en ordre d'aparició. Admet parèntesis: Al2(SO4)3. */
export function parseFormula(formula: string): [string, number][] {
  const stack: [string, number][][] = [[]];
  const re = /([A-Z][a-z]?)(\d*)|\(|\)(\d*)/g;
  let pos = 0;
  for (let m = re.exec(formula); m; m = re.exec(formula)) {
    if (m.index !== pos) throw new Error(`Fórmula no vàlida: ${formula}`);
    pos = re.lastIndex;
    const top = stack[stack.length - 1];
    if (m[1]) {
      top.push([m[1], Number(m[2] || 1)]);
    } else if (m[0] === "(") {
      stack.push([]);
    } else {
      const group = stack.pop();
      if (!group || stack.length === 0) throw new Error(`Fórmula no vàlida: ${formula}`);
      const k = Number(m[3] || 1);
      stack[stack.length - 1].push(...group.map(([el, n]): [string, number] => [el, n * k]));
    }
  }
  if (pos !== formula.length || stack.length !== 1) throw new Error(`Fórmula no vàlida: ${formula}`);

  const counts = new Map<string, number>();
  for (const [el, n] of stack[0]) counts.set(el, (counts.get(el) ?? 0) + n);
  return [...counts];
}

export type MassExercise =
  | {
      /** Massa atòmica a partir dels isòtops i les seves abundàncies. */
      kind: "average";
      symbol: string;
      name: string;
      /** "del clor", "de la plata". */
      of: string;
      isotopes: { a: number; pct: number }[];
    }
  | {
      /** Abundàncies de dos isòtops d'un element hipotètic X a partir de la massa atòmica. */
      kind: "abundance";
      a1: number;
      a2: number;
      /** Abundància (%) del primer isòtop. */
      x: number;
    }
  | {
      kind: "molecular";
      formula: string;
      name: string;
    };

export type MassAnswers = {
  mass: string;
  pct1: string;
  pct2: string;
};

export const EMPTY_MASS_ANSWERS: MassAnswers = { mass: "", pct1: "", pct2: "" };

function sameExercise(a: MassExercise, b: MassExercise): boolean {
  if (a.kind === "average" && b.kind === "average") return a.symbol === b.symbol;
  if (a.kind === "molecular" && b.kind === "molecular") return a.formula === b.formula;
  return false;
}

export function generateMassExercise(previous?: MassExercise): MassExercise {
  for (;;) {
    const r = Math.random();
    let exercise: MassExercise;
    if (r < 0.4) {
      const e = pick(NATURAL_ABUNDANCE);
      exercise = { kind: "average", ...e };
    } else if (r < 0.6) {
      const a1 = randInt(10, 120);
      const x = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90, 95]);
      exercise = { kind: "abundance", a1, a2: a1 + pick([1, 2]), x };
    } else {
      const c = pick(COMPOUNDS);
      exercise = { kind: "molecular", formula: c.formula, name: c.name };
    }
    if (!previous || !sameExercise(previous, exercise)) return exercise;
  }
}

/** Massa atòmica mitjana (exacta) d'un exercici "average". */
export function averageMass(isotopes: { a: number; pct: number }[]): number {
  return isotopes.reduce((sum, i) => sum + i.a * i.pct, 0) / 100;
}

/** Massa atòmica de l'element X d'un exercici "abundance". */
export function abundanceMass(a1: number, a2: number, x: number): number {
  return (a1 * x + a2 * (100 - x)) / 100;
}

export function molecularMass(formula: string): number {
  const total = parseFormula(formula).reduce((sum, [el, n]) => sum + n * ATOMIC_MASS[el], 0);
  return Math.round(total * 10) / 10;
}

const u = (n: number, decimals = 2) => `${formatNumber(n, decimals)} u`;

export function correctMassExercise(ex: MassExercise, answers: MassAnswers): Correction {
  if (ex.kind === "average") {
    const m = averageMass(ex.isotopes);
    const products = ex.isotopes.map((i) => i.a * i.pct);
    return makeCorrection(
      [field("Massa atòmica", u(m), answers.mass, isClose(answers.mass, m, 0.05))],
      [
        "La massa atòmica és la mitjana ponderada de les masses dels isòtops, segons la seva abundància (%).",
        `M = (${ex.isotopes.map((i) => `${i.a} · ${formatNumber(i.pct, 1)}`).join(" + ")}) / 100`,
        `M = (${products.map((p) => formatNumber(p)).join(" + ")}) / 100 = ${formatNumber(
          products.reduce((s, p) => s + p, 0),
        )} / 100 = ${u(m)}`,
        `La massa atòmica ${ex.of} és ${u(m)}. Queda més a prop de l'isòtop més abundant.`,
      ],
    );
  }

  if (ex.kind === "abundance") {
    const { a1, a2, x } = ex;
    const m = abundanceMass(a1, a2, x);
    const lhs = Math.round(m * 100);
    return makeCorrection(
      [
        field(`Abundància de ${superscript(String(a1))}X`, `${x} %`, answers.pct1, isClose(answers.pct1, x, 0.5)),
        field(
          `Abundància de ${superscript(String(a2))}X`,
          `${100 - x} %`,
          answers.pct2,
          isClose(answers.pct2, 100 - x, 0.5),
        ),
      ],
      [
        `Si l'abundància de ${superscript(String(a1))}X és x %, la de ${superscript(String(a2))}X és (100 − x) %, perquè entre els dos sumen el 100 %.`,
        `M = (${a1} · x + ${a2} · (100 − x)) / 100 → ${formatNumber(m)} · 100 = ${a1}x + ${a2}(100 − x)`,
        `${lhs} = ${a1}x + ${a2 * 100} − ${a2}x`,
        `${lhs} − ${a2 * 100} = (${a1} − ${a2})x → ${formatNumber(lhs - a2 * 100)} = ${formatNumber(a1 - a2)}x`,
        `x = (${formatNumber(lhs - a2 * 100)}) / (${formatNumber(a1 - a2)}) = ${x}`,
        `${superscript(String(a1))}X: ${x} % i ${superscript(String(a2))}X: 100 − ${x} = ${100 - x} %.`,
      ],
    );
  }

  const counts = parseFormula(ex.formula);
  const m = molecularMass(ex.formula);
  const parts = counts.map(([el, n]) => ({ el, n, mass: ATOMIC_MASS[el], subtotal: n * ATOMIC_MASS[el] }));
  return makeCorrection(
    [field("Massa molecular", u(m, 1), answers.mass, isClose(answers.mass, m, 0.15))],
    [
      `Comptem els àtoms de cada element a ${formulaText(ex.formula)}: ${parts.map((p) => `${p.el}: ${p.n}`).join(", ")}.` +
        (ex.formula.includes("(")
          ? " El subíndex de després del parèntesi multiplica tot el que hi ha a dins."
          : ""),
      `Multipliquem cada nombre d'àtoms per la seva massa atòmica: ${parts
        .map((p) => `${p.el}: ${p.n} · ${formatFixed(p.mass, 1)} = ${formatFixed(p.subtotal, 1)} u`)
        .join("; ")}.`,
      `Sumem: ${parts.map((p) => formatFixed(p.subtotal, 1)).join(" + ")} = ${formatFixed(m, 1)} u.`,
    ],
  );
}
