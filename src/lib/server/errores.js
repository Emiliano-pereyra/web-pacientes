/** Errores de negocio y su respuesta HTTP (solo servidor). */

export class ErrorNegocio extends Error {
  constructor(mensaje, status = 400, detalles = null) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

/** Respuesta HTTP uniforme para errores. */
export function respuestaError(error) {
  if (error instanceof ErrorNegocio) {
    return Response.json({ error: error.message, detalles: error.detalles }, { status: error.status });
  }
  console.error("Error inesperado:", error?.message);
  return Response.json({ error: "Error interno del servidor" }, { status: 500 });
}
