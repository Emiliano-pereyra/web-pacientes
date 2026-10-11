/**
 * Cierre diario de sesiones: toda sesión vence a la medianoche (hora del dispositivo) del
 * día en que se inició. MINUTOS_AVISO antes se avisa para que se guarde lo pendiente.
 */
export const MINUTOS_AVISO = 10;

/** Medianoche siguiente a `t` (fin del día local). */
export function finDelDia(t) {
  const d = new Date(t);
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

/**
 * Estado de una sesión iniciada en `inicioSesion`.
 * Se calcula con relojes reales (no con temporizadores), así una sesión que quedó abierta
 * de un día para el otro (iPad bloqueado, pestaña en segundo plano) se cierra al volver.
 * @returns {{ fase: "activo" | "aviso" | "expirado", minutosRestantes: number }}
 */
export function estadoCierreDiario(inicioSesion, ahora, { minutosAviso = MINUTOS_AVISO } = {}) {
  const restante = finDelDia(inicioSesion) - ahora;
  if (restante <= 0) return { fase: "expirado", minutosRestantes: 0 };
  const minutosRestantes = Math.ceil(restante / 60_000);
  return { fase: restante <= minutosAviso * 60_000 ? "aviso" : "activo", minutosRestantes };
}
