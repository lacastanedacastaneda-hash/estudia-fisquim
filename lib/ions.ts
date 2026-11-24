import { ELEMENTS, type ChemElement } from "./elements";
import { field, makeCorrection, parseCount, type Correction, type FieldResult } from "./exercise";
import { chargeValue, formatCharge, ionSymbol, signed } from "./notation";
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

export const EMPTY_ION_ANSWERS: IonAnswers = { protons: "", electrons: "", charge: "", type: null };

export const TYPE_LABEL: Record<IonType, string> = { cation: "Catió", anion: "Anió" };

const ION_ELEMENTS = ELEMENTS.filter((e) => e.ions.length > 0);

export function generateIonExercise(previous?: IonExercise): IonExercise {
  for (;;) {
    const element = pick(ION_ELEMENTS);
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

function electronWord(n: number): string {
  return n === 1 ? "1 electró" : `${n} electrons`;
}

/** "ha perdut 2 electrons" / "ha guanyat 1 electró". */
export function gainedOrLost(charge: number): string {
  const n = Math.abs(charge);
  return charge > 0 ? `ha perdut ${electronWord(n)}` : `ha guanyat ${electronWord(n)}`;
}

/** Pas de càlcul dels electrons d'un ió a partir de Z i la càrrega. */
export function electronsFromChargeStep(z: number, charge: number): string {
  const n = Math.abs(charge);
  return charge > 0
    ? `Electrons = Z − càrrega = ${z} − ${n} = ${z - charge}.`
    : `Electrons = Z + ${n} = ${z} + ${n} = ${z - charge}.`;
}

export function correctIonExercise(ex: IonExercise, answers: IonAnswers): Correction {
  const { element, charge } = ex;
  const protons = element.z;
  const electrons = element.z - charge;
  const type = ionType(charge);
  const ion = ionSymbol(element.symbol, charge);
  const typeStep =
    type === "cation"
      ? "Té càrrega positiva (ha perdut electrons) → és un catió."
      : "Té càrrega negativa (ha guanyat electrons) → és un anió.";

  const typeField: FieldResult = field(
    "Tipus d'ió",
    TYPE_LABEL[type],
    answers.type ? TYPE_LABEL[answers.type] : "",
    answers.type === type,
  );

  if (ex.kind === "particles") {
    return makeCorrection(
      [
        field("Protons", protons, answers.protons, parseCount(answers.protons) === protons),
        field("Electrons", electrons, answers.electrons, parseCount(answers.electrons) === electrons),
        typeField,
      ],
      [
        `Els protons són el nombre atòmic: Z = ${protons} → ${protons} protons. Quan es forma un ió, els protons no canvien.`,
        `La càrrega de l'ió ${ion} és ${chargeValue(charge)}: l'àtom ${gainedOrLost(charge)}.`,
        electronsFromChargeStep(protons, charge),
        typeStep,
      ],
    );
  }

  return makeCorrection(
    [
      field("Càrrega", formatCharge(charge), answers.charge, parseCharge(answers.charge) === charge),
      typeField,
    ],
    [
      `Protons = Z = ${protons}.`,
      `Càrrega = protons − electrons = ${protons} − ${electrons} = ${signed(charge)}, que s'escriu ${formatCharge(charge)}.`,
      `L'àtom ${gainedOrLost(charge)}: l'ió és ${ion}.`,
      typeStep,
    ],
  );
}
