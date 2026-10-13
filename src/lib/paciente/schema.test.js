import { describe, expect, it } from "vitest";
import { SECCIONES_ALTA, camposDeSeccion } from "./schema";
import { pacienteVacio } from "./logica";

describe("institución del paciente", () => {
  const paths = camposDeSeccion("datosPersonales").map((c) => c.path);

  it("se carga en el alta, con los datos personales", () => {
    expect(SECCIONES_ALTA).toContain("datosPersonales");
    expect(paths).toContain("datosPersonales.institucion");
  });

  it("en el formulario de 2 columnas queda debajo de Género", () => {
    const genero = paths.indexOf("datosPersonales.genero");
    expect(paths.indexOf("datosPersonales.institucion") - genero).toBe(2);
    expect(genero % 2).toBe(0); // Género en la primera columna
  });

  it("un paciente nuevo la tiene vacía", () => {
    expect(pacienteVacio().datosPersonales.institucion).toBe("");
  });
});
