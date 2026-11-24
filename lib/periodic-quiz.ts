import { field, makeCorrection, parseCount, type Correction } from "./exercise";
import {
  ALT_NAMES,
  CATEGORY_LABEL,
  PERIODIC_TABLE,
  TYPE_LABEL,
  articled,
  byZ,
  normalizeName,
  type BroadType,
  type PTElement,
} from "./periodic-table";
import { pick } from "./random";

// Mode quiz de la taula periòdica.

export type PTExerciseKind = "symbol" | "name" | "position" | "type" | "locate";

export type PTExercise = { kind: PTExerciseKind; z: number };

export type PTAnswers = {
  text: string;
  group: string;
  period: string;
  type: BroadType | null;
  /** Element tocat a la taula (mode "locate"). */
  picked: number | null;
};

export const EMPTY_PT_ANSWERS: PTAnswers = { text: "", group: "", period: "", type: null, picked: null };

/** Elements que se solen treballar a 3r d'ESO: els 36 primers i alguns d'habituals. */
export const COMMON_Z = [
  ...Array.from({ length: 36 }, (_, i) => i + 1),
  37, 38, 47, 50, 53, 54, 55, 56, 78, 79, 80, 82, 86, 92,
];

/** Origen dels símbols que no s'assemblen al nom en català. */
const SYMBOL_ORIGIN: Record<string, string> = {
  Na: "del llatí natrium",
  K: "del llatí kalium",
  Fe: "del llatí ferrum",
  Cu: "del llatí cuprum",
  Ag: "del llatí argentum",
  Au: "del llatí aurum",
  Hg: "del llatí hydrargyrum",
  Pb: "del llatí plumbum",
  Sn: "del llatí stannum",
  Sb: "del llatí stibium",
  W: "de wolframi, l'altre nom del tungstè",
  S: "del llatí sulphur",
};

const KINDS: PTExerciseKind[] = ["symbol", "symbol", "name", "name", "position", "position", "type", "locate", "locate"];

export function generatePTExercise(previous?: PTExercise): PTExercise {
  for (;;) {
    const kind = pick(KINDS);
    const z = pick(COMMON_Z);
    if (kind === "position" && byZ(z).group === null) continue;
    if (!previous || previous.z !== z) return { kind, z };
  }
}

function where(e: PTElement): string {
  return e.group === null
    ? `és al període ${e.period}, a la fila dels ${e.period === 6 ? "lantànids" : "actínids"}`
    : `és al període ${e.period} (fila) i al grup ${e.group} (columna)`;
}

function familySentence(e: PTElement): string {
  const family = CATEGORY_LABEL[e.category].toLowerCase();
  const type = TYPE_LABEL[e.type].toLowerCase();
  return family === type ? `És un ${type}.` : `És un ${family}, per tant és un ${type}.`;
}

const TYPE_RULES =
  "Els metalls ocupen l'esquerra i el centre de la taula; els no metalls, la dreta (a dalt); els semimetalls fan l'escala entre tots dos, i els gasos nobles són el grup 18.";

export function correctPTExercise(ex: PTExercise, answers: PTAnswers): Correction {
  const e = byZ(ex.z);
  const intro = `${e.name} (${e.symbol}), Z = ${e.z}`;

  switch (ex.kind) {
    case "symbol": {
      const given = answers.text.trim();
      const ok = given === e.symbol;
      const caseOnly = !ok && given.toLowerCase() === e.symbol.toLowerCase();
      const steps = [`El símbol ${articled(e.name).de} és ${e.symbol}.`];
      if (SYMBOL_ORIGIN[e.symbol]) steps.push(`Ve ${SYMBOL_ORIGIN[e.symbol]}.`);
      steps.push(
        caseOnly
          ? `Compte amb les majúscules: la primera lletra va en majúscula i la segona en minúscula (Co és el cobalt, però CO és el monòxid de carboni).`
          : "Els símbols s'escriuen amb la primera lletra en majúscula i, si n'hi ha, la segona en minúscula.",
      );
      return makeCorrection([field("Símbol", e.symbol, answers.text, ok)], steps);
    }

    case "name": {
      const accepted = [e.name, ...(ALT_NAMES[e.symbol] ?? [])].map(normalizeName);
      const ok = accepted.includes(normalizeName(answers.text));
      const steps = [`${e.symbol} és el símbol ${articled(e.name).de} (Z = ${e.z}).`];
      if (SYMBOL_ORIGIN[e.symbol]) steps.push(`El símbol ve ${SYMBOL_ORIGIN[e.symbol]}.`);
      return makeCorrection([field("Nom", e.name, answers.text, ok)], steps);
    }

    case "position": {
      return makeCorrection(
        [
          field("Grup", e.group ?? "—", answers.group, parseCount(answers.group) === e.group),
          field("Període", e.period, answers.period, parseCount(answers.period) === e.period),
        ],
        [
          `${intro}: ${where(e)}.`,
          "Els períodes són les files (1–7) i els grups són les columnes (1–18).",
          `El període coincideix amb el nombre de capes amb electrons: ${articled(e.name).el} en té ${e.period}.`,
        ],
      );
    }

    case "type": {
      return makeCorrection(
        [
          field(
            "Tipus",
            TYPE_LABEL[e.type],
            answers.type ? TYPE_LABEL[answers.type] : "",
            answers.type === e.type,
          ),
        ],
        [
          `${intro}: ${where(e)}.`,
          familySentence(e),
          TYPE_RULES + (e.symbol === "H" ? " L'hidrogen és una excepció: és al grup 1 però és un no metall." : ""),
        ],
      );
    }

    case "locate": {
      const picked = answers.picked ? byZ(answers.picked) : null;
      const steps = [`${intro}: ${where(e)}.`];
      if (picked && picked.z !== e.z) {
        steps.push(`Has tocat ${articled(picked.name).el} (${picked.symbol}), que ${where(picked)}.`);
      }
      return makeCorrection(
        [field("Element", `${e.symbol} (${e.name})`, picked ? `${picked.symbol} (${picked.name})` : "", picked?.z === e.z)],
        steps,
      );
    }
  }
}

/** Per a proves: tots els elements comuns existeixen. */
export const COMMON_ELEMENTS = COMMON_Z.map((z) => PERIODIC_TABLE[z - 1]);
