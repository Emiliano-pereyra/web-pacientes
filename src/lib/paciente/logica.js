import {
  MMSE_ITEMS,
  MMSE_MAX,
  MMSE_ESCALA,
  SECCIONES,
  camposDeSeccion,
  getPath,
  setPath,
} from "./schema";

export const SCHEMA_VERSION = 2;

// ---------------------------------------------------------------
// Valores
// ---------------------------------------------------------------

/** Vacío real: undefined, null, "" o el "-" que usaba el modelo viejo. */
export function esVacio(v) {
  return v === undefined || v === null || (typeof v === "string" && (v.trim() === "" || v.trim() === "-"));
}

/** Para mostrar en pantalla o en PDF. */
export function mostrar(v, siVacio = "—") {
  return esVacio(v) ? siVacio : String(v);
}

export function hoyISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

const RE_FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** Acepta "YYYY-MM-DD", "DD/MM/YYYY" o ISO completo y devuelve "YYYY-MM-DD" (o "" si no se puede). */
export function normalizarFecha(v) {
  if (esVacio(v)) return "";
  const s = String(v).trim();
  if (RE_FECHA.test(s)) return s;
  const dmy = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  const iso = s.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (iso) return iso[1];
  return "";
}

/** "2024-03-05" → "05/03/2024". También acepta ISO completo. */
export function formatearFecha(v) {
  const f = normalizarFecha(v);
  if (!f) return esVacio(v) ? "" : String(v);
  const [y, m, d] = f.split("-");
  return `${d}/${m}/${y}`;
}

export function formatearFechaHora(iso) {
  if (esVacio(iso)) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return formatearFecha(iso);
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

// ---------------------------------------------------------------
// Edad (se calcula, no se guarda)
// ---------------------------------------------------------------
export function calcularEdad(fechaNacimiento, referencia = new Date()) {
  const f = normalizarFecha(fechaNacimiento);
  if (!f) return null;
  const [y, m, d] = f.split("-").map(Number);
  let edad = referencia.getFullYear() - y;
  const mes = referencia.getMonth() + 1;
  if (mes < m || (mes === m && referencia.getDate() < d)) edad--;
  return edad >= 0 && edad < 130 ? edad : null;
}

/**
 * Edad calculada; si no hay fecha de nacimiento usa la edad que tenía cargada el modelo viejo.
 * Si el paciente falleció, es la edad al fallecer (no sigue sumando años).
 */
export function edadDePaciente(paciente) {
  const alFallecer = paciente?.estado === "baja" && paciente?.baja?.tipo === "fallecimiento"
    ? paciente.baja.fallecimiento?.edad
    : null;
  if (alFallecer != null) return String(alFallecer);
  const calc = calcularEdad(getPath(paciente, "datosPersonales.fechaNacimiento"));
  if (calc !== null) return String(calc);
  const vieja = getPath(paciente, "datosPersonales.edadRegistrada");
  return esVacio(vieja) ? "" : `${vieja} (sin fecha de nacimiento)`;
}

// ---------------------------------------------------------------
// MMSE
// ---------------------------------------------------------------
export function resultadoMMSE(paciente) {
  let total = 0;
  let completados = 0;
  MMSE_ITEMS.forEach((item) => {
    const p = getPath(paciente, `valoracionMental.${item.id}.puntaje`);
    if (typeof p === "number" && !Number.isNaN(p)) {
      total += p;
      completados++;
    }
  });
  const completo = completados === MMSE_ITEMS.length;
  const escala = completo
    ? MMSE_ESCALA.find((e) => total >= e.desde && total <= e.hasta)
    : null;
  return {
    total,
    max: MMSE_MAX,
    completados,
    itemsTotales: MMSE_ITEMS.length,
    completo,
    interpretacion: escala?.texto ?? null,
  };
}

// ---------------------------------------------------------------
// Validación y normalización de entradas de una sección
// ---------------------------------------------------------------

/**
 * Recibe los valores enviados para una sección (objeto plano { path: valor })
 * y devuelve { valores, errores }. Solo acepta paths de esa sección.
 */
export function validarSeccion(seccionKey, entrada = {}, { esAlta = false } = {}) {
  const errores = {};
  const valores = {};
  const campos = camposDeSeccion(seccionKey);
  if (!campos.length) return { valores, errores: { _seccion: "Sección inexistente" } };

  const hoy = hoyISO();

  for (const c of campos) {
    if (!(c.path in entrada)) continue; // solo se toca lo que se envía
    let v = entrada[c.path];

    if (c.tipo === "puntaje") {
      if (esVacio(v)) {
        valores[c.path] = null;
        continue;
      }
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0 || n > c.max) {
        errores[c.path] = `Debe ser un número entero entre 0 y ${c.max}`;
        continue;
      }
      valores[c.path] = n;
      continue;
    }

    v = esVacio(v) ? "" : String(v).trim();

    if (c.tipo === "date" && v) {
      const f = normalizarFecha(v);
      if (!f) {
        errores[c.path] = "Fecha inválida";
        continue;
      }
      if (c.noFutura && f > hoy) {
        errores[c.path] = "La fecha no puede ser futura";
        continue;
      }
      v = f;
    }

    if (c.tipo === "dni" && v) {
      const dig = v.replace(/\D/g, "");
      if (dig.length < 7 || dig.length > 8) {
        errores[c.path] = "El DNI debe tener 7 u 8 dígitos";
        continue;
      }
      v = dig;
    }

    if (c.tipo === "select" && v && !c.opciones.includes(v)) {
      errores[c.path] = "Opción inválida";
      continue;
    }

    if (c.requerido && !v) {
      errores[c.path] = `${c.label} es obligatorio`;
      continue;
    }

    valores[c.path] = v;
  }

  // Requeridos que no vinieron (en el alta siempre se exigen)
  if (esAlta) {
    campos
      .filter((c) => c.requerido && !(c.path in valores) && !errores[c.path])
      .forEach((c) => (errores[c.path] = `${c.label} es obligatorio`));
  }

  // Reglas cruzadas
  if (seccionKey === "datosPersonales") {
    const nac = valores["datosPersonales.fechaNacimiento"];
    const ing = valores["datosPersonales.fechaIngreso"];
    if (nac && ing && ing < nac) {
      errores["datosPersonales.fechaIngreso"] = "La fecha de ingreso es anterior al nacimiento";
    }
    const nombre = valores["datosPersonales.nombreCompleto"];
    if (nombre !== undefined && nombre && nombre.length < 3) {
      errores["datosPersonales.nombreCompleto"] = "El nombre es demasiado corto";
    }
  }

  return { valores, errores };
}

/** Lista de cambios entre el paciente actual y los valores nuevos. */
export function calcularCambios(pacienteActual, valores) {
  const cambios = [];
  for (const [path, nuevo] of Object.entries(valores)) {
    const anterior = getPath(pacienteActual, path);
    const a = esVacio(anterior) ? null : anterior;
    const n = esVacio(nuevo) ? null : nuevo;
    if (a !== n) cambios.push({ campo: path, anterior: a, nuevo: n });
  }
  return cambios;
}

/** Devuelve un objeto plano { path: valor } con los valores actuales de una sección (para precargar formularios). */
export function valoresDeSeccion(paciente, seccionKey) {
  const out = {};
  camposDeSeccion(seccionKey).forEach((c) => {
    const v = getPath(paciente, c.path);
    if (c.tipo === "puntaje") out[c.path] = typeof v === "number" ? v : "";
    else if (c.tipo === "date") out[c.path] = normalizarFecha(v);
    else out[c.path] = esVacio(v) ? "" : v;
  });
  return out;
}

// ---------------------------------------------------------------
// Baja del paciente (lógica: la historia clínica se conserva)
// ---------------------------------------------------------------
export const MOTIVO_BAJA_MIN = 5;
export const MOTIVO_BAJA_MAX = 1000;
const TEXTO_CORTO_MAX = 200;

/** Tipos de baja. En gerontología la mayoría son por fallecimiento (va primero). */
export const TIPOS_BAJA = {
  fallecimiento: "Fallecimiento",
  alta: "Alta",
  traslado: "Traslado o derivación",
  decision: "Decisión del paciente o la familia",
  otro: "Otro",
};

export const estaDeBaja = (paciente) => paciente?.estado === "baja";
export const fallecio = (paciente) => estaDeBaja(paciente) && paciente?.baja?.tipo === "fallecimiento";

/** "Fallecida" / "Fallecido" según el género cargado ("Fallecida/o" si no hay). */
export function etiquetaFallecido(genero) {
  if (genero === "Femenino") return "Fallecida";
  if (genero === "Masculino") return "Fallecido";
  return "Fallecida/o";
}

/** Valida un texto libre: recorta espacios y controla el largo. */
function texto(v, { requerido = false, min = 1, max = MOTIVO_BAJA_MAX, mensaje } = {}) {
  const t = String(v ?? "").trim();
  if (!t) return { valor: "", error: requerido ? mensaje : null };
  if (t.length < min) return { valor: t, error: mensaje };
  if (t.length > max) return { valor: t, error: `No puede superar ${max} caracteres` };
  return { valor: t, error: null };
}

/**
 * Valida los datos de una baja.
 *  - fallecimiento: fecha obligatoria (no futura, no anterior al nacimiento ni al ingreso);
 *    hora, lugar, causa, notificación y observaciones opcionales (texto libre).
 *  - los demás tipos: motivo obligatorio (texto libre); en traslado, institución opcional.
 * @param entrada  { tipo, motivo, fecha, hora, lugar, causa, notificadoA, notificadoEn, institucion }
 * @param paciente paciente canónico (para nacimiento, ingreso y edad)
 * @returns { valores, errores } — valores = objeto `baja` listo para guardar (sin autoría)
 */
export function validarBaja(entrada = {}, paciente = {}, { hoy = hoyISO() } = {}) {
  const errores = {};
  const tipo = entrada.tipo;
  if (!TIPOS_BAJA[tipo]) return { valores: null, errores: { tipo: "Elegí el tipo de baja" } };

  const campo = (clave, opciones) => {
    const r = texto(entrada[clave], opciones);
    if (r.error) errores[clave] = r.error;
    return r.valor;
  };

  const valores = { tipo };

  if (tipo === "fallecimiento") {
    const fecha = normalizarFecha(entrada.fecha);
    const nacimiento = normalizarFecha(getPath(paciente, "datosPersonales.fechaNacimiento"));
    const ingreso = normalizarFecha(getPath(paciente, "datosPersonales.fechaIngreso"));
    if (!fecha) errores.fecha = "Indicá la fecha del fallecimiento";
    else if (fecha > hoy) errores.fecha = "La fecha no puede ser futura";
    else if (nacimiento && fecha < nacimiento) errores.fecha = "La fecha es anterior al nacimiento";
    else if (ingreso && fecha < ingreso) errores.fecha = "La fecha es anterior al ingreso";

    const hora = String(entrada.hora ?? "").trim();
    if (hora && !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) errores.hora = "Hora inválida";

    const notificadoEn = normalizarFecha(entrada.notificadoEn);
    if (entrada.notificadoEn && !notificadoEn) errores.notificadoEn = "Fecha inválida";
    else if (notificadoEn && notificadoEn > hoy) errores.notificadoEn = "La fecha no puede ser futura";
    else if (notificadoEn && fecha && notificadoEn < fecha) errores.notificadoEn = "Es anterior al fallecimiento";

    const edad = fecha && nacimiento ? calcularEdad(nacimiento, new Date(`${fecha}T12:00:00`)) : null;

    valores.fallecimiento = {
      fecha: fecha || "",
      hora: errores.hora ? "" : hora,
      lugar: campo("lugar", { max: TEXTO_CORTO_MAX }),
      causa: campo("causa"),
      notificadoA: campo("notificadoA", { max: TEXTO_CORTO_MAX }),
      notificadoEn: notificadoEn || "",
      edad,
    };
    valores.motivo = campo("motivo"); // observaciones, opcional
  } else {
    valores.motivo = campo("motivo", {
      requerido: true,
      min: MOTIVO_BAJA_MIN,
      mensaje: "Escribí el motivo de la baja",
    });
    if (tipo === "traslado") valores.institucion = campo("institucion", { max: TEXTO_CORTO_MAX });
  }

  return { valores, errores };
}

/** Resumen de una baja en una línea (historial, registro de accesos, avisos). */
export function resumenBaja(baja, genero) {
  if (!baja) return "";
  if (baja.tipo === "fallecimiento") {
    const f = baja.fallecimiento || {};
    return [
      `${etiquetaFallecido(genero)} el ${formatearFecha(f.fecha)}${f.hora ? ` a las ${f.hora}` : ""}`,
      f.edad != null ? `a los ${f.edad} años` : "",
      f.lugar ? `Lugar: ${f.lugar}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  const tipo = TIPOS_BAJA[baja.tipo] || "Baja";
  return `${tipo}${baja.institucion ? ` a ${baja.institucion}` : ""}: ${baja.motivo || ""}`;
}

/** Documento vacío con todas las secciones (estructura canónica). */
export function pacienteVacio() {
  const doc = { schemaVersion: SCHEMA_VERSION };
  Object.keys(SECCIONES).forEach((key) => {
    camposDeSeccion(key).forEach((c) => setPath(doc, c.path, c.tipo === "puntaje" ? null : ""));
  });
  doc.urlFoto = ""; // solo pacientes viejos (enlace); los nuevos usan fotoPerfilPath
  doc.fotoPerfilPath = ""; // ruta en Storage; el enlace firmado lo arma la API
  doc.galeriaFotos = [];
  doc.ultimaModificacion = {};
  doc.estado = "activo"; // "activo" | "baja"
  // Mientras está de baja: { tipo, motivo, fecha, profesional, profesionalUid, fallecimiento?, institucion? }
  doc.baja = null;
  return doc;
}
