/** Utilidades HTTP para las rutas de la API. */

/**
 * Profesional que realiza la acción.
 * Hasta que exista login viene en el header X-Profesional que manda el front.
 * Cuando se agregue Firebase Auth, esto debe salir del token verificado.
 */
export function profesionalDe(request) {
  const h = request.headers.get("x-profesional");
  if (!h) return null;
  try {
    return decodeURIComponent(h).trim().slice(0, 120) || null;
  } catch {
    return null;
  }
}
