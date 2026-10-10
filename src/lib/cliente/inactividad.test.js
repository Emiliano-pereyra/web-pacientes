import { describe, expect, it } from "vitest";
import { MINUTOS_INACTIVIDAD, SEGUNDOS_AVISO, estadoInactividad } from "./inactividad";

const MIN = 60 * 1000;
const t0 = Date.UTC(2026, 9, 10, 15, 0, 0);

describe("cierre por inactividad", () => {
  it("activo antes del límite", () => {
    expect(estadoInactividad(t0, t0 + (MINUTOS_INACTIVIDAD - 1) * MIN).fase).toBe("activo");
  });

  it("al llegar al límite avisa con la cuenta regresiva completa", () => {
    expect(estadoInactividad(t0, t0 + MINUTOS_INACTIVIDAD * MIN)).toEqual({
      fase: "aviso",
      segundosRestantes: SEGUNDOS_AVISO,
    });
  });

  it("la cuenta regresiva baja", () => {
    expect(estadoInactividad(t0, t0 + MINUTOS_INACTIVIDAD * MIN + 45_000).segundosRestantes).toBe(SEGUNDOS_AVISO - 45);
  });

  it("vencido el aviso, expira", () => {
    expect(estadoInactividad(t0, t0 + MINUTOS_INACTIVIDAD * MIN + SEGUNDOS_AVISO * 1000).fase).toBe("expirado");
  });

  it("si el iPad estuvo bloqueado una hora, al volver expira de inmediato (sin aviso)", () => {
    expect(estadoInactividad(t0, t0 + 60 * MIN).fase).toBe("expirado");
  });

  it("acepta otros tiempos", () => {
    expect(estadoInactividad(t0, t0 + 5 * MIN, { minutos: 5, segundosAviso: 30 }).fase).toBe("aviso");
  });

  it("un reloj desfasado (actividad 'en el futuro') no rompe nada", () => {
    expect(estadoInactividad(t0 + 5000, t0).fase).toBe("activo");
  });
});
