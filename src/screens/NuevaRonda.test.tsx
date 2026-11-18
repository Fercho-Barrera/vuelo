import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { data } from "../lib/data";
import { NuevaRonda } from "./NuevaRonda";

const mount = () =>
  render(
    <MemoryRouter initialEntries={["/nueva"]}>
      <Routes>
        <Route path="/nueva" element={<NuevaRonda />} />
        <Route path="/stats" element={<div>stats</div>} />
      </Routes>
    </MemoryRouter>,
  );
const start = () => { fireEvent.change(screen.getByLabelText("Campo"), { target: { value: "Club Test" } }); fireEvent.click(screen.getByText("Empezar")); };
const playTo = (last: number) => { for (let i = 1; i <= last; i++) fireEvent.click(screen.getByText(i === 18 ? "Ver resumen" : "Siguiente hoyo")); };

describe("NuevaRonda", () => {
  beforeEach(() => localStorage.clear());

  it("shows a summary after hole 18 and only saves on Guardar partida", async () => {
    mount(); start(); playTo(18);
    expect(screen.getByText("Resumen")).toBeTruthy();
    expect(await data.getRounds()).toHaveLength(0);
    fireEvent.click(screen.getByText("Guardar partida"));
    await waitFor(() => screen.getByText("stats"));
    const rounds = await data.getRounds();
    expect(rounds).toHaveLength(1);
    expect(rounds[0].holes).toHaveLength(18);
    expect(rounds[0].courseName).toBe("Club Test");
  });

  it("lets you go back and keeps what you typed", () => {
    mount(); start();
    fireEvent.click(screen.getByLabelText("Más Golpes")); // hole 1: 5 strokes
    fireEvent.click(screen.getByText("Siguiente hoyo"));
    expect(screen.getByText("Hoyo 2")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Hoyo anterior"));
    expect(screen.getByText("Hoyo 1")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy(); // the strokes stepper still shows 5
  });

  it("fixes a hole from the summary before saving", async () => {
    mount(); start(); playTo(18);
    fireEvent.click(screen.getByText("Hoyo 3 · Par 4"));
    fireEvent.click(screen.getByLabelText("Más Golpes"));
    fireEvent.click(screen.getByText("Volver al resumen"));
    expect(screen.getByText("Resumen")).toBeTruthy();
    fireEvent.click(screen.getByText("Guardar partida"));
    await waitFor(() => screen.getByText("stats"));
    expect((await data.getRounds())[0].holes[2].score).toBe(5);
  });
});
