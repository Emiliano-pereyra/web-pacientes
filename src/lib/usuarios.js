/**
 * Usuarios del sistema (compartido entre front, API y scripts).
 *
 * Documento `usuarios/{uid}` (uid de Firebase Auth):
 *   { email, nombre, matricula, rol, activo, creadoEn, actualizadoEn }
 *
 * Roles:
 *  - admin:       todo lo de profesional + gestión de usuarios.
 *  - profesional: ve y edita pacientes, agrega evoluciones, sube fotos y PDFs.
 */
export const ROLES = {
  admin: "Administrador",
  profesional: "Profesional",
};

/** Cómo figura el usuario en historial, evoluciones y PDFs. */
export function etiquetaProfesional({ nombre, matricula }) {
  const n = String(nombre || "").trim();
  const m = String(matricula || "").trim();
  return m ? `${n} (Mat. ${m})` : n;
}
