/**
 * Usuarios del sistema (compartido entre front, API y scripts).
 *
 * Documento `usuarios/{uid}` (uid de Firebase Auth):
 *   { email, nombre, matricula, rol, profesionalUid, activo, creadoEn, actualizadoEn }
 *
 * Roles:
 *  - admin:       todo lo de profesional + gestión de usuarios. Matrícula opcional.
 *  - profesional: ve y edita pacientes, agrega evoluciones, sube fotos e imprime. Matrícula obligatoria.
 *  - secretaria:  los mismos permisos que profesional, sin matrícula. Está vinculada a un
 *                 profesional (profesionalUid): los documentos que imprime salen a nombre de él.
 */
export const ROLES = {
  admin: "Administrador",
  profesional: "Profesional",
  secretaria: "Secretaria/o",
};

export const requiereMatricula = (rol) => rol === "profesional";
export const admiteMatricula = (rol) => rol !== "secretaria";
export const requiereProfesional = (rol) => rol === "secretaria";

/**
 * Valida los datos de un usuario según su rol. Devuelve { valores, errores }.
 * `profesionales` = usuarios con rol profesional (para validar el vínculo de una secretaria/o).
 */
export function validarUsuario(entrada = {}, { esAlta = false, profesionales = [] } = {}) {
  const errores = {};
  const valores = {};

  if (esAlta) {
    const email = String(entrada.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.email = "Email inválido";
    valores.email = email;
  }

  const nombre = String(entrada.nombre || "").trim();
  if (nombre.length < 3) errores.nombre = "Ingresá nombre y apellido";
  valores.nombre = nombre;

  const rol = entrada.rol;
  if (!ROLES[rol]) {
    errores.rol = "Elegí un rol";
    return { valores, errores };
  }
  valores.rol = rol;

  const matricula = String(entrada.matricula || "").trim();
  if (requiereMatricula(rol) && !matricula) errores.matricula = "La matrícula es obligatoria para un profesional";
  valores.matricula = admiteMatricula(rol) ? matricula : "";

  if (requiereProfesional(rol)) {
    const p = profesionales.find((x) => x.uid === entrada.profesionalUid);
    if (!p) errores.profesionalUid = "Elegí el profesional de esta secretaria/o";
    else if (p.activo === false) errores.profesionalUid = "Ese profesional está desactivado";
    valores.profesionalUid = entrada.profesionalUid || "";
  } else {
    valores.profesionalUid = "";
  }

  return { valores, errores };
}

/** "Nombre (Mat. X)", o solo el nombre si no tiene matrícula. */
export function etiquetaProfesional({ nombre, matricula }) {
  const n = String(nombre || "").trim();
  const m = String(matricula || "").trim();
  return m ? `${n} (Mat. ${m})` : n;
}

/**
 * Profesional responsable de lo que hace un usuario: el que figura en los PDF.
 * Para una secretaria/o es su profesional vinculado; para los demás, el mismo usuario.
 * @param usuario     { uid, nombre, matricula, rol }
 * @param vinculado   datos del profesional vinculado (solo para secretaria) o null
 * @returns { uid, nombre, matricula } o null si una secretaria/o no tiene profesional válido
 */
export function responsableDe(usuario, vinculado = null) {
  if (!requiereProfesional(usuario.rol)) {
    return { uid: usuario.uid, nombre: usuario.nombre, matricula: usuario.matricula || "" };
  }
  if (!vinculado || vinculado.activo === false || !requiereMatricula(vinculado.rol)) return null;
  return { uid: vinculado.uid, nombre: vinculado.nombre, matricula: vinculado.matricula || "" };
}

/**
 * Cómo figura el autor en historial y evoluciones: siempre la persona que lo hizo;
 * si es secretaria/o, aclarando de qué profesional.
 */
export function etiquetaAutor(usuario, responsable) {
  if (requiereProfesional(usuario.rol) && responsable) {
    return `${String(usuario.nombre || "").trim()} (${ROLES.secretaria.toLowerCase()} de ${etiquetaProfesional(responsable)})`;
  }
  return etiquetaProfesional(usuario);
}
