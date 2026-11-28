import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Onboarding } from "./Onboarding";

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

describe("Ya tengo cuenta", () => {
  it("explains where the account lives instead of offering a sign-in that cannot work yet", () => {
    render(<Onboarding />);
    fireEvent.click(screen.getByRole("button", { name: "Ya tengo cuenta" }));
    expect(screen.getByText(/viven en el celular donde se crearon/)).toBeTruthy();
    expect(screen.queryByLabelText("Contraseña")).toBeNull();
  });

  it("goes back to the name step", () => {
    render(<Onboarding />);
    fireEvent.click(screen.getByRole("button", { name: "Ya tengo cuenta" }));
    fireEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(screen.getByLabelText("Nombre")).toBeTruthy();
  });
});
