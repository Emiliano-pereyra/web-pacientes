/**
 * Archivos de pacientes en Firebase Storage (solo servidor, con Firebase Admin).
 *
 * En la base se guarda solo la ruta del archivo (`path`), nunca un enlace.
 * Para mostrarlo, la API genera un enlace firmado que vence a los MINUTOS_ENLACE
 * minutos y solo se entrega a usuarios con sesión. No se crean tokens de descarga
 * permanentes (los de Firebase funcionaban para siempre y sin sesión).
 */
import { adminBucket } from "@/lib/server/firebaseAdmin";
import { pathDeUrlFirebase } from "@/lib/paciente/fotos";

export const MINUTOS_ENLACE = 30;

/** Sube un archivo y devuelve su ruta. No genera enlaces públicos. */
export async function subirArchivo(path, buffer, { contentType, metadata = {} } = {}) {
  await adminBucket.file(path).save(buffer, { contentType, resumable: false, metadata: { metadata } });
  return { path };
}

export async function eliminarArchivo(path) {
  await adminBucket.file(path).delete({ ignoreNotFound: true });
}

/** Enlace de lectura que vence a los MINUTOS_ENLACE minutos (o null si no se puede firmar). */
export async function urlFirmada(path) {
  if (!path) return null;
  try {
    const [url] = await adminBucket.file(path).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + MINUTOS_ENLACE * 60 * 1000,
    });
    return url;
  } catch (error) {
    console.error("No se pudo firmar el enlace del archivo:", error?.message);
    return null;
  }
}

/**
 * Enlace para mostrar una foto guardada con cualquiera de los formatos:
 *  - { path } (formato actual) → enlace firmado;
 *  - enlace viejo de Firebase Storage con token → se firma a partir de su ruta;
 *  - otro enlace externo (p. ej. foto de Google) → se devuelve igual.
 */
export async function enlaceDeFoto({ path, url } = {}) {
  const ruta = path || pathDeUrlFirebase(url);
  if (ruta) return urlFirmada(ruta);
  return url && /^https:\/\//.test(url) ? url : null;
}

/** Item de galería para el navegador: con enlace firmado y sin datos internos. */
export async function fotoParaCliente(foto) {
  const { url: _viejo, ...resto } = foto;
  return { ...resto, url: await enlaceDeFoto(foto) };
}
