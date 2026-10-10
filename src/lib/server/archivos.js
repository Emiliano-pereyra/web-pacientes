/** Archivos de pacientes en Firebase Storage (solo servidor, con Firebase Admin). */
import { getDownloadURL } from "firebase-admin/storage";
import { adminBucket } from "@/lib/server/firebaseAdmin";

/**
 * Sube un archivo y devuelve { url, path }.
 * La URL lleva el token de descarga de Firebase, así el navegador la puede
 * mostrar aunque las reglas de Storage nieguen todo acceso directo.
 */
export async function subirArchivo(path, buffer, { contentType, metadata = {} } = {}) {
  const archivo = adminBucket.file(path);
  await archivo.save(buffer, { contentType, resumable: false, metadata: { metadata } });
  return { url: await getDownloadURL(archivo), path };
}

export async function eliminarArchivo(path) {
  await adminBucket.file(path).delete({ ignoreNotFound: true });
}
