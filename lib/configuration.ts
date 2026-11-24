import { ELEMENTS, type ChemElement } from "./elements";
import { field, makeCorrection, type Correction } from "./exercise";
import { chargeValue, ionSymbol, superscript } from "./notation";
import { pick } from "./random";

// Lògica del mòdul de configuració electrònica.

export type Subshell = { n: number; l: "s" | "p" | "d" | "f"; count: number };

/** Ordre d'ompliment del diagrama de Moeller. */
export const MOELLER_ORDER = [
  "1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p",
  "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p",
] as const;

export const CAPACITY = { s: 2, p: 6, d: 10, f: 14 } as const;

const NOBLE_GAS_CORE: Record<string, number> = { He: 2, Ne: 10, Ar: 18, Kr: 36, Xe: 54, Rn: 86 };

const key = (s: Pick<Subshell, "n" | "l">) => `${s.n}${s.l}`;

/** Configuració per subnivells seguint el diagrama de Moeller. */
export function configuration(electrons: number): Subshell[] {
  const result: Subshell[] = [];
  let left = electrons;
  for (const name of MOELLER_ORDER) {
    if (left <= 0) break;
    const l = name[1] as Subshell["l"];
    const count = Math.min(left, CAPACITY[l]);
    result.push({ n: Number(name[0]), l, count });
    left -= count;
  }
  return result;
}

/** Electrons de cada capa (n = 1, 2, 3…). */
export function shells(config: Subshell[]): number[] {
  const out: number[] = [];
  for (const s of config) out[s.n - 1] = (out[s.n - 1] ?? 0) + s.count;
  return Array.from(out, (v) => v ?? 0);
}

export type FillingStep = {
  subshell: Subshell;
  /** Màxim d'electrons que hi caben. */
  capacity: number;
  /** Electrons col·locats en total després d'omplir aquest subnivell. */
  total: number;
  /** Electrons que encara queden per col·locar. */
  remaining: number;
};

/** Ompliment pas a pas, per a l'explicació guiada. */
export function fillingSteps(electrons: number): FillingStep[] {
  let total = 0;
  return configuration(electrons).map((subshell) => {
    total += subshell.count;
    return { subshell, capacity: CAPACITY[subshell.l], total, remaining: electrons - total };
  });
}

/** Gasos nobles en ordre, amb els seus electrons. */
export const NOBLE_GASES = Object.entries(NOBLE_GAS_CORE).map(([symbol, electrons]) => ({ symbol, electrons }));

/** Configuració abreujada amb el gas noble anterior: [Ar] 4s² 3d⁶. Null si no n'hi ha cap (Z ≤ 2). */
export function abbreviatedConfig(electrons: number): string | null {
  const gas = [...NOBLE_GASES].reverse().find((g) => g.electrons < electrons);
  if (!gas) return null;
  const coreLength = configuration(gas.electrons).length;
  return `[${gas.symbol}] ${configText(configuration(electrons).slice(coreLength))}`;
}

/** Configuració real dels àtoms que no segueixen el diagrama de Moeller. */
export const MOELLER_EXCEPTIONS: Record<number, string> = {
  24: "[Ar] 4s¹ 3d⁵",
  29: "[Ar] 4s¹ 3d¹⁰",
};

export function configText(config: Subshell[]): string {
  return config.map((s) => `${key(s)}${superscript(String(s.count))}`).join(" ");
}

const FROM_SUPERSCRIPT: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
};

export type ParsedConfig = { ok: true; config: Subshell[] } | { ok: false; error: string };

/**
 * Llegeix una configuració escrita per l'alumne: "1s2 2s2 2p6", "1s² 2s² 2p⁶",
 * "1s22s22p6" (sense espais) o amb nucli de gas noble: "[Ne] 3s1".
 */
export function parseConfiguration(input: string): ParsedConfig {
  let s = input
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => FROM_SUPERSCRIPT[c])
    .replace(/\^/g, "")
    .trim()
    .toLowerCase();
  if (!s) return { ok: false, error: "Està buida." };

  const config: Subshell[] = [];
  const core = s.match(/^\[([a-z]{2})\]/);
  if (core) {
    const gas = core[1][0].toUpperCase() + core[1][1];
    if (!(gas in NOBLE_GAS_CORE)) return { ok: false, error: `[${gas}] no és un gas noble.` };
    config.push(...configuration(NOBLE_GAS_CORE[gas]));
    s = s.slice(core[0].length);
  }

  const re = /\s*([1-7])([spdf])(\d{1,2})(?=\s|,|$|[1-7][spdf])[\s,]*/y;
  while (re.lastIndex < s.length) {
    const start = re.lastIndex;
    const m = re.exec(s);
    if (!m) return { ok: false, error: `No s'entén a partir de «${s.slice(start).trim()}».` };
    const sub: Subshell = { n: Number(m[1]), l: m[2] as Subshell["l"], count: Number(m[3]) };
    if (sub.count === 0) continue;
    if (sub.count > CAPACITY[sub.l]) {
      return { ok: false, error: `El subnivell ${key(sub)} admet com a màxim ${CAPACITY[sub.l]} electrons.` };
    }
    if (config.some((c) => key(c) === key(sub))) {
      return { ok: false, error: `El subnivell ${key(sub)} surt dues vegades.` };
    }
    config.push(sub);
  }
  return { ok: true, config };
}

/** Llegeix "2, 8, 1", "2 8 1", "2-8-1"… */
export function parseShells(input: string): number[] | null {
  const parts = input.split(/[\s,;·\-–]+/).filter(Boolean);
  if (parts.length === 0 || !parts.every((p) => /^\d+$/.test(p))) return null;
  return parts.map(Number);
}

function sameConfig(a: Subshell[], b: Subshell[]): boolean {
  if (a.length !== b.length) return false;
  const map = new Map(a.map((s) => [key(s), s.count]));
  return b.every((s) => map.get(key(s)) === s.count);
}

function inMoellerOrder(config: Subshell[]): boolean {
  const idx = config.map((s) => MOELLER_ORDER.indexOf(key(s) as (typeof MOELLER_ORDER)[number]));
  return idx.every((v, i) => i === 0 || v > idx[i - 1]);
}

export type ConfigExercise = { element: ChemElement; charge: number };
export type ConfigAnswers = { config: string; shells: string };
export const EMPTY_CONFIG_ANSWERS: ConfigAnswers = { config: "", shells: "" };

/** Elements fins a l'estronci, sense el Cr i el Cu (excepcions al diagrama de Moeller). */
const CONFIG_ELEMENTS = ELEMENTS.filter((e) => e.z <= 38 && e.z !== 24 && e.z !== 29);

/** Ions que acaben amb la configuració d'un gas noble (els de 3r d'ESO). */
const CONFIG_IONS = CONFIG_ELEMENTS.flatMap((element) =>
  element.ions
    .filter((charge) => [2, 10, 18, 36].includes(element.z - charge))
    .map((charge) => ({ element, charge })),
);

const ION_PROBABILITY = 0.35;

export function generateConfigExercise(previous?: ConfigExercise): ConfigExercise {
  for (;;) {
    const exercise: ConfigExercise =
      Math.random() < ION_PROBABILITY ? pick(CONFIG_IONS) : { element: pick(CONFIG_ELEMENTS), charge: 0 };
    if (!previous || previous.element.z !== exercise.element.z || previous.charge !== exercise.charge) {
      return exercise;
    }
  }
}

export function correctConfigExercise(ex: ConfigExercise, answers: ConfigAnswers): Correction {
  const { element, charge } = ex;
  const electrons = element.z - charge;
  const expected = configuration(electrons);
  const expectedShells = shells(expected);
  const parsed = parseConfiguration(answers.config);
  const givenShells = parseShells(answers.shells);

  const configOk = parsed.ok && sameConfig(parsed.config, expected);
  const shellsOk =
    givenShells !== null &&
    givenShells.length === expectedShells.length &&
    givenShells.every((v, i) => v === expectedShells[i]);

  const electronsStep =
    charge === 0
      ? `És un àtom neutre: té tants electrons com protons. Z = ${element.z} → ${element.z} electrons.`
      : `L'ió ${ionSymbol(element.symbol, charge)} té càrrega ${chargeValue(charge)}: ${
          charge > 0 ? "ha perdut" : "ha guanyat"
        } electrons, així que en té ${element.z} ${charge > 0 ? "−" : "+"} ${Math.abs(charge)} = ${electrons}.`;

  const sums = expectedShells.map((total, i) => {
    const parts = expected.filter((s) => s.n === i + 1).map((s) => s.count);
    return `capa ${i + 1}: ${parts.length > 1 ? `${parts.join(" + ")} = ` : ""}${total}`;
  });
  const hasD = expected.some((s) => s.l === "d");

  const steps = [
    electronsStep,
    "Omplim els subnivells en l'ordre del diagrama de Moeller (1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s…). Com a màxim hi caben 2 electrons a s, 6 a p, 10 a d i 14 a f.",
    `${configText(expected)} (en total, ${expected.map((s) => s.count).join(" + ")} = ${electrons} electrons).`,
    `Per capes, sumem els electrons de cada nivell n: ${sums.join("; ")} → ${expectedShells.join(", ")}.` +
      (hasD ? " Compte: el 3d és de la capa 3, encara que s'ompli després del 4s." : ""),
  ];
  if (charge !== 0) {
    steps.push(`És la mateixa configuració que la del gas noble amb ${electrons} electrons: per això aquest ió és estable.`);
  }
  if (configOk && parsed.ok && !inMoellerOrder(parsed.config)) {
    steps.push("La teva configuració és correcta, però acostuma a escriure-la en l'ordre del diagrama de Moeller.");
  }
  if (!parsed.ok && answers.config.trim()) {
    steps.push(`Sobre la teva resposta: ${parsed.error}`);
  }

  return makeCorrection(
    [
      field("Configuració per subnivells", configText(expected), answers.config, configOk),
      field("Electrons per capes", expectedShells.join(", "), answers.shells, shellsOk),
    ],
    steps,
  );
}
