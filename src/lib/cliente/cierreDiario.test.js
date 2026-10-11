import { describe, expect, it } from "vitest";
import { MINUTOS_AVISO, estadoCierreDiario, finDelDia } from "./cierreDiario";

// Fechas en hora local: el cierre es a la medianoche del dispositivo
const hora = (dia, h, m = 0) => new Date(2026, 9, dia, h, m).getTime();

describe("cierre diario de sesiones", () => {
  it("el fin del día es la medianoche siguiente", () => {
    expect(finDelDia(hora(10, 9, 30))).toBe(hora(11, 0));
  });

  it("activa durante el día", () => {
    expect(estadoCierreDiario(hora(10, 9), hora(10, 18)).fase).toBe("activo");
  });

  it("avisa en los últimos minutos del día", () => {
    expect(estadoCierreDiario(hora(10, 9), hora(10, 23, 60 - MINUTOS_AVISO))).toEqual({
      fase: "aviso",
      minutosRestantes: MINUTOS_AVISO,
    });
    expect(estadoCierreDiario(hora(10, 9), hora(10, 23, 59)).minutosRestantes).toBe(1);
  });

  it("vence a la medianoche", () => {
    expect(estadoCierreDiario(hora(10, 9), hora(11, 0)).fase).toBe("expirado");
  });

  it("una sesión de ayer vence al abrir la app hoy", () => {
    expect(estadoCierreDiario(hora(10, 22), hora(11, 8)).fase).toBe("expirado");
  });

  it("una sesión iniciada hoy a la madrugada dura hasta la medianoche", () => {
    expect(estadoCierreDiario(hora(11, 0, 5), hora(11, 20)).fase).toBe("activo");
  });

  it("acepta otro margen de aviso", () => {
    expect(estadoCierreDiario(hora(10, 9), hora(10, 23, 30), { minutosAviso: 30 }).fase).toBe("aviso");
  });
});
