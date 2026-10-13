import { describe, expect, it } from "vitest";
import { firmaProfesional } from "./generarPdf";

const profesional = { nombre: "maria eugenia padula", matricula: "MN79276 MP 38056" };
const adminSinMatricula = { nombre: "nicolas pereyra", matricula: "" };

describe("firma del profesional al pie del PDF", () => {
  it("un profesional firma cualquier PDF con nombre y matrícula", () => {
    const esperado = { etiqueta: "Firma y sello", lineas: ["maria eugenia padula", "Mat. MN79276 MP 38056"] };
    expect(firmaProfesional(profesional, false)).toEqual(esperado);
    expect(firmaProfesional(profesional, true)).toEqual(esperado);
  });

  it("sin matrícula (admin) solo las pestañas con firma llevan la línea, sin nombre", () => {
    expect(firmaProfesional(adminSinMatricula, false)).toBeNull();
    expect(firmaProfesional(adminSinMatricula, true)).toEqual({ etiqueta: "Firma y sello del profesional", lineas: [] });
  });

  it("matrícula en blanco cuenta como sin matrícula", () => {
    expect(firmaProfesional({ nombre: "x", matricula: "  " }, false)).toBeNull();
  });
});
