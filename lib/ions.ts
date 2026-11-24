import { ELEMENTS, type ChemElement } from "./elements";
import { pick } from "./random";

// Lògica del mòdul d'ions: generar exercicis i corregir-los.

export type IonType = "cation" | "anion";

export type IonExercise = {
  /**
   * "particles": es dona l'ió (p. ex. Ca²⁺) → protons, electrons i tipus.
   * "charge": es donen l'element i els electrons → càrrega i tipus.
   */
  kind: "particles" | "charge";
  element: ChemElement;
  charge: number;
};

export type IonAnswers = {
  protons: string;
  electrons: string;
  charge: string;
  type: IonType | null;
};

export type FieldResult = {
  label: string;
  expected: string;
  given: string;
  ok: boolean;
};

export type IonCorrection = {
  ok: boolean;
  fields: FieldResult[];
  steps: string[];
};

export const EMPTY_ANSWERS: IonAnswers = { protons: "", electrons: "", charge: "", type: null };

export const TYPE_LABEL: Record<IonType, string> = { cation: "Catió", anion: "Anió" };

const MINUS = "−";
const SUPERSCRIPT: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

export function generateIonExercise(previous?: IonExercise): IonExercise {
  for (;;) {
    const element = pick(ELEMENTS);
    const exercise: IonExercise = {
      kind: Math.random() < 0.5 ? "particles" : "charge",
      element,
      charge: pick(element.ions),
    };
    if (
      !previous ||
      previous.element.z !== exercise.element.z ||
      previous.charge !== exercise.charge
    ) {
      return exercise;
    }
  }
}

/** Càrrega en notació de química: 2+, +, 3−, −. */
export function formatCharge(charge: number): string {
  const sign = charge > 0 ? "+" : MINUS;
  const n = Math.abs(charge);
  return n === 1 ? sign : `${n}${sign}`;
}

/** Símbol de l'ió amb la càrrega en superíndex: Ca²⁺, Cl⁻. */
export function ionSymbol(symbol: string, charge: number): string {
  const sup = formatCharge(charge)
    .split("")
    .map((c) => (c === "+" ? "⁺" : c === MINUS ? "⁻" : SUPERSCRIPT[c]))
    .join("");
  return symbol + sup;
}

export function ionType(charge: number): IonType {
  return charge > 0 ? "cation" : "anion";
}

/** Accepta 2+, +2, 2-, -2, +, -, i també el signe − tipogràfic. Sense signe = positiu. */
export function parseCharge(input: string): number | null {
  const s = input.replace(/\s/g, "").replace(/[−–—]/g, "-");
  if (s === "+") return 1;
  if (s === "-") return -1;
  const m = s.match(/^([+-]?)(\d+)([+-]?)$/);
  if (!m || (m[1] && m[3])) return null;
  const n = Number(m[2]);
  if (n === 0) return null;
  return (m[1] || m[3]) === "-" ? -n : n;
}

function parseCount(input: string): number | null {
  const s = input.trim();
  return /^\d+$/.test(s) ? Number(s) : null;
}

function signed(n: number): string {
  return n < 0 ? `${MINUS}${Math.abs(n)}` : String(n);
}

function electronWord(n: number): string {
  return n === 1 ? "1 electró" : `${n} electrons`;
}

export function correctIonExercise(ex: IonExercise, answers: IonAnswers): IonCorrection {
  const { element, charge } = ex;
  const protons = element.z;
  const electrons = element.z - charge;
  const type = ionType(charge);
  const change = Math.abs(charge);
  const gainedOrLost =
    charge > 0
      ? `ha perdut ${electronWord(change)}`
      : `ha guanyat ${electronWord(change)}`;
  const typeStep =
    type === "cation"
      ? "Té càrrega positiva (ha perdut electrons) → és un catió."
      : "Té càrrega negativa (ha guanyat electrons) → és un anió.";

  const typeField: FieldResult = {
    label: "Tipus d'ió",
    expected: TYPE_LABEL[type],
    given: answers.type ? TYPE_LABEL[answers.type] : "—",
    ok: answers.type === type,
  };

  let fields: FieldResult[];
  let steps: string[];

  if (ex.kind === "particles") {
    const ion = ionSymbol(element.symbol, charge);
    fields = [
      {
        label: "Protons",
        expected: String(protons),
        given: answers.protons.trim() || "—",
        ok: parseCount(answers.protons) === protons,
      },
      {
        label: "Electrons",
        expected: String(electrons),
        given: answers.electrons.trim() || "—",
        ok: parseCount(answers.electrons) === electrons,
      },
      typeField,
    ];
    steps = [
      `Els protons són el nombre atòmic: Z = ${protons} → ${protons} protons. Quan es forma un ió, els protons no canvien.`,
      `La càrrega de l'ió ${ion} és ${formatCharge(charge)}: l'àtom ${gainedOrLost}.`,
      charge > 0
        ? `Electrons = Z − càrrega = ${protons} − ${change} = ${electrons}.`
        : `Electrons = Z + ${change} = ${protons} + ${change} = ${electrons}.`,
      typeStep,
    ];
  } else {
    const givenCharge = parseCharge(answers.charge);
    fields = [
      {
        label: "Càrrega",
        expected: formatCharge(charge),
        given: answers.charge.trim() || "—",
        ok: givenCharge === charge,
      },
      typeField,
    ];
    steps = [
      `Protons = Z = ${protons}.`,
      `Càrrega = protons − electrons = ${protons} − ${electrons} = ${signed(charge)}, que s'escriu ${formatCharge(charge)}.`,
      `L'àtom ${gainedOrLost}: l'ió és ${ionSymbol(element.symbol, charge)}.`,
      typeStep,
    ];
  }

  return { ok: fields.every((f) => f.ok), fields, steps };
}
