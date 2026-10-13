import { describe, expect, it } from "vitest";
import { DIAS_BORRADOR, agruparPorMes, borradorVigente, claveBorrador, fechaDeEvolucion, filtrarEvoluciones } from "./evoluciones";

const lista = [
  { id: "3", fecha: "2026-10-05", profesional: "Marta Ríos", texto: "Se ajusta la MEDICACIÓN nocturna." },
  { id: "2", fecha: "2026-09-20", profesional: "Marta Ríos", texto: "Buen estado general, orientado." },
  { id: "1", fecha: "2026-09-02", profesional: "Laura Gómez", texto: "Ingreso. Control de presión." },
];

describe("búsqueda de evoluciones", () => {
  it("sin filtros devuelve todas", () => {
    expect(filtrarEvoluciones(lista)).toHaveLength(3);
  });

  it("busca sin importar mayúsculas ni tildes", () => {
    expect(filtrarEvoluciones(lista, { texto: "medicacion" }).map((e) => e.id)).toEqual(["3"]);
  });

  it("todas las palabras deben aparecer", () => {
    expect(filtrarEvoluciones(lista, { texto: "estado orientado" }).map((e) => e.id)).toEqual(["2"]);
    expect(filtrarEvoluciones(lista, { texto: "estado presión" })).toHaveLength(0);
  });

  it("también busca por quién la escribió", () => {
    expect(filtrarEvoluciones(lista, { texto: "laura" }).map((e) => e.id)).toEqual(["1"]);
  });

  it("filtra por rango de fechas inclusivo", () => {
    expect(filtrarEvoluciones(lista, { desde: "2026-09-20" }).map((e) => e.id)).toEqual(["3", "2"]);
    expect(filtrarEvoluciones(lista, { hasta: "2026-09-20" }).map((e) => e.id)).toEqual(["2", "1"]);
    expect(filtrarEvoluciones(lista, { desde: "2026-09-01", hasta: "2026-09-30", texto: "control" }).map((e) => e.id)).toEqual(["1"]);
  });

  it("sin fecha usa el día en que se registró", () => {
    expect(fechaDeEvolucion({ creadoEn: "2026-08-15T13:00:00.000Z" })).toBe("2026-08-15");
  });
});

describe("línea de tiempo por mes", () => {
  it("agrupa en orden y titula cada mes", () => {
    const grupos = agruparPorMes(lista);
    expect(grupos.map((g) => [g.titulo, g.items.length])).toEqual([
      ["Octubre 2026", 1],
      ["Septiembre 2026", 2],
    ]);
  });
});

describe("borradores de evolución", () => {
  const ahora = Date.UTC(2026, 9, 12);
  it("la clave separa usuario y paciente", () => {
    expect(claveBorrador("u1", "Ana_Martinez")).toBe("borradorEvolucion.u1.Ana_Martinez");
  });

  it("vale si tiene texto y es reciente", () => {
    expect(borradorVigente({ texto: "hola", guardadoEn: ahora - 1000 }, ahora)).toBe(true);
    expect(borradorVigente({ texto: "   ", guardadoEn: ahora }, ahora)).toBe(false);
    expect(borradorVigente(null, ahora)).toBe(false);
  });

  it("vence a los días configurados", () => {
    const viejo = ahora - (DIAS_BORRADOR * 24 + 1) * 60 * 60 * 1000;
    expect(borradorVigente({ texto: "hola", guardadoEn: viejo }, ahora)).toBe(false);
  });
});
