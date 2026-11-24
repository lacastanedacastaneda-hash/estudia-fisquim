import { ELEMENTS, type ChemElement } from "./elements";
import { field, makeCorrection, parseCount, type Correction } from "./exercise";
import { electronsFromChargeStep, gainedOrLost } from "./ions";
import { chargeValue, isotopeText } from "./notation";
import { pick } from "./random";

// Lògica del mòdul d'isòtops: generar exercicis i corregir-los.

export type IsotopeExercise = {
  /**
   * "particles": es dona ᴬ_Z X (de vegades amb càrrega) → protons, neutrons i electrons.
   * "notation": es donen l'element, els protons i els neutrons → Z i A.
   */
  kind: "particles" | "notation";
  element: ChemElement;
  a: number;
  /** 0 per a un àtom neutre. Només s'usa a "particles". */
  charge: number;
};

export type IsotopeAnswers = {
  protons: string;
  neutrons: string;
  electrons: string;
  z: string;
  a: string;
};

export const EMPTY_ISOTOPE_ANSWERS: IsotopeAnswers = {
  protons: "",
  neutrons: "",
  electrons: "",
  z: "",
  a: "",
};

/** Probabilitat que un exercici "particles" sigui d'un ió en lloc d'un àtom neutre. */
const ION_PROBABILITY = 0.35;

export function generateIsotopeExercise(previous?: IsotopeExercise): IsotopeExercise {
  for (;;) {
    const element = pick(ELEMENTS);
    const kind = Math.random() < 0.65 ? "particles" : "notation";
    const charge =
      kind === "particles" && element.ions.length > 0 && Math.random() < ION_PROBABILITY
        ? pick(element.ions)
        : 0;
    const exercise: IsotopeExercise = { kind, element, a: pick(element.isotopes), charge };
    if (
      !previous ||
      previous.element.z !== exercise.element.z ||
      previous.a !== exercise.a ||
      previous.charge !== exercise.charge
    ) {
      return exercise;
    }
  }
}

export function correctIsotopeExercise(ex: IsotopeExercise, answers: IsotopeAnswers): Correction {
  const { element, a, charge } = ex;
  const z = element.z;
  const neutrons = a - z;
  const isotopeName = `${element.name.toLowerCase()}-${a}`;

  if (ex.kind === "particles") {
    const electrons = z - charge;
    const notation = isotopeText(element.symbol, a, z, charge);
    return makeCorrection(
      [
        field("Protons", z, answers.protons, parseCount(answers.protons) === z),
        field("Neutrons", neutrons, answers.neutrons, parseCount(answers.neutrons) === neutrons),
        field("Electrons", electrons, answers.electrons, parseCount(answers.electrons) === electrons),
      ],
      [
        `En la notació ${notation}, el número de dalt és A = ${a} (nombre màssic) i el de baix és Z = ${z} (nombre atòmic).`,
        `Protons = Z = ${z}.`,
        `Neutrons = A − Z = ${a} − ${z} = ${neutrons}.`,
        ...(charge === 0
          ? [`No té càrrega: és un àtom neutre, així que electrons = protons = ${z}.`]
          : [
              `Té càrrega ${chargeValue(charge)}: l'àtom ${gainedOrLost(charge)}.`,
              electronsFromChargeStep(z, charge),
            ]),
      ],
    );
  }

  return makeCorrection(
    [
      field("Z", z, answers.z, parseCount(answers.z) === z),
      field("A", a, answers.a, parseCount(answers.a) === a),
    ],
    [
      `Z (nombre atòmic) = nombre de protons = ${z}.`,
      `A (nombre màssic) = protons + neutrons = ${z} + ${neutrons} = ${a}.`,
      `L'isòtop s'escriu ${isotopeText(element.symbol, a, z)} (${isotopeName}).`,
    ],
  );
}
