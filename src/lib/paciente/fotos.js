/** Utilidades puras sobre fotos de pacientes (sin dependencias de Firebase; se testean). */

/**
 * Extrae la ruta del archivo de un enlace de descarga de Firebase Storage:
 *   https://firebasestorage.googleapis.com/v0/b/<bucket>/o/pacientes%2Fabc%2Ffoto.jpg?alt=media&token=…
 *   → "pacientes/abc/foto.jpg"
 * Devuelve null si no es un enlace de Firebase Storage.
 */
export function pathDeUrlFirebase(url) {
  if (typeof url !== "string") return null;
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.hostname !== "firebasestorage.googleapis.com") return null;
  const m = u.pathname.match(/^\/v0\/b\/[^/]+\/o\/(.+)$/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

/** Ruta de la foto de perfil: el campo actual o, en pacientes viejos, la que sale de urlFoto. */
export function rutaFotoPerfil(paciente) {
  return paciente?.fotoPerfilPath || pathDeUrlFirebase(paciente?.urlFoto) || null;
}
