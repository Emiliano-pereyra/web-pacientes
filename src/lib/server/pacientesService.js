/**
 * Acceso a datos de pacientes (solo servidor, con Firebase Admin).
 *
 * Reglas de negocio:
 *  - El ID del paciente es autogenerado (ya no se deriva del nombre).
 *  - No se permiten dos pacientes con el mismo DNI.
 *  - Cada edición registra en la subcolección `historial` qué cambió, el valor
 *    anterior, el nuevo, la fecha y quién lo hizo. El historial no se edita ni se borra.
 *  - Las evoluciones son de solo agregar (subcolección `evoluciones`).
 *  - Si se escribe sobre un paciente del modelo viejo, se guarda ya migrado.
 *  - Quién hizo cada cambio sale del usuario autenticado ({ profesional, uid }).
 */
import { adminDb } from "@/lib/server/firebaseAdmin";
import { ErrorNegocio } from "@/lib/server/errores";
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
import { rutaFotoPerfil } from "@/lib/paciente/fotos";
import { urlFirmada } from "@/lib/server/archivos";

export { ErrorNegocio, respuestaError } from "@/lib/server/errores";

export const pacientesRef = () => adminDb.collection("pacientes").doc("lista").collection("nombresPacientes");
export const pacienteRef = (id) => pacientesRef().doc(id);
const subRef = (id, sub) => pacienteRef(id).collection(sub);

/** Campos de autoría que se guardan en historial y evoluciones. */
function autoria(usuario) {
  if (!usuario?.uid) throw new ErrorNegocio("Iniciá sesión para continuar", 401);
  return { profesional: usuario.profesional, profesionalUid: usuario.uid };
}

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
  const snap = await pacientesRef().get();
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

/**
 * Paciente para el navegador. La foto de perfil va como enlace firmado que vence;
 * la galería va sin enlaces (se piden aparte, firmados, a /fotos/listar).
 */
export async function obtenerPaciente(id) {
  if (!id) throw new ErrorNegocio("Falta el id del paciente");
  const snap = await pacienteRef(id).get();
  if (!snap.exists) throw new ErrorNegocio("Paciente no encontrado", 404);
  const { doc: canonico } = migrarDocumento(snap.data());
  const ruta = rutaFotoPerfil(canonico);
  return conDerivados(id, {
    ...canonico,
    urlFoto: ruta ? (await urlFirmada(ruta)) || "" : "",
    galeriaFotos: (canonico.galeriaFotos || []).map(({ url: _url, ...resto }) => resto),
  });
}

export async function listarEvoluciones(id) {
  const snap = await subRef(id, "evoluciones").orderBy("creadoEn", "desc").get();
  const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Paciente sin migrar: mostrar la evolución vieja como registro de solo lectura
  if (lista.length === 0) {
    const pSnap = await pacienteRef(id).get();
    if (pSnap.exists && esDocumentoLegacy(pSnap.data())) {
      const { evoluciones } = migrarDocumento(pSnap.data());
      return evoluciones.map((e, i) => ({ id: `legacy-${i}`, creadoEn: null, ...e }));
    }
  }
  return lista;
}

export async function listarHistorial(id, { campo, limite = 200 } = {}) {
  const snap = await subRef(id, "historial").orderBy("creadoEn", "desc").limit(limite).get();
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
    pacientesRef().where("datosPersonales.dni", "==", dni),
    pacientesRef().where("dni", "==", dni), // pacientes aún sin migrar
  ];
  for (const q of consultas) {
    const snap = await q.get();
    if (snap.docs.some((d) => d.id !== excluirId)) return true;
  }
  return false;
}

/**
 * Alta de paciente.
 * @param {object} entrada   objeto plano { path: valor } con cualquiera de las SECCIONES_ALTA
 * @param {object} opciones  { usuario, subirFoto: async (pacienteId) => ({ path, metadata }) }
 *                           La foto se sube recién después de validar, para no dejar archivos huérfanos.
 */
export async function crearPaciente(entrada, { usuario, subirFoto } = {}) {
  const autor = autoria(usuario);
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

  const ref = pacientesRef().doc(); // ID autogenerado
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
    if (foto?.path) {
      nuevo.fotoPerfilPath = foto.path;
      nuevo.galeriaFotos = foto.metadata ? [foto.metadata] : [];
    }
  }

  const batch = adminDb.batch();
  batch.set(ref, nuevo);
  batch.set(subRef(ref.id, "historial").doc(), {
    creadoEn: ahora,
    ...autor,
    seccion: "alta",
    cambios: [],
    descripcion: "Alta del paciente",
  });
  await batch.commit();

  return { id: ref.id };
}

// ---------------------------------------------------------------
// Edición de una sección
// ---------------------------------------------------------------
export async function actualizarSeccion(id, seccionKey, entrada, { usuario } = {}) {
  const autor = autoria(usuario);
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

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new ErrorNegocio("Paciente no encontrado", 404);

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
      evoluciones.forEach((e) => tx.set(subRef(id, "evoluciones").doc(), { ...e, creadoEn: ahora }));
      historial.forEach((h) => tx.set(subRef(id, "historial").doc(), { ...h, creadoEn: ahora }));
    } else {
      const update = { actualizadoEn: ahora };
      cambiosAplicados.forEach(({ campo }) => {
        update[campo] = getPath(canonico, campo);
        update[`ultimaModificacion.${claveModificacion(campo)}`] = ahora;
      });
      tx.update(ref, update);
    }

    if (cambiosAplicados.length) {
      tx.set(subRef(id, "historial").doc(), {
        creadoEn: ahora,
        ...autor,
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
export async function agregarEvolucion(id, { texto, fecha }, { usuario } = {}) {
  const autor = autoria(usuario);
  const t = String(texto ?? "").trim();
  const errores = {};
  if (t.length < 3) errores.texto = "La evolución no puede estar vacía";
  const f = fecha ? normalizarFecha(fecha) : hoyISO();
  if (!f) errores.fecha = "Fecha inválida";
  else if (f > hoyISO()) errores.fecha = "La fecha no puede ser futura";
  if (Object.keys(errores).length) throw new ErrorNegocio("Hay datos inválidos", 400, errores);

  const ref = pacienteRef(id);
  const ahora = new Date().toISOString();
  const evolRef = subRef(id, "evoluciones").doc();
  let pacienteNombre = "";

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new ErrorNegocio("Paciente no encontrado", 404);
    const raw = snap.data();
    pacienteNombre = getPath(raw, "datosPersonales.nombreCompleto") || raw.nombreCompleto || "";
    if (esDocumentoLegacy(raw)) {
      const { doc: canonico, evoluciones, historial } = migrarDocumento(raw);
      canonico.migradoEn = ahora;
      canonico.actualizadoEn = ahora;
      tx.set(ref, canonico);
      evoluciones.forEach((e) => tx.set(subRef(id, "evoluciones").doc(), { ...e, creadoEn: ahora }));
      historial.forEach((h) => tx.set(subRef(id, "historial").doc(), { ...h, creadoEn: ahora }));
    } else {
      tx.update(ref, { actualizadoEn: ahora });
    }
    tx.set(evolRef, { texto: t, fecha: f, ...autor, creadoEn: ahora });
  });

  return { id: evolRef.id, pacienteNombre };
}
