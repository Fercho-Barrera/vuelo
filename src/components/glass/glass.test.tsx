import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlassButton, GlassSheet, PillSelector, StatRing } from ".";

describe("glass components", () => {
  it("GlassButton fires onClick", () => {
    const fn = vi.fn();
    render(<GlassButton onClick={fn}>Ok</GlassButton>);
    fireEvent.click(screen.getByText("Ok"));
    expect(fn).toHaveBeenCalledOnce();
  });
  it("PillSelector marks the active option and changes it", () => {
    const fn = vi.fn();
    render(<PillSelector label="Modo" value="a" onChange={fn} options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />);
    expect(screen.getByText("A").getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByText("B"));
    expect(fn).toHaveBeenCalledWith("b");
  });
  it("StatRing exposes an accessible label", () => {
    render(<StatRing value={1} max={4} label="Putts" display="1/4" />);
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Putts: 1/4");
  });
  it("GlassSheet closes on Escape", () => {
    const fn = vi.fn();
    render(<GlassSheet open onClose={fn} title="Hola">x</GlassSheet>);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(fn).toHaveBeenCalled();
  });
});
