/**
 * Optimización de fotos antes de subirlas: una foto de celular (3–5 MB, 4000 px) se
 * achica a MAX_LADO px en su lado mayor y se guarda como JPEG. Queda en unos 300–600 KB,
 * con detalle de sobra para la historia clínica, carga rápido en el iPad y casi no
 * ocupa espacio en Storage.
 */
export const MAX_LADO = 2000;
export const CALIDAD = 0.82;
const SIN_OPTIMIZAR_DEBAJO_DE = 400 * 1024; // ya livianas: se suben tal cual
const OPTIMIZABLES = ["image/jpeg", "image/png", "image/webp"];

/** Medidas que respetan la proporción con el lado mayor ≤ maxLado (nunca agranda). */
export function medidasReducidas(ancho, alto, maxLado = MAX_LADO) {
  const factor = Math.min(1, maxLado / Math.max(ancho, alto));
  return { ancho: Math.max(1, Math.round(ancho * factor)), alto: Math.max(1, Math.round(alto * factor)) };
}

/** ¿Vale la pena procesar este archivo? */
export function esOptimizable(archivo) {
  return OPTIMIZABLES.includes(archivo?.type) && archivo.size >= SIN_OPTIMIZAR_DEBAJO_DE;
}

/** "foto.HEIC.png" → "foto.HEIC.jpg"; "scan" → "scan.jpg" */
export function nombreJpg(nombre) {
  const base = String(nombre || "foto").replace(/\.[^./\\]+$/, "");
  return `${base || "foto"}.jpg`;
}

function aBlob(canvas, tipo, calidad) {
  return new Promise((resolve) => canvas.toBlob(resolve, tipo, calidad));
}

/**
 * Devuelve `{ archivo, optimizada, tamanoOriginal }`. Si el navegador no puede procesar
 * la imagen, o el resultado no es más liviano, devuelve el archivo original sin cambios:
 * optimizar nunca impide subir.
 */
export async function optimizarImagen(archivo, { maxLado = MAX_LADO, calidad = CALIDAD } = {}) {
  const sinCambios = { archivo, optimizada: false, tamanoOriginal: archivo?.size ?? 0 };
  if (!esOptimizable(archivo) || typeof createImageBitmap !== "function") return sinCambios;
  try {
    // "from-image" aplica la rotación EXIF: las fotos verticales del celular no quedan acostadas
    const bitmap = await createImageBitmap(archivo, { imageOrientation: "from-image" });
    const { ancho, alto } = medidasReducidas(bitmap.width, bitmap.height, maxLado);
    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // un PNG con transparencia no queda con fondo negro
    ctx.fillRect(0, 0, ancho, alto);
    ctx.drawImage(bitmap, 0, 0, ancho, alto);
    bitmap.close?.();
    const blob = await aBlob(canvas, "image/jpeg", calidad);
    if (!blob || blob.size >= archivo.size) return sinCambios;
    const optimizado = new File([blob], nombreJpg(archivo.name), { type: "image/jpeg", lastModified: archivo.lastModified });
    return { archivo: optimizado, optimizada: true, tamanoOriginal: archivo.size };
  } catch {
    return sinCambios;
  }
}
