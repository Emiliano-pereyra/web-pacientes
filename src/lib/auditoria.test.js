import { describe, expect, it } from "vitest";
import { ACCIONES, ACCIONES_LECTURA, MINUTOS_AGRUPACION, claveAgrupada, resumirNavegador } from "./auditoria";

describe("agrupación de lecturas repetidas", () => {
  const evento = { accion: "ver_paciente", pacienteId: "abc", uid: "u1" };
  const t = new Date("2026-10-10T15:00:00Z");
  const despues = (min) => new Date(t.getTime() + min * 60 * 1000);

  it("dentro de la misma ventana, la misma clave", () => {
    expect(claveAgrupada(evento, t)).toBe(claveAgrupada(evento, despues(MINUTOS_AGRUPACION - 1)));
  });

  it("en la ventana siguiente, otra clave", () => {
    expect(claveAgrupada(evento, t)).not.toBe(claveAgrupada(evento, despues(MINUTOS_AGRUPACION)));
  });

  it("otro usuario, paciente o acción no se agrupan", () => {
    const base = claveAgrupada(evento, t);
    expect(claveAgrupada({ ...evento, uid: "u2" }, t)).not.toBe(base);
    expect(claveAgrupada({ ...evento, pacienteId: "xyz" }, t)).not.toBe(base);
    expect(claveAgrupada({ ...evento, accion: "imprimir" }, t)).not.toBe(base);
  });

  it("imprimir PDFs de pestañas distintas no se agrupa", () => {
    const imp = { ...evento, accion: "imprimir" };
    expect(claveAgrupada({ ...imp, detalle: "Interconsulta" }, t)).not.toBe(claveAgrupada({ ...imp, detalle: "Resumen" }, t));
  });

  it("la clave es un id válido de Firestore (sin barras)", () => {
    expect(claveAgrupada({ ...evento, pacienteId: "a/b", detalle: "Información familiar / apoderado" }, t)).not.toMatch(
      /\//,
    );
  });
});

describe("registro de accesos", () => {
  it("las acciones de lectura existen en el catálogo", () => {
    ACCIONES_LECTURA.forEach((a) => expect(ACCIONES[a]).toBeDefined());
  });

  it.each([
    [
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "Safari · iPad",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      "Chrome · Windows",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 Edg/130.0",
      "Edge · Windows",
    ],
    ["Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36", "Chrome · Android"],
    ["", "Otro"],
  ])("resume el navegador", (ua, esperado) => {
    expect(resumirNavegador(ua)).toBe(esperado);
  });
});
