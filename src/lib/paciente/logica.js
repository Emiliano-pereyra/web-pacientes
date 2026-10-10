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

/** Edad calculada; si no hay fecha de nacimiento usa la edad que tenía cargada el modelo viejo. */
export function edadDePaciente(paciente) {
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
  return doc;
}
