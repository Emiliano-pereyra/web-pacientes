/** Registro de accesos (solo servidor). Ver src/lib/auditoria.js. */
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { ACCIONES, ACCIONES_LECTURA, claveAgrupada, resumirNavegador } from "@/lib/auditoria";

const coleccion = () => adminDb.collection("auditoria");

/**
 * Registra un evento. Nunca hace fallar el pedido: si no se puede escribir,
 * queda en los logs del servidor.
 *
 * Las lecturas (abrir la ficha, ver archivos, imprimir el mismo PDF) de la misma persona
 * sobre el mismo paciente dentro de una ventana de minutos se agrupan en un solo registro
 * (`veces`, `ultimaVez`), para que recargar la página no llene el registro de ruido.
 * Las modificaciones se registran siempre una por una.
 */
export async function registrar(request, usuario, { accion, pacienteId = null, pacienteNombre = "", detalle = "" }) {
  if (!ACCIONES[accion]) throw new Error(`Acción de auditoría desconocida: ${accion}`);
  const ahora = new Date();
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const evento = {
    fecha: ahora.toISOString(),
    accion,
    uid: usuario.uid,
    usuario: usuario.profesional || usuario.nombre || "",
    rol: usuario.rol,
    pacienteId,
    pacienteNombre: String(pacienteNombre || ""),
    detalle: String(detalle || "").slice(0, 300),
    ip,
    navegador: resumirNavegador(request.headers.get("user-agent")),
  };
  try {
    if (!ACCIONES_LECTURA.includes(accion)) {
      await coleccion().add(evento);
      return;
    }
    const ref = coleccion().doc(claveAgrupada(evento, ahora));
    try {
      await ref.create({ ...evento, veces: 1, ultimaVez: evento.fecha });
    } catch (error) {
      if (error?.code !== 6) throw error; // 6 = ALREADY_EXISTS: misma lectura dentro de la ventana
      await ref.update({ veces: FieldValue.increment(1), ultimaVez: evento.fecha });
    }
  } catch (error) {
    console.error("No se pudo registrar en auditoría:", accion, error?.message);
  }
}

/**
 * Consulta el registro (más nuevo primero).
 *  - con pacienteId o uid: todos los eventos de ese paciente/usuario (filtro por igualdad,
 *    se ordena en memoria → no requiere índices compuestos);
 *  - sin filtros: los últimos `limite`, con paginación por fecha (`antesDe`).
 */
export async function consultar({ pacienteId, uid, limite = 100, antesDe } = {}) {
  let docs;
  if (pacienteId || uid) {
    const snap = await coleccion().where(pacienteId ? "pacienteId" : "uid", "==", pacienteId || uid).get();
    docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (pacienteId && uid) docs = docs.filter((d) => d.uid === uid);
    docs.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
    if (antesDe) docs = docs.filter((d) => d.fecha < antesDe);
    docs = docs.slice(0, limite);
  } else {
    let q = coleccion().orderBy("fecha", "desc");
    if (antesDe) q = q.where("fecha", "<", antesDe);
    const snap = await q.limit(limite).get();
    docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return { eventos: docs, hayMas: docs.length === limite };
}
