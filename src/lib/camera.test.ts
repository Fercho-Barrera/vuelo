import { describe, expect, it } from "vitest";
import { classifyError, extensionFor, pickMime } from "./camera";

describe("camera helpers", () => {
  it("prefers mp4 when supported and falls back to webm", () => {
    expect(pickMime(() => true)).toBe("video/mp4");
    expect(pickMime((m) => m === "video/webm")).toBe("video/webm");
    expect(pickMime(() => false)).toBeUndefined();
  });
  it("names the file by container", () => {
    expect(extensionFor("video/mp4")).toBe("mp4");
    expect(extensionFor("video/webm;codecs=vp9")).toBe("webm");
  });
  it("classifies errors", () => {
    expect(classifyError(new DOMException("x", "NotAllowedError"), true, true)).toBe("denied");
    expect(classifyError(new DOMException("x", "NotFoundError"), true, true)).toBe("missing");
    expect(classifyError(new Error("x"), false, true)).toBe("insecure");
    expect(classifyError(new Error("x"), true, false)).toBe("insecure");
    expect(classifyError(new Error("x"), true, true)).toBe("other");
  });
});
