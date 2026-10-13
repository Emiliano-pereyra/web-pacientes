/** Línea de tiempo de evoluciones: búsqueda, filtro por fechas, agrupación por mes y borradores. */

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

/** Sin mayúsculas ni tildes: "Medicación" encuentra "medicacion". */
export function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Fecha de la evolución (YYYY-MM-DD); si no tiene, el día en que se registró. */
export function fechaDeEvolucion(e) {
  if (e?.fecha) return String(e.fecha).slice(0, 10);
  if (!e?.creadoEn) return "";
  const d = new Date(e.creadoEn);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

/**
 * Filtra por texto (en lo escrito o en quién la escribió; todas las palabras deben
 * aparecer) y por rango de fechas inclusivo. `desde`/`hasta` vacíos no limitan.
 */
export function filtrarEvoluciones(lista, { texto = "", desde = "", hasta = "" } = {}) {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  return (lista || []).filter((e) => {
    const fecha = fechaDeEvolucion(e);
    if (desde && (!fecha || fecha < desde)) return false;
    if (hasta && (!fecha || fecha > hasta)) return false;
    if (!palabras.length) return true;
    const donde = normalizar(`${e.texto} ${e.profesional}`);
    return palabras.every((p) => donde.includes(p));
  });
}

/** Agrupa (respetando el orden recibido) por mes: [{ clave: "2026-10", titulo: "Octubre 2026", items }]. */
export function agruparPorMes(lista) {
  const grupos = [];
  (lista || []).forEach((e) => {
    const fecha = fechaDeEvolucion(e);
    const clave = fecha.slice(0, 7) || "sin-fecha";
    let grupo = grupos.at(-1);
    if (!grupo || grupo.clave !== clave) {
      const [anio, mes] = clave.split("-");
      grupo = { clave, titulo: fecha ? `${MESES[Number(mes) - 1]} ${anio}` : "Sin fecha", items: [] };
      grupos.push(grupo);
    }
    grupo.items.push(e);
  });
  return grupos;
}

// ---------------------------------------------------------------
// Borradores: lo escrito en una evolución sin guardar queda en este equipo
// (por usuario y paciente) y se recupera si se corta la conexión o se cierra la pestaña.
// ---------------------------------------------------------------
export const DIAS_BORRADOR = 7;

export function claveBorrador(uid, pacienteId) {
  return `borradorEvolucion.${uid}.${pacienteId}`;
}

/** Un borrador sirve si tiene texto y no es más viejo que DIAS_BORRADOR. */
export function borradorVigente(borrador, ahora = Date.now()) {
  if (!borrador || typeof borrador.texto !== "string" || !borrador.texto.trim()) return false;
  return ahora - Number(borrador.guardadoEn || 0) <= DIAS_BORRADOR * 24 * 60 * 60 * 1000;
}
