import { describe, expect, it } from "vitest";
import { defaultPrefs, MAX_PER_DAY, MAX_PER_WEEK, NOTIFICATION_CATEGORIES } from "./notifications";

describe("notification defaults", () => {
  it("only tee time and coach reminders start on", () => {
    const on = Object.entries(defaultPrefs).filter(([, v]) => v).map(([k]) => k).sort();
    expect(on).toEqual(["coach", "teetime"]);
  });
  it("has the ten categories from the brief", () => {
    expect(NOTIFICATION_CATEGORIES).toHaveLength(10);
  });
  it("caps pushes at 1 per day and 3 per week", () => {
    expect([MAX_PER_DAY, MAX_PER_WEEK]).toEqual([1, 3]);
  });
});
