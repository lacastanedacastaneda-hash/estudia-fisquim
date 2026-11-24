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

/**
 * Nombre decimal escrit per l'alumne (coma o punt), o null si no és vàlid.
 * Ignora unitats habituals al final: "u", "%", "g/mol".
 */
export function parseDecimal(input: string): number | null {
  const s = input
    .trim()
    .replace(/\s*(u|%|g\/mol)$/i, "")
    .replace(/\s/g, "")
    .replace(",", ".");
  return /^\d+(\.\d+)?$|^\.\d+$/.test(s) ? Number(s) : null;
}

/** Compara un valor escrit amb el correcte, amb una tolerància absoluta. */
export function isClose(input: string, expected: number, tolerance: number): boolean {
  const n = parseDecimal(input);
  return n !== null && Math.abs(n - expected) <= tolerance + 1e-9;
}

/** Enter no negatiu escrit per l'alumne, o null si no és vàlid. */
export function parseCount(input: string): number | null {
  const s = input.trim();
  return /^\d+$/.test(s) ? Number(s) : null;
}
