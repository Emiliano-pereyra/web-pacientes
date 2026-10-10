"use client";

/**
 * Cliente HTTP del front.
 * Cada pedido lleva el token de Firebase Auth del usuario que inició sesión;
 * la API lo verifica y registra a ese usuario como autor de los cambios.
 */
import { auth } from "@/lib/firebase";

export class ErrorApi extends Error {
  constructor(mensaje, status, detalles) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles || null;
  }
}

async function pedir(url, { method = "GET", json, body, raw = false } = {}) {
  const headers = {};
  const token = await auth.currentUser?.getIdToken();
  if (token) headers.Authorization = `Bearer ${token}`;
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

const pac = (id) => `/api/pacientes/${encodeURIComponent(id)}`;

export const api = {
  usuarioActual: () => pedir("/api/usuarios/yo"),
  listarPacientes: () => pedir("/api/pacientes"),
  obtenerPaciente: (id) => pedir(`/api/pacientes/datos?id=${encodeURIComponent(id)}`),
  crearPaciente: (formData) => pedir("/api/pacientes/crear", { method: "POST", body: formData }),
  actualizarSeccion: (id, seccion, valores) =>
    pedir(`${pac(id)}/secciones/${seccion}`, { method: "PUT", json: valores }),
  listarEvoluciones: (id) => pedir(`${pac(id)}/evoluciones`),
  agregarEvolucion: (id, evolucion) => pedir(`${pac(id)}/evoluciones`, { method: "POST", json: evolucion }),
  historial: (id, campo) => pedir(`${pac(id)}/historial${campo ? `?campo=${encodeURIComponent(campo)}` : ""}`),
  darDeBaja: (id, datos) => pedir(`${pac(id)}/baja`, { method: "POST", json: datos }),
  reactivar: (id, motivo) => pedir(`${pac(id)}/baja`, { method: "DELETE", json: { motivo } }),
  listarFotos: (id) => pedir(`${pac(id)}/fotos/listar`),
  subirFoto: (id, formData) => pedir(`${pac(id)}/fotos`, { method: "POST", body: formData }),
  eliminarFotos: (id, fotoIds) => pedir(`${pac(id)}/fotos/eliminar`, { method: "DELETE", json: { fotoIds } }),
  // Administración (solo admins)
  listarUsuarios: () => pedir("/api/usuarios"),
  crearUsuario: (datos) => pedir("/api/usuarios", { method: "POST", json: datos }),
  actualizarUsuario: (uid, datos) => pedir(`/api/usuarios/${encodeURIComponent(uid)}`, { method: "PATCH", json: datos }),
  auditoria: ({ pacienteId, uid, antesDe } = {}) => {
    const q = new URLSearchParams();
    if (pacienteId) q.set("pacienteId", pacienteId);
    if (uid) q.set("uid", uid);
    if (antesDe) q.set("antesDe", antesDe);
    return pedir(`/api/auditoria${q.size ? `?${q}` : ""}`);
  },
  async descargarPdf(tipo, id) {
    const res = await pedir(`/api/exportador/${tipo}`, { method: "POST", json: { id }, raw: true });
    return res.blob();
  },
};
