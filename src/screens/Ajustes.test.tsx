import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setPassword } from "../lib/auth";
import { ProfileProvider } from "../lib/profile";
import { Ajustes } from "./Ajustes";

const PASSWORD = "golf2026ok";
const profile = { name: "Fer", email: "fer@example.com", age: 30, city: "CDMX", level: "intermedio", handicap: 19, clubs: [], prefs: {} };

const mount = () =>
  render(
    <MemoryRouter>
      <ProfileProvider>
        <Ajustes />
      </ProfileProvider>
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("vuelo.profile.v1", JSON.stringify(profile));
  // jsdom cannot reload the page; the screen reloads after erasing, so stub the reload.
  vi.stubGlobal("location", { reload: vi.fn() });
});

afterEach(() => vi.unstubAllGlobals());

describe("Eliminar mi cuenta", () => {
  it("erases the phone's data once the right password is entered", async () => {
    await setPassword(PASSWORD);
    mount();
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar mi cuenta" }));
    fireEvent.change(screen.getByLabelText("Tu contraseña"), { target: { value: PASSWORD } });
    fireEvent.click(screen.getByRole("button", { name: "Sí, eliminar todo" }));
    await waitFor(() => expect(localStorage.getItem("vuelo.profile.v1")).toBeNull());
    expect(localStorage.getItem("vuelo.auth.v1")).toBeNull();
  });

  it("keeps everything when the password is wrong", async () => {
    await setPassword(PASSWORD);
    mount();
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar mi cuenta" }));
    fireEvent.change(screen.getByLabelText("Tu contraseña"), { target: { value: "otra-clave1" } });
    fireEvent.click(screen.getByRole("button", { name: "Sí, eliminar todo" }));
    expect(await screen.findByText("Contraseña incorrecta.")).toBeTruthy();
    expect(localStorage.getItem("vuelo.profile.v1")).not.toBeNull();
    expect(localStorage.getItem("vuelo.auth.v1")).not.toBeNull();
  });

  it("can be cancelled before anything is erased", async () => {
    mount();
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar mi cuenta" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("button", { name: "Sí, eliminar todo" })).toBeNull();
    expect(localStorage.getItem("vuelo.profile.v1")).not.toBeNull();
  });
});
