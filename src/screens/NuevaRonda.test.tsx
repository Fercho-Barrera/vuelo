import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { data } from "../lib/data";
import { NuevaRonda } from "./NuevaRonda";

describe("NuevaRonda", () => {
  beforeEach(() => localStorage.clear());
  it("records 18 holes and saves one round", async () => {
    render(
      <MemoryRouter initialEntries={["/nueva"]}>
        <Routes>
          <Route path="/nueva" element={<NuevaRonda />} />
          <Route path="/stats" element={<div>stats</div>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText("Campo"), { target: { value: "Club Test" } });
    fireEvent.click(screen.getByText("Empezar"));
    for (let i = 1; i < 18; i++) {
      expect(screen.getByText(`Hoyo ${i}`)).toBeTruthy();
      fireEvent.click(screen.getByText("Siguiente hoyo"));
    }
    fireEvent.click(screen.getByText("Terminar ronda"));
    await waitFor(() => screen.getByText("stats"));
    const rounds = await data.getRounds();
    expect(rounds).toHaveLength(1);
    expect(rounds[0].holes).toHaveLength(18);
    expect(rounds[0].courseName).toBe("Club Test");
  });
});
