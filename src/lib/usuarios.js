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
