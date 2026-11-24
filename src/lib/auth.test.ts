import { beforeEach, describe, expect, it } from "vitest";
import { MIN_PASSWORD, checkPassword, hasPassword, isUnlocked, lock, passwordProblem, setPassword, unlock } from "./auth";

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

describe("passwordProblem", () => {
  it("needs the minimum length and a mix of letters and numbers", () => {
    expect(passwordProblem("abc12")).not.toBeNull();
    expect(passwordProblem("a".repeat(MIN_PASSWORD))).not.toBeNull(); // no digit
    expect(passwordProblem("1".repeat(MIN_PASSWORD))).not.toBeNull(); // no letter
    expect(passwordProblem("golf2026ok")).toBeNull();
  });
});

describe("password storage", () => {
  it("accepts the right password and rejects a wrong one", async () => {
    await setPassword("golf2026ok");
    expect(hasPassword()).toBe(true);
    expect(await checkPassword("golf2026ok")).toBe(true);
    expect(await checkPassword("golf2026OK")).toBe(false);
    expect(await checkPassword("")).toBe(false);
  });
  it("never stores the password itself, and salts every hash", async () => {
    await setPassword("golf2026ok");
    const first = localStorage.getItem("vuelo.auth.v1")!;
    expect(first).not.toContain("golf2026ok");
    await setPassword("golf2026ok");
    expect(localStorage.getItem("vuelo.auth.v1")).not.toBe(first);
  });
  it("has no password before one is set, and check fails", async () => {
    expect(hasPassword()).toBe(false);
    expect(await checkPassword("golf2026ok")).toBe(false);
  });
});

describe("session", () => {
  it("starts locked and follows unlock and lock", () => {
    expect(isUnlocked()).toBe(false);
    unlock();
    expect(isUnlocked()).toBe(true);
    lock();
    expect(isUnlocked()).toBe(false);
  });
});
