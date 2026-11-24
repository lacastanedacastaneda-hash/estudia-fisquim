import { describe, expect, it } from "vitest";
import {
  configText,
  configuration,
  correctConfigExercise,
  generateConfigExercise,
  parseConfiguration,
  parseShells,
  shells,
} from "./configuration";
import { ELEMENTS } from "./elements";

const el = (symbol: string) => ELEMENTS.find((e) => e.symbol === symbol)!;

describe("configuration", () => {
  it("fills subshells in Moeller order", () => {
    expect(configText(configuration(11))).toBe("1s² 2s² 2p⁶ 3s¹");
    expect(configText(configuration(26))).toBe("1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶");
  });

  it("groups electrons by shell", () => {
    expect(shells(configuration(19))).toEqual([2, 8, 8, 1]);
    expect(shells(configuration(26))).toEqual([2, 8, 14, 2]);
    expect(shells(configuration(38))).toEqual([2, 8, 18, 8, 2]);
  });
});

describe("parseConfiguration", () => {
  it.each([
    ["1s2 2s2 2p6 3s1", 11],
    ["1s² 2s² 2p⁶ 3s¹", 11],
    ["1s22s22p63s1", 11],
    ["[Ne] 3s1", 11],
    ["[ne]3s1", 11],
    ["1s^2 2s^2", 4],
    ["1s2, 2s2, 2p6", 10],
    ["1s22s22p63s23p64s23d104p65s2", 38],
    ["[Ar] 4s2 3d6", 26],
  ])("reads %j", (input, electrons) => {
    const parsed = parseConfiguration(input);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(configText(parsed.config)).toBe(configText(configuration(electrons)));
  });

  it.each([
    ["1s3", "admet com a màxim 2"],
    ["1s2 1s2", "surt dues vegades"],
    ["hola", "No s'entén"],
    ["[Xx] 1s2", "no és un gas noble"],
    ["1s2 2x2", "No s'entén a partir de «2x2»"],
  ])("explains why %j is invalid", (input, message) => {
    const parsed = parseConfiguration(input);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toContain(message);
  });
});

describe("parseShells", () => {
  it("accepts commas, spaces and dashes", () => {
    expect(parseShells("2, 8, 1")).toEqual([2, 8, 1]);
    expect(parseShells("2 8 1")).toEqual([2, 8, 1]);
    expect(parseShells("2-8-1")).toEqual([2, 8, 1]);
    expect(parseShells("2,a")).toBeNull();
  });
});

describe("correctConfigExercise", () => {
  it("accepts a correct answer for an atom", () => {
    const r = correctConfigExercise({ element: el("Na"), charge: 0 }, { config: "1s2 2s2 2p6 3s1", shells: "2, 8, 1" });
    expect(r.ok).toBe(true);
  });

  it("counts the extra electron of an anion", () => {
    const r = correctConfigExercise({ element: el("Cl"), charge: -1 }, { config: "1s2 2s2 2p6 3s2 3p5", shells: "2 8 8" });
    expect(r.fields.map((f) => f.ok)).toEqual([false, true]);
  });

  it("accepts subshells out of Moeller order but adds a note", () => {
    const r = correctConfigExercise(
      { element: el("Fe"), charge: 0 },
      { config: "1s2 2s2 2p6 3s2 3p6 3d6 4s2", shells: "2,8,14,2" },
    );
    expect(r.ok).toBe(true);
    expect(r.steps.at(-1)).toContain("ordre del diagrama de Moeller");
  });
});

describe("generateConfigExercise", () => {
  it("skips Cr and Cu, stays up to Sr, and only uses noble-gas ions", () => {
    for (let i = 0; i < 5000; i++) {
      const { element, charge } = generateConfigExercise();
      expect(element.z).toBeLessThanOrEqual(38);
      expect([24, 29]).not.toContain(element.z);
      if (charge !== 0) expect([2, 10, 18, 36]).toContain(element.z - charge);
    }
  });
});
