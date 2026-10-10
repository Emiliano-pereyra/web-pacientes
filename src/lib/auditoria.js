/**
 * Registro de accesos (compartido entre API y front).
 *
 * Documento `auditoria/{id}`:
 *   { fecha, accion, uid, usuario, rol, pacienteId, pacienteNombre, detalle, ip, navegador }
 * Se escribe solo desde la API (Firebase Admin); nadie puede editarlo ni borrarlo desde la app.
 */
export const ACCIONES = {
  ver_paciente: "Abrió la ficha",
  imprimir: "Imprimió un PDF",
  ver_archivos: "Vio fotos y archivos",
  crear_paciente: "Creó el paciente",
  editar_paciente: "Editó datos",
  agregar_evolucion: "Agregó una evolución",
  subir_archivo: "Subió un archivo",
  eliminar_archivo: "Eliminó archivos",
  baja_paciente: "Dio de baja al paciente",
  reactivar_paciente: "Reactivó al paciente",
  anular_baja: "Anuló la baja por fallecimiento",
  crear_usuario: "Creó un usuario",
  editar_usuario: "Modificó un usuario",
};

/** Acciones que solo leen datos (las demás modifican algo). */
export const ACCIONES_LECTURA = ["ver_paciente", "imprimir", "ver_archivos"];

/** Minutos en los que se agrupan las lecturas repetidas de la misma persona sobre el mismo paciente. */
export const MINUTOS_AGRUPACION = 10;

/**
 * Id del registro agrupado: misma acción + paciente + usuario + detalle + ventana de tiempo.
 * (El detalle distingue, por ejemplo, imprimir PDFs de pestañas distintas.)
 */
export function claveAgrupada({ accion, pacienteId, uid, detalle = "" }, fecha) {
  const ventana = Math.floor(fecha.getTime() / (MINUTOS_AGRUPACION * 60 * 1000));
  const limpiar = (s) => String(s ?? "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  const resumenDetalle = limpiar(String(detalle).normalize("NFD"));
  return [accion, limpiar(pacienteId), limpiar(uid), resumenDetalle, ventana].join("_");
}

/** Navegador resumido para el registro ("Safari · iPad", "Chrome · Windows"). */
export function resumirNavegador(ua = "") {
  const s = String(ua);
  const navegador = /Edg\//.test(s)
    ? "Edge"
    : /Chrome\//.test(s)
      ? "Chrome"
      : /Firefox\//.test(s)
        ? "Firefox"
        : /Safari\//.test(s)
          ? "Safari"
          : "Otro";
  const sistema = /iPad/.test(s)
    ? "iPad"
    : /iPhone/.test(s)
      ? "iPhone"
      : /Android/.test(s)
        ? "Android"
        : /Windows/.test(s)
          ? "Windows"
          : /Mac OS X/.test(s)
            ? "Mac"
            : /Linux/.test(s)
              ? "Linux"
              : "";
  return sistema ? `${navegador} · ${sistema}` : navegador;
}
