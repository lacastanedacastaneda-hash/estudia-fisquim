// Notació química en text pla (superíndexs i subíndexs Unicode).

export const MINUS = "−";

const SUPERSCRIPT: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", [MINUS]: "⁻",
};

const SUBSCRIPT: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
};

export function superscript(s: string): string {
  return s.split("").map((c) => SUPERSCRIPT[c] ?? c).join("");
}

export function subscript(s: string): string {
  return s.split("").map((c) => SUBSCRIPT[c] ?? c).join("");
}

/** Càrrega en notació de química: 2+, +, 3−, −. */
export function formatCharge(charge: number): string {
  const sign = charge > 0 ? "+" : MINUS;
  const n = Math.abs(charge);
  return n === 1 ? sign : `${n}${sign}`;
}

/** Símbol de l'ió amb la càrrega en superíndex: Ca²⁺, Cl⁻. */
export function ionSymbol(symbol: string, charge: number): string {
  return charge === 0 ? symbol : symbol + superscript(formatCharge(charge));
}

/** Notació d'isòtop en text pla: ³⁷₁₇Cl, ³⁵₁₇Cl⁻. */
export function isotopeText(symbol: string, a: number, z: number, charge = 0): string {
  return superscript(String(a)) + subscript(String(z)) + ionSymbol(symbol, charge);
}

/** Fórmula química amb subíndexs: "Al2(SO4)3" → "Al₂(SO₄)₃". */
export function formulaText(formula: string): string {
  return subscript(formula);
}

/** Nombre amb coma decimal i com a molt `maxDecimals` decimals: 35,48 · 2653 · −140. */
export function formatNumber(n: number, maxDecimals = 2): string {
  const rounded = Number(n.toFixed(maxDecimals));
  return signed(rounded).replace(".", ",");
}

/** Nombre amb coma decimal i exactament `decimals` decimals: 16,0. */
export function formatFixed(n: number, decimals: number): string {
  return n.toFixed(decimals).replace(".", ",");
}

/** Càrrega com a nombre amb signe, per a les explicacions: +2, −1. */
export function chargeValue(charge: number): string {
  return charge > 0 ? `+${charge}` : signed(charge);
}

/** Enter amb el signe menys tipogràfic. */
export function signed(n: number): string {
  return n < 0 ? `${MINUS}${Math.abs(n)}` : String(n);
}
