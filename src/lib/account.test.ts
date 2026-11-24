import { describe, expect, it } from "vitest";
import { MIN_AGE, cleanEmail, isValidEmail, parseAge } from "./account";

describe("isValidEmail", () => {
  it("accepts a normal address and ignores surrounding spaces and case", () => {
    expect(isValidEmail(" Fer@Example.com ")).toBe(true);
    expect(cleanEmail(" Fer@Example.com ")).toBe("fer@example.com");
  });
  it("rejects missing parts", () => {
    for (const bad of ["", "fer", "fer@", "@example.com", "fer@example", "fer @example.com", "a@b@c.com"]) expect(isValidEmail(bad)).toBe(false);
  });
});

describe("parseAge", () => {
  it("accepts whole numbers from the minimum age to 100", () => {
    expect(parseAge("23")).toBe(23);
    expect(parseAge(String(MIN_AGE))).toBe(MIN_AGE);
    expect(parseAge("100")).toBe(100);
  });
  it("rejects too young, too old, decimals and text", () => {
    for (const bad of ["", "abc", "12", "101", "20.5", "-30", "0"]) expect(parseAge(bad)).toBeNull();
  });
});
