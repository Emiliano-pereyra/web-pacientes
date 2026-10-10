/**
 * Acceso a datos de pacientes (solo servidor).
 *
 * Reglas de negocio:
 *  - El ID del paciente es autogenerado (ya no se deriva del nombre).
 *  - No se permiten dos pacientes con el mismo DNI.
 *  - Cada edición registra en la subcolección `historial` qué cambió, el valor
 *    anterior, el nuevo, la fecha y quién lo hizo. El historial no se edita ni se borra.
 *  - Las evoluciones son de solo agregar (subcolección `evoluciones`).
 *  - Si se escribe sobre un paciente del modelo viejo, se guarda ya migrado.
 */
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as qLimit,
  runTransaction,
} from "firebase/firestore";
import { SECCIONES, SECCIONES_ALTA, claveModificacion, getPath, setPath } from "@/lib/paciente/schema";
import {
  calcularCambios,
  edadDePaciente,
  esVacio,
  hoyISO,
  normalizarFecha,
  resultadoMMSE,
  validarSeccion,
} from "@/lib/paciente/logica";
import { esDocumentoLegacy, migrarDocumento } from "@/lib/paciente/migracion";

const COLECCION = ["pacientes", "lista", "nombresPacientes"];
const PROFESIONAL_POR_DEFECTO = "Sin identificar";

export class ErrorNegocio extends Error {
  constructor(mensaje, status = 400, detalles = null) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

const pacientesRef = () => collection(db, ...COLECCION);
const pacienteRef = (id) => doc(db, ...COLECCION, id);
const subRef = (id, sub) => collection(db, ...COLECCION, id, sub);

/** Agrega datos derivados que no se guardan (edad, MMSE). */
function conDerivados(id, docCanonico) {
  return {
    id,
    ...docCanonico,
    derivados: {
      edad: edadDePaciente(docCanonico),
      mmse: resultadoMMSE(docCanonico),
    },
  };
}

// ---------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------
export async function listarPacientes() {
  const snap = await getDocs(pacientesRef());
  return snap.docs
    .map((d) => {
      const data = d.data();
      const nombre =
        getPath(data, "datosPersonales.nombreCompleto") ||
        (esVacio(data.nombreCompleto) ? "" : data.nombreCompleto) ||
        d.id.replace(/_/g, " ");
      const dni = getPath(data, "datosPersonales.dni") || (esVacio(data.dni) ? "" : data.dni);
      return { id: d.id, nombreVisible: String(nombre).trim(), dni: dni || "" };
    })
    .sort((a, b) => a.nombreVisible.localeCompare(b.nombreVisible, "es"));
}

export async function obtenerPaciente(id) {
  if (!id) throw new ErrorNegocio("Falta el id del paciente");
  const snap = await getDoc(pacienteRef(id));
  if (!snap.exists()) throw new ErrorNegocio("Paciente no encontrado", 404);
  const { doc: canonico } = migrarDocumento(snap.data());
  return conDerivados(id, canonico);
}

export async function listarEvoluciones(id) {
  const snap = await getDocs(query(subRef(id, "evoluciones"), orderBy("creadoEn", "desc")));
  const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Paciente sin migrar: mostrar la evolución vieja como registro de solo lectura
  if (lista.length === 0) {
    const pSnap = await getDoc(pacienteRef(id));
    if (pSnap.exists() && esDocumentoLegacy(pSnap.data())) {
      const { evoluciones } = migrarDocumento(pSnap.data());
      return evoluciones.map((e, i) => ({ id: `legacy-${i}`, creadoEn: null, ...e }));
    }
  }
  return lista;
}

export async function listarHistorial(id, { campo, limite = 200 } = {}) {
  const snap = await getDocs(query(subRef(id, "historial"), orderBy("creadoEn", "desc"), qLimit(limite)));
  let lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (campo) {
    lista = lista
      .map((h) => ({ ...h, cambios: (h.cambios || []).filter((c) => c.campo === campo) }))
      .filter((h) => h.cambios.length > 0);
  }
  return lista;
}

// ---------------------------------------------------------------
// Alta
// ---------------------------------------------------------------
async function existeDni(dni, excluirId = null) {
  if (!dni) return false;
  const consultas = [
    query(pacientesRef(), where("datosPersonales.dni", "==", dni)),
    query(pacientesRef(), where("dni", "==", dni)), // pacientes aún sin migrar
  ];
  for (const q of consultas) {
    const snap = await getDocs(q);
    if (snap.docs.some((d) => d.id !== excluirId)) return true;
  }
  return false;
}

/**
 * Alta de paciente.
 * @param {object} entrada   objeto plano { path: valor } con cualquiera de las SECCIONES_ALTA
 * @param {object} opciones  { profesional, subirFoto: async (pacienteId) => ({ url, metadata }) }
 *                           La foto se sube recién después de validar, para no dejar archivos huérfanos.
 */
export async function crearPaciente(entrada, { profesional, subirFoto } = {}) {
  const errores = {};
  const valores = {};
  SECCIONES_ALTA.forEach((key) => {
    const r = validarSeccion(key, entrada, { esAlta: key === "datosPersonales" });
    Object.assign(errores, r.errores);
    Object.assign(valores, r.valores);
  });
  if (!valores["datosPersonales.fechaIngreso"] && !errores["datosPersonales.fechaIngreso"]) {
    valores["datosPersonales.fechaIngreso"] = hoyISO();
  }
  if (Object.keys(errores).length) throw new ErrorNegocio("Hay datos inválidos", 400, errores);

  if (await existeDni(valores["datosPersonales.dni"])) {
    throw new ErrorNegocio("Ya existe un paciente con ese DNI", 409, {
      "datosPersonales.dni": "Ya existe un paciente con ese DNI",
    });
  }

  const ref = doc(pacientesRef()); // ID autogenerado
  const { doc: nuevo } = migrarDocumento({ schemaVersion: 2 });
  Object.entries(valores).forEach(([path, v]) => setPath(nuevo, path, v));

  const ahora = new Date().toISOString();
  nuevo.creadoEn = ahora;
  nuevo.actualizadoEn = ahora;
  nuevo.ultimaModificacion = {};
  Object.keys(valores)
    .filter((p) => !esVacio(valores[p]))
    .forEach((p) => (nuevo.ultimaModificacion[claveModificacion(p)] = ahora));

  if (subirFoto) {
    const foto = await subirFoto(ref.id);
    if (foto?.url) {
      nuevo.urlFoto = foto.url;
      nuevo.galeriaFotos = foto.metadata ? [foto.metadata] : [];
    }
  }

  await runTransaction(db, async (tx) => {
    tx.set(ref, nuevo);
    tx.set(doc(subRef(ref.id, "historial")), {
      creadoEn: ahora,
      profesional: profesional || PROFESIONAL_POR_DEFECTO,
      seccion: "alta",
      cambios: [],
      descripcion: "Alta del paciente",
    });
  });

  return { id: ref.id };
}

// ---------------------------------------------------------------
// Edición de una sección
// ---------------------------------------------------------------
export async function actualizarSeccion(id, seccionKey, entrada, { profesional } = {}) {
  if (!SECCIONES[seccionKey]) throw new ErrorNegocio("Sección inexistente", 404);

  const { valores, errores } = validarSeccion(seccionKey, entrada);
  if (Object.keys(errores).length) throw new ErrorNegocio("Hay datos inválidos", 400, errores);

  if (seccionKey === "datosPersonales" && valores["datosPersonales.dni"]) {
    if (await existeDni(valores["datosPersonales.dni"], id)) {
      throw new ErrorNegocio("Ya existe otro paciente con ese DNI", 409, {
        "datosPersonales.dni": "Ya existe otro paciente con ese DNI",
      });
    }
  }

  const ref = pacienteRef(id);
  const ahora = new Date().toISOString();
  let cambiosAplicados = [];

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new ErrorNegocio("Paciente no encontrado", 404);

    const raw = snap.data();
    const legacy = esDocumentoLegacy(raw);
    const { doc: canonico, evoluciones, historial } = migrarDocumento(raw);

    cambiosAplicados = calcularCambios(canonico, valores);
    if (cambiosAplicados.length === 0 && !legacy) return;

    cambiosAplicados.forEach(({ campo, nuevo }) => {
      setPath(canonico, campo, nuevo ?? (campo.endsWith(".puntaje") ? null : ""));
      canonico.ultimaModificacion[claveModificacion(campo)] = ahora;
    });
    canonico.actualizadoEn = ahora;

    if (legacy) {
      // Se reemplaza el documento entero: quedan solo los campos del modelo nuevo
      canonico.migradoEn = ahora;
      tx.set(ref, canonico);
      evoluciones.forEach((e) => tx.set(doc(subRef(id, "evoluciones")), { ...e, creadoEn: ahora }));
      historial.forEach((h) => tx.set(doc(subRef(id, "historial")), { ...h, creadoEn: ahora }));
    } else {
      const update = { actualizadoEn: ahora };
      cambiosAplicados.forEach(({ campo }) => {
        update[campo] = getPath(canonico, campo);
        update[`ultimaModificacion.${claveModificacion(campo)}`] = ahora;
      });
      tx.update(ref, update);
    }

    if (cambiosAplicados.length) {
      tx.set(doc(subRef(id, "historial")), {
        creadoEn: ahora,
        profesional: profesional || PROFESIONAL_POR_DEFECTO,
        seccion: seccionKey,
        cambios: cambiosAplicados,
      });
    }
  });

  return { cambios: cambiosAplicados.length };
}

// ---------------------------------------------------------------
// Evoluciones (solo agregar)
// ---------------------------------------------------------------
export async function agregarEvolucion(id, { texto, fecha, profesional }) {
  const t = String(texto ?? "").trim();
  const prof = String(profesional ?? "").trim();
  const errores = {};
  if (t.length < 3) errores.texto = "La evolución no puede estar vacía";
  if (!prof) errores.profesional = "Indicá quién registra la evolución";
  const f = fecha ? normalizarFecha(fecha) : hoyISO();
  if (!f) errores.fecha = "Fecha inválida";
  else if (f > hoyISO()) errores.fecha = "La fecha no puede ser futura";
  if (Object.keys(errores).length) throw new ErrorNegocio("Hay datos inválidos", 400, errores);

  const ref = pacienteRef(id);
  const ahora = new Date().toISOString();
  const evolRef = doc(subRef(id, "evoluciones"));

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new ErrorNegocio("Paciente no encontrado", 404);
    const raw = snap.data();
    if (esDocumentoLegacy(raw)) {
      const { doc: canonico, evoluciones, historial } = migrarDocumento(raw);
      canonico.migradoEn = ahora;
      canonico.actualizadoEn = ahora;
      tx.set(ref, canonico);
      evoluciones.forEach((e) => tx.set(doc(subRef(id, "evoluciones")), { ...e, creadoEn: ahora }));
      historial.forEach((h) => tx.set(doc(subRef(id, "historial")), { ...h, creadoEn: ahora }));
    } else {
      tx.update(ref, { actualizadoEn: ahora });
    }
    tx.set(evolRef, { texto: t, fecha: f, profesional: prof, creadoEn: ahora });
  });

  return { id: evolRef.id };
}

/** Respuesta HTTP uniforme para errores. */
export function respuestaError(error) {
  if (error instanceof ErrorNegocio) {
    return Response.json({ error: error.message, detalles: error.detalles }, { status: error.status });
  }
  console.error("Error inesperado:", error?.message);
  return Response.json({ error: "Error interno del servidor" }, { status: 500 });
}
