import { describe, expect, it } from "vitest";
import { ROLES, etiquetaProfesional } from "./usuarios";
import { formatearTamano, plural } from "./cliente/formato";

describe("usuarios", () => {
  it("roles disponibles", () => {
    expect(Object.keys(ROLES)).toEqual(["admin", "profesional"]);
  });

  it("la etiqueta del profesional incluye la matrícula", () => {
    expect(etiquetaProfesional({ nombre: "maria eugenia padula", matricula: "MN79276 MP 38056" })).toBe(
      "maria eugenia padula (Mat. MN79276 MP 38056)",
    );
  });

  it("sin matrícula queda solo el nombre", () => {
    expect(etiquetaProfesional({ nombre: " Juan Pérez ", matricula: " " })).toBe("Juan Pérez");
  });
});

describe("formatos del front", () => {
  it.each([
    [512, "512 B"],
    [2048, "2 KB"],
    [3_500_000, "3,3 MB"],
  ])("tamaño %i → %s", (bytes, texto) => {
    expect(formatearTamano(bytes)).toBe(texto);
  });

  it("tamaño desconocido", () => {
    expect(formatearTamano(undefined)).toBe("");
  });

  it("plural", () => {
    expect(plural(1, "archivo")).toBe("1 archivo");
    expect(plural(3, "archivo")).toBe("3 archivos");
    expect(plural(0, "paciente")).toBe("0 pacientes");
  });
});
