/**
 * Cierre de sesión por inactividad (historia clínica en dispositivos compartidos).
 * Pasados MINUTOS_INACTIVIDAD sin uso se avisa, y si en SEGUNDOS_AVISO nadie responde
 * se cierra la sesión.
 */
export const MINUTOS_INACTIVIDAD = 15;
export const SEGUNDOS_AVISO = 60;

/**
 * Estado según el tiempo transcurrido desde la última actividad.
 * Se calcula con relojes reales (no con temporizadores), así funciona aunque el
 * navegador haya pausado la pestaña (iPad bloqueado, pestaña en segundo plano).
 * @returns {{ fase: "activo" | "aviso" | "expirado", segundosRestantes: number }}
 */
export function estadoInactividad(ultimaActividad, ahora, { minutos = MINUTOS_INACTIVIDAD, segundosAviso = SEGUNDOS_AVISO } = {}) {
  const limite = minutos * 60 * 1000;
  const transcurrido = Math.max(0, ahora - ultimaActividad);
  const restante = limite + segundosAviso * 1000 - transcurrido;
  if (restante <= 0) return { fase: "expirado", segundosRestantes: 0 };
  if (transcurrido >= limite) return { fase: "aviso", segundosRestantes: Math.ceil(restante / 1000) };
  return { fase: "activo", segundosRestantes: Math.ceil(restante / 1000) };
}
