/**
 * Preferencias de pantalla de este equipo (qué secciones quedan abiertas, etc.).
 * Son comodidades: si el navegador no deja guardar, la app funciona igual.
 */
const PREFIJO = "webpacientes.";

export function leerPreferencia(clave, porDefecto) {
  try {
    const v = localStorage.getItem(PREFIJO + clave);
    return v === null ? porDefecto : JSON.parse(v);
  } catch {
    return porDefecto;
  }
}

export function borrarPreferencia(clave) {
  try {
    localStorage.removeItem(PREFIJO + clave);
  } catch {
    /* sin storage: no había nada guardado */
  }
}

export function guardarPreferencia(clave, valor) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
  } catch {
    /* sin storage: no se recuerda */
  }
}
