// Tipus i utilitats comuns a tots els mòduls d'exercicis.

export type FieldResult = {
  label: string;
  expected: string;
  given: string;
  ok: boolean;
};

export type Correction = {
  ok: boolean;
  fields: FieldResult[];
  /** Resolució pas a pas, en català. */
  steps: string[];
};

export function field(label: string, expected: string | number, given: string, ok: boolean): FieldResult {
  return { label, expected: String(expected), given: given.trim() || "—", ok };
}

export function makeCorrection(fields: FieldResult[], steps: string[]): Correction {
  return { ok: fields.every((f) => f.ok), fields, steps };
}

/** Enter no negatiu escrit per l'alumne, o null si no és vàlid. */
export function parseCount(input: string): number | null {
  const s = input.trim();
  return /^\d+$/.test(s) ? Number(s) : null;
}
