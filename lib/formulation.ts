import { field, makeCorrection, type Correction } from "./exercise";
import { formulaText } from "./notation";
import { articled } from "./periodic-table";
import { pick } from "./random";

// Formulació inorgànica de 3r d'ESO: òxids, hidrurs i sals binàries,
// amb nomenclatura sistemàtica (prefixos) i de Stock.

/** Element que va a l'esquerra de la fórmula (el menys electronegatiu). */
type Cation = {
  symbol: string;
  name: string;
  /** Tots els nombres d'oxidació positius habituals: decideixen si Stock porta xifra romana. */
  valences: number[];
  metal: boolean;
};

/** Element que va a la dreta de la fórmula, amb el seu nombre d'oxidació negatiu (en valor absolut). */
type Anion = { symbol: string; name: string; charge: number; /** Nom de l'element: "oxigen", "clor"… */ element: string };

export type CompoundType = "oxide" | "metal-hydride" | "nonmetal-hydride" | "binary-salt";

export type BinaryCompound = {
  special: false;
  type: CompoundType;
  cation: Cation;
  /** Nombre d'oxidació del catió en aquest compost. */
  valence: number;
  anion: Anion;
  /** Subíndexs: catió_a anió_b. */
  a: number;
  b: number;
  formula: string;
};

/** Hidrurs amb nom comú (NH₃, CH₄…): no tenen nom de Stock. */
export type SpecialCompound = {
  special: true;
  type: "special-hydride";
  formula: string;
  common: string;
  systematic: string | null;
};

export type Compound = BinaryCompound | SpecialCompound;

export type Nomenclature = "systematic" | "stock" | "any";

export type FormulationExercise = {
  direction: "to-name" | "to-formula";
  nomenclature: Nomenclature;
  compound: Compound;
};

export type FormulationAnswers = { text: string };
export const EMPTY_FORMULATION_ANSWERS: FormulationAnswers = { text: "" };

const c = (symbol: string, name: string, valences: number[], metal: boolean): Cation => ({
  symbol,
  name,
  valences,
  metal,
});

const METALS = {
  Li: c("Li", "liti", [1], true),
  Na: c("Na", "sodi", [1], true),
  K: c("K", "potassi", [1], true),
  Ag: c("Ag", "plata", [1], true),
  Be: c("Be", "beril·li", [2], true),
  Mg: c("Mg", "magnesi", [2], true),
  Ca: c("Ca", "calci", [2], true),
  Ba: c("Ba", "bari", [2], true),
  Zn: c("Zn", "zinc", [2], true),
  Al: c("Al", "alumini", [3], true),
  Fe: c("Fe", "ferro", [2, 3], true),
  Co: c("Co", "cobalt", [2, 3], true),
  Ni: c("Ni", "níquel", [2, 3], true),
  Cu: c("Cu", "coure", [1, 2], true),
  Au: c("Au", "or", [1, 3], true),
  Sn: c("Sn", "estany", [2, 4], true),
  Pb: c("Pb", "plom", [2, 4], true),
  Hg: c("Hg", "mercuri", [1, 2], true),
};

const NONMETALS = {
  H: c("H", "hidrogen", [1], false),
  B: c("B", "bor", [3], false),
  Si: c("Si", "silici", [4], false),
  C: c("C", "carboni", [2, 4], false),
  N: c("N", "nitrogen", [1, 2, 3, 4, 5], false),
  P: c("P", "fòsfor", [3, 5], false),
  S: c("S", "sofre", [2, 4, 6], false),
  Se: c("Se", "seleni", [2, 4, 6], false),
  Cl: c("Cl", "clor", [1, 3, 5, 7], false),
  Br: c("Br", "brom", [1, 3, 5, 7], false),
  I: c("I", "iode", [1, 3, 5, 7], false),
};

const ANIONS = {
  O: { symbol: "O", name: "òxid", charge: 2, element: "oxigen" },
  H: { symbol: "H", name: "hidrur", charge: 1, element: "hidrogen" },
  F: { symbol: "F", name: "fluorur", charge: 1, element: "fluor" },
  Cl: { symbol: "Cl", name: "clorur", charge: 1, element: "clor" },
  Br: { symbol: "Br", name: "bromur", charge: 1, element: "brom" },
  I: { symbol: "I", name: "iodur", charge: 1, element: "iode" },
  S: { symbol: "S", name: "sulfur", charge: 2, element: "sofre" },
  Se: { symbol: "Se", name: "selenur", charge: 2, element: "seleni" },
  N: { symbol: "N", name: "nitrur", charge: 3, element: "nitrogen" },
  P: { symbol: "P", name: "fosfur", charge: 3, element: "fòsfor" },
} satisfies Record<string, Anion>;

function gcd(x: number, y: number): number {
  return y === 0 ? x : gcd(y, x % y);
}

function formulaOf(cation: Cation, a: number, anion: Anion, b: number): string {
  return `${cation.symbol}${a > 1 ? a : ""}${anion.symbol}${b > 1 ? b : ""}`;
}

function binary(type: CompoundType, cation: Cation, valence: number, anion: Anion): BinaryCompound {
  // Intercanvi de nombres d'oxidació i simplificació: Fe³⁺ + O²⁻ → Fe₂O₃.
  const g = gcd(valence, anion.charge);
  const a = anion.charge / g;
  const b = valence / g;
  return { special: false, type, cation, valence, anion, a, b, formula: formulaOf(cation, a, anion, b) };
}

/** Totes les combinacions que poden sortir als exercicis. */
function buildCompounds(): Compound[] {
  const out: Compound[] = [];
  const M = METALS;
  const N = NONMETALS;
  const A = ANIONS;

  // Òxids metàl·lics. El Hg(I) no surt: forma Hg₂²⁺ i la fórmula no se simplifica.
  for (const m of Object.values(M)) {
    for (const v of m.valences) if (!(m.symbol === "Hg" && v === 1)) out.push(binary("oxide", m, v, A.O));
  }
  // Òxids no metàl·lics.
  const nonmetalOxides: [Cation, number[]][] = [
    [N.B, [3]], [N.Si, [4]], [N.C, [2, 4]], [N.N, [1, 2, 3, 4, 5]], [N.P, [3, 5]],
    [N.S, [4, 6]], [N.Se, [4, 6]], [N.Cl, [1, 3, 5, 7]], [N.Br, [1, 3, 5, 7]], [N.I, [1, 5, 7]],
  ];
  for (const [nm, vs] of nonmetalOxides) for (const v of vs) out.push(binary("oxide", nm, v, A.O));

  // Hidrurs metàl·lics.
  for (const m of [M.Li, M.Na, M.K, M.Be, M.Mg, M.Ca, M.Ba, M.Al, M.Fe, M.Ni, M.Cu]) {
    for (const v of m.valences) out.push(binary("metal-hydride", m, v, A.H));
  }
  // Hidrurs no metàl·lics dels grups 16 i 17 (l'hidrogen va a l'esquerra).
  for (const x of [A.F, A.Cl, A.Br, A.I, A.S, A.Se]) out.push(binary("nonmetal-hydride", N.H, 1, x));
  // Hidrurs amb nom comú.
  out.push(
    { special: true, type: "special-hydride", formula: "H2O", common: "aigua", systematic: null },
    { special: true, type: "special-hydride", formula: "NH3", common: "amoníac", systematic: "trihidrur de nitrogen" },
    { special: true, type: "special-hydride", formula: "CH4", common: "metà", systematic: "tetrahidrur de carboni" },
    { special: true, type: "special-hydride", formula: "PH3", common: "fosfà", systematic: "trihidrur de fòsfor" },
    { special: true, type: "special-hydride", formula: "SiH4", common: "silà", systematic: "tetrahidrur de silici" },
    { special: true, type: "special-hydride", formula: "BH3", common: "borà", systematic: "trihidrur de bor" },
  );

  // Sals binàries metall + no metall.
  for (const m of Object.values(M)) {
    for (const v of m.valences) {
      if (m.symbol === "Hg" && v === 1) continue;
      for (const x of [A.F, A.Cl, A.Br, A.I, A.S]) out.push(binary("binary-salt", m, v, x));
    }
  }
  for (const m of [M.Li, M.Na, M.K, M.Mg, M.Ca, M.Al]) {
    out.push(binary("binary-salt", m, m.valences[0], A.N), binary("binary-salt", m, m.valences[0], A.P));
  }
  // Sals binàries no metall + no metall (l'esquerra és el menys electronegatiu).
  const nonmetalSalts: [Cation, number, Anion][] = [
    [N.C, 4, A.Cl], [N.C, 4, A.S], [N.Si, 4, A.Cl], [N.Si, 4, A.F], [N.B, 3, A.F], [N.B, 3, A.Cl],
    [N.P, 3, A.Cl], [N.P, 5, A.Cl], [N.P, 3, A.Br], [N.N, 3, A.Cl], [N.S, 6, A.F], [N.S, 2, A.Cl],
  ];
  for (const [nm, v, x] of nonmetalSalts) out.push(binary("binary-salt", nm, v, x));

  return out;
}

export const COMPOUNDS = buildCompounds();

// ---------------------------------------------------------------- noms

const PREFIX = ["", "mono", "di", "tri", "tetra", "penta", "hexa", "hepta"];
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

/** "de sodi", "d'alumini", "de dialumini". */
function de(word: string): string {
  return /^[aeiouàèéíòóúh]/i.test(word) ? `d'${word}` : `de ${word}`;
}

/** Nom sistemàtic (prefixos). `monoOnAnion` afegeix «mono» a la part de la dreta quan el subíndex és 1. */
function systematicName(cpd: BinaryCompound, monoOnAnion: boolean): string {
  const anionPrefix = cpd.b === 1 ? (monoOnAnion ? "mono" : "") : PREFIX[cpd.b];
  const anion = anionPrefix ? joinPrefix(anionPrefix, cpd.anion.name) : cpd.anion.name;
  const cation = (cpd.a > 1 ? PREFIX[cpd.a] : "") + cpd.cation.name;
  return `${anion} ${de(cation)}`;
}

/** mono + òxid → monòxid; di + òxid → diòxid; tri + clorur → triclorur. */
function joinPrefix(prefix: string, name: string): string {
  if (name === "òxid" && (prefix === "mono" || prefix === "di" || prefix === "tri")) {
    return `${prefix.replace(/o$/, "")}òxid`;
  }
  return prefix + name;
}

function needsRoman(cpd: BinaryCompound): boolean {
  return cpd.cation.valences.length > 1;
}

export function stockName(cpd: BinaryCompound): string {
  return `${cpd.anion.name} ${de(cpd.cation.name)}${needsRoman(cpd) ? `(${ROMAN[cpd.valence]})` : ""}`;
}

/** Nom sistemàtic que es mostra: amb «monòxid» als òxids i sense «mono» a la resta. */
export function displaySystematic(cpd: BinaryCompound): string {
  return systematicName(cpd, cpd.anion.symbol === "O");
}

/** Noms acceptats per a una nomenclatura. */
function acceptedNames(cpd: Compound, nomenclature: Nomenclature): string[] {
  if (cpd.special) return [cpd.common, ...(cpd.systematic ? [cpd.systematic] : [])];
  if (nomenclature === "stock") return [stockName(cpd)];
  if (nomenclature === "systematic") return [systematicName(cpd, true), systematicName(cpd, false)];
  return [stockName(cpd), systematicName(cpd, true), systematicName(cpd, false)];
}

/** Nom que es mostra per a una nomenclatura. */
export function shownName(cpd: Compound, nomenclature: Nomenclature): string {
  if (cpd.special) return cpd.common;
  return nomenclature === "stock" ? stockName(cpd) : displaySystematic(cpd);
}

/**
 * Normalitza un nom per comparar: sense accents ni majúscules, «l·l» = «ll»,
 * «d'» = «de», espais opcionals davant del parèntesi i «pentaòxid» = «pentòxid».
 */
export function normalizeCompoundName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/l[·.•]l|ŀl/g, "ll")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\bd'\s*/g, "de ")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)/g, ")")
    .replace(/([ao])oxid/g, "oxid")
    .replace(/\s+/g, " ")
    .trim();
}

const FROM_SUBSCRIPT: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
};

/** Fórmula escrita per l'alumne, sense espais i amb els subíndexs com a dígits. */
export function normalizeFormula(s: string): string {
  return s.replace(/[₀-₉]/g, (ch) => FROM_SUBSCRIPT[ch]).replace(/\s/g, "");
}

// ---------------------------------------------------------------- exercicis

export const NOMENCLATURE_LABEL: Record<Nomenclature, string> = {
  systematic: "sistemàtica",
  stock: "de Stock",
  any: "qualsevol",
};

const TYPE_WEIGHTS: [CompoundType | "special-hydride", number][] = [
  ["oxide", 0.4],
  ["metal-hydride", 0.1],
  ["nonmetal-hydride", 0.08],
  ["special-hydride", 0.07],
  ["binary-salt", 0.35],
];

function pickType(): CompoundType | "special-hydride" {
  let r = Math.random();
  for (const [t, w] of TYPE_WEIGHTS) {
    if ((r -= w) < 0) return t;
  }
  return "oxide";
}

export function generateFormulationExercise(previous?: FormulationExercise): FormulationExercise {
  for (;;) {
    const type = pickType();
    const compound = pick(COMPOUNDS.filter((cp) => cp.type === type));
    if (previous && previous.compound.formula === compound.formula) continue;
    const nomenclature: Nomenclature = compound.special ? "any" : Math.random() < 0.5 ? "systematic" : "stock";
    return { direction: Math.random() < 0.5 ? "to-name" : "to-formula", nomenclature, compound };
  }
}

const TYPE_DESCRIPTION: Record<Compound["type"], string> = {
  oxide: "És un òxid: un element combinat amb oxigen. L'oxigen hi actua amb −2 i va a la dreta.",
  "metal-hydride": "És un hidrur metàl·lic: un metall amb hidrogen. L'hidrogen hi actua amb −1 i va a la dreta.",
  "nonmetal-hydride":
    "És un hidrur no metàl·lic dels grups 16 o 17: l'hidrogen hi actua amb +1 i va a l'esquerra.",
  "binary-salt":
    "És una sal binària: dos elements que no són ni oxigen ni hidrogen. El més electronegatiu va a la dreta i acaba en -ur.",
  "special-hydride": "És un hidrur amb nom comú, que es fa servir en lloc del sistemàtic.",
};


const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "El ferro", "L'or", "La plata". */
const The = (name: string) => capitalize(articled(name).el);

function subscriptStep(cpd: BinaryCompound): string {
  const part = (symbol: string, n: number) =>
    `${formulaText(symbol + (n > 1 ? n : ""))} → ${n} àtom${n > 1 ? `s (prefix «${PREFIX[n]}»)` : ""}`;
  return `Llegim els subíndexs: ${part(cpd.cation.symbol, cpd.a)}; ${part(cpd.anion.symbol, cpd.b)}.`;
}

/** Calcula el nombre d'oxidació del catió a partir de la fórmula. */
function oxidationStep(cpd: BinaryCompound): string {
  const { cation, anion, a, b, valence } = cpd;
  if (cpd.type === "nonmetal-hydride") {
    return `L'hidrogen hi actua amb +1 i ${articled(anion.element).el} amb −${anion.charge}.`;
  }
  const total = b * anion.charge;
  return (
    `${The(anion.element)} hi actua amb −${anion.charge}: ${b} · (−${anion.charge}) = −${total}. ` +
    (a > 1
      ? `Per compensar-ho, els ${a} àtoms de ${cation.symbol} sumen +${total}, i cadascun actua amb +${valence}.`
      : `Per compensar-ho, ${articled(cation.name).el} actua amb +${valence}.`)
  );
}

function romanStep(cpd: BinaryCompound): string {
  return needsRoman(cpd)
    ? `${The(cpd.cation.name)} pot actuar amb ${cpd.cation.valences.map((v) => `+${v}`).join(", ")}: cal indicar el nombre d'oxidació en xifres romanes, (${ROMAN[cpd.valence]}).`
    : `${The(cpd.cation.name)} només actua amb +${cpd.valence}: no cal indicar-ho.`;
}

function crossSteps(cpd: BinaryCompound): string[] {
  const { cation, anion, valence } = cpd;
  const raw = formulaOf(cation, anion.charge, anion, valence);
  const steps = [
    `Intercanviem els nombres d'oxidació, sense el signe: el ${anion.charge} de ${anion.symbol} passa a ser el subíndex de ${cation.symbol}, i el ${valence} de ${cation.symbol}, el de ${anion.symbol} → ${formulaText(raw)}.`,
  ];
  if (raw !== cpd.formula) {
    steps.push(`Simplifiquem els subíndexs dividint per ${anion.charge / cpd.a} → ${formulaText(cpd.formula)}.`);
  }
  return steps;
}

export function correctFormulationExercise(ex: FormulationExercise, answers: FormulationAnswers): Correction {
  const cpd = ex.compound;
  const formula = formulaText(cpd.formula);
  const steps = [TYPE_DESCRIPTION[cpd.type]];

  if (ex.direction === "to-formula") {
    const given = normalizeFormula(answers.text);
    const ok = given === cpd.formula;
    if (cpd.special) {
      steps.push(`${The(cpd.common)} és ${formula}.`);
    } else if (ex.nomenclature === "systematic") {
      const sub = (symbol: string, n: number) => (n > 1 ? `«${PREFIX[n]}» → ${formulaText(symbol + n)}` : `sense prefix → ${symbol}`);
      steps.push(
        `Els prefixos donen directament els subíndexs: ${sub(cpd.anion.symbol, cpd.b)}; ${sub(cpd.cation.symbol, cpd.a)}.`,
        `L'element que es diu al final (${cpd.cation.name}) s'escriu primer: ${formula}.`,
      );
    } else {
      steps.push(
        `${capitalize(cpd.cation.name)}${needsRoman(cpd) ? `(${ROMAN[cpd.valence]})` : ""} → ${cpd.cation.symbol} amb +${cpd.valence}; ${cpd.anion.name} → ${cpd.anion.symbol} amb −${cpd.anion.charge}.`,
        ...crossSteps(cpd),
      );
    }
    if (!ok && given.toLowerCase() === cpd.formula.toLowerCase()) {
      steps.push("Compte amb les majúscules: la primera lletra de cada símbol va en majúscula i la segona en minúscula (Co és el cobalt; CO, el monòxid de carboni).");
    }
    return makeCorrection([field("Fórmula", formula, answers.text, ok)], steps);
  }

  const accepted = acceptedNames(cpd, ex.nomenclature).map(normalizeCompoundName);
  const ok = accepted.includes(normalizeCompoundName(answers.text));

  if (cpd.special) {
    steps.push(
      `${formula} és ${articled(cpd.common).el}${cpd.systematic ? ` (en nomenclatura sistemàtica, ${cpd.systematic})` : ""}.`,
    );
  } else if (ex.nomenclature === "systematic") {
    steps.push(
      subscriptStep(cpd),
      `Primer es diu l'element de la dreta (${cpd.anion.name}) amb el seu prefix, i després «de» i l'element de l'esquerra amb el seu prefix: ${displaySystematic(cpd)}.`,
    );
    if (cpd.b === 1) {
      steps.push(`El prefix «mono» de la part de la dreta és opcional: també val «${systematicName(cpd, cpd.anion.symbol !== "O")}».`);
    }
  } else {
    steps.push(oxidationStep(cpd), romanStep(cpd), `Nom de Stock: ${stockName(cpd)}.`);
  }

  return makeCorrection([field("Nom", shownName(cpd, ex.nomenclature), answers.text, ok)], steps);
}