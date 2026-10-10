import { describe, expect, it } from "vitest";
import { CAMPOS_LEGACY, esDocumentoLegacy, migrarDocumento } from "./migracion";
import { SCHEMA_VERSION, pacienteVacio } from "./logica";
import { claveModificacion } from "./schema";

/** Documento como los que guardaba el modelo viejo (campos planos). */
const viejo = {
  nombreCompleto: "  María Pérez ",
  dni: "12345678",
  fechaNacimiento: "05/03/1950",
  edad: "76",
  os: "PAMI",
  afNumero: "999",
  TA: "140/90",
  antecedentesCardiovascular: "HTA",
  RespiratoriaOtros: "Tos",
  examenRespiratorio: "Roncus",
  DigestivoOtros: "-",
  palabra1: "árbol",
  palabra2: "caballo",
  palabra3: "árbol",
  enfermedadActual: "HTA controlada",
  enfermedadPrevia: "HTA",
  fechaAnteriorModifEnfermedadActual: "2024-01-10",
  fechaUltModifEnfermedadActual: "2024-06-01T10:00:00.000Z",
  Evolucion: "Paciente estable",
  UltFechaModifEvolucion: "01/06/2024",
  concurreALaConsultaMental: "Sola",
  urlFoto: "https://ejemplo/foto.jpg",
  galeriaFotos: [{ id: "perfil_1" }],
};

describe("detección del modelo", () => {
  it("sin schemaVersion es del modelo viejo", () => {
    expect(esDocumentoLegacy(viejo)).toBe(true);
    expect(esDocumentoLegacy(undefined)).toBe(true);
  });

  it("con la versión actual no es viejo", () => {
    expect(esDocumentoLegacy({ schemaVersion: SCHEMA_VERSION })).toBe(false);
  });
});

describe("migración de un documento viejo", () => {
  const { doc, evoluciones, historial } = migrarDocumento(viejo);

  it("marca la versión del esquema", () => {
    expect(doc.schemaVersion).toBe(SCHEMA_VERSION);
  });

  it("pasa los datos personales y recorta espacios", () => {
    expect(doc.datosPersonales).toMatchObject({
      nombreCompleto: "María Pérez",
      dni: "12345678",
      fechaNacimiento: "1950-03-05",
      edadRegistrada: "76",
    });
  });

  it("usa los nombres alternativos de campos viejos (os, afNumero)", () => {
    expect(doc.datosPersonales.obraSocial).toBe("PAMI");
    expect(doc.datosPersonales.afiliadoNumero).toBe("999");
  });

  it("cuando dos campos viejos van al mismo campo nuevo, concatena sin perder nada", () => {
    expect(doc.examenFisico.respiratorio.observaciones).toBe("Tos\nRoncus");
  });

  it("el «-» viejo cuenta como vacío", () => {
    expect(doc.examenFisico.digestivo.observaciones).toBe("");
  });

  it("en el MMSE junta las respuestas sin repetir y deja el puntaje sin cargar", () => {
    expect(doc.valoracionMental.fijacion.respuesta).toBe("árbol, caballo");
    expect(doc.valoracionMental.fijacion.puntaje).toBeNull();
  });

  it("«concurre a la consulta» de la parte mental pasa a observaciones", () => {
    expect(doc.valoracionMental.observaciones).toBe("Concurre a la consulta: Sola");
  });

  it("conserva foto y galería", () => {
    expect(doc.urlFoto).toBe("https://ejemplo/foto.jpg");
    expect(doc.galeriaFotos).toEqual([{ id: "perfil_1" }]);
  });

  it("conserva la fecha de última modificación que tenía el modelo viejo", () => {
    expect(doc.ultimaModificacion[claveModificacion("diagnostico.enfermedadActual")]).toBe(
      "2024-06-01T10:00:00.000Z",
    );
  });

  it("la evolución vieja pasa a la subcolección, marcada como migrada", () => {
    expect(evoluciones).toEqual([
      { texto: "Paciente estable", fecha: "2024-06-01", profesional: "Registro anterior (migrado)", migrado: true },
    ]);
  });

  it("el valor «previo» pasa al historial con su fecha original", () => {
    expect(historial).toHaveLength(1);
    expect(historial[0]).toMatchObject({
      seccion: "diagnostico",
      cambios: [{ campo: "diagnostico.enfermedadActual", anterior: "HTA", nuevo: "HTA controlada" }],
      fechaReferencia: "2024-01-10",
      migrado: true,
    });
  });

  it("no deja campos viejos sueltos en el documento nuevo", () => {
    const sueltos = CAMPOS_LEGACY.filter((c) => c in doc);
    expect(sueltos).toEqual([]);
  });

  it("el resultado tiene la estructura completa del esquema", () => {
    const estructura = (o) =>
      Object.fromEntries(
        Object.entries(o).map(([k, v]) => [k, v && typeof v === "object" && !Array.isArray(v) ? estructura(v) : typeof v]),
      );
    const vacio = pacienteVacio();
    const claves = (o) => Object.keys(estructura(o)).sort();
    expect(claves(doc)).toEqual(expect.arrayContaining(claves(vacio)));
  });
});

describe("documento ya migrado", () => {
  it("no genera evoluciones ni historial y conserva los datos", () => {
    const actual = { schemaVersion: SCHEMA_VERSION, datosPersonales: { nombreCompleto: "Juan", dni: "1234567" } };
    const { doc, evoluciones, historial } = migrarDocumento(actual);
    expect(evoluciones).toEqual([]);
    expect(historial).toEqual([]);
    expect(doc.datosPersonales.nombreCompleto).toBe("Juan");
  });

  it("completa los campos que se agregaron al esquema después", () => {
    const { doc } = migrarDocumento({ schemaVersion: SCHEMA_VERSION, datosPersonales: { nombreCompleto: "Juan" } });
    expect(doc.datosPersonales.dni).toBe("");
    expect(doc.diagnostico).toBeDefined();
    expect(doc.valoracionMental.copia.puntaje).toBeNull();
  });

  it("es idempotente: migrar dos veces da lo mismo", () => {
    const una = migrarDocumento(viejo).doc;
    const dos = migrarDocumento(una).doc;
    expect(dos).toEqual(una);
  });
});
