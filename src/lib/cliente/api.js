"use client";

/**
 * Cliente HTTP del front.
 * Agrega el header X-Profesional (quién está usando el sistema) hasta que
 * exista login; con Firebase Auth esto se reemplaza por el token del usuario.
 */
const CLAVE_PROFESIONAL = "webpacientes.profesional";

export function getProfesional() {
  try {
    return localStorage.getItem(CLAVE_PROFESIONAL) || "";
  } catch {
    return "";
  }
}

export function setProfesional(nombre) {
  try {
    localStorage.setItem(CLAVE_PROFESIONAL, nombre.trim());
  } catch {
    /* sin storage: se ignora */
  }
}

export class ErrorApi extends Error {
  constructor(mensaje, status, detalles) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles || null;
  }
}

async function pedir(url, { method = "GET", json, body, raw = false } = {}) {
  const headers = {};
  const prof = getProfesional();
  if (prof) headers["X-Profesional"] = encodeURIComponent(prof);
  if (json !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
    cache: "no-store",
  });

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch {
      /* respuesta no JSON */
    }
    throw new ErrorApi(data.error || `Error ${res.status}`, res.status, data.detalles);
  }
  if (raw) return res;
  return res.status === 204 ? null : res.json();
}

export const api = {
  listarPacientes: () => pedir("/api/pacientes"),
  obtenerPaciente: (id) => pedir(`/api/pacientes/datos?id=${encodeURIComponent(id)}`),
  crearPaciente: (formData) => pedir("/api/pacientes/crear", { method: "POST", body: formData }),
  actualizarSeccion: (id, seccion, valores) =>
    pedir(`/api/pacientes/${encodeURIComponent(id)}/secciones/${seccion}`, { method: "PUT", json: valores }),
  listarEvoluciones: (id) => pedir(`/api/pacientes/${encodeURIComponent(id)}/evoluciones`),
  agregarEvolucion: (id, evolucion) =>
    pedir(`/api/pacientes/${encodeURIComponent(id)}/evoluciones`, { method: "POST", json: evolucion }),
  historial: (id, campo) =>
    pedir(`/api/pacientes/${encodeURIComponent(id)}/historial${campo ? `?campo=${encodeURIComponent(campo)}` : ""}`),
  async descargarPdf(tipo, id) {
    const res = await pedir(`/api/exportador/${tipo}`, { method: "POST", json: { id }, raw: true });
    return res.blob();
  },
};
