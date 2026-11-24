import { describe, expect, it } from "vitest";
import { isClose, parseCount, parseDecimal } from "./exercise";

describe("parseCount", () => {
  it.each([
    ["17", 17],
    [" 0 ", 0],
    ["-1", null],
    ["1.5", null],
    ["", null],
    ["abc", null],
  ])("%j → %j", (input, expected) => {
    expect(parseCount(input)).toBe(expected);
  });
});

describe("parseDecimal", () => {
  it.each([
    ["35,48", 35.48],
    ["35.48", 35.48],
    ["35,48 u", 35.48],
    ["70%", 70],
    [" 70 % ", 70],
    ["98,1 g/mol", 98.1],
    ["abc", null],
    ["", null],
    ["1,2,3", null],
  ])("%j → %j", (input, expected) => {
    expect(parseDecimal(input)).toBe(expected);
  });
});

describe("isClose", () => {
  it("accepts answers within the tolerance", () => {
    expect(isClose("35,5", 35.484, 0.05)).toBe(true);
    expect(isClose("35,4", 35.484, 0.05)).toBe(false);
    expect(isClose("", 1, 0.5)).toBe(false);
  });
});
