/** Formatos de presentación del front. */

const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

/** 512 → "512 B", 2048 → "2 KB", 3_500_000 → "3,3 MB" */
export function formatearTamano(bytes) {
  if (typeof bytes !== "number" || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${numero.format(bytes / 1024)} KB`;
  return `${numero.format(bytes / 1024 / 1024)} MB`;
}

/** 1 → "1 archivo", 3 → "3 archivos" */
export function plural(n, singular, pluralTexto = `${singular}s`) {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}
