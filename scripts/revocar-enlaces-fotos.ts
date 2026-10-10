/**
 * Revoca los enlaces permanentes de las fotos y archivos de pacientes.
 *
 * Antes, cada archivo subido tenía un token de descarga de Firebase: su enlace
 * funcionaba para siempre y sin iniciar sesión. Ahora la app usa enlaces firmados
 * que vencen (ver src/lib/server/archivos.js). Este script borra los tokens viejos,
 * así los enlaces que hayan quedado guardados o compartidos dejan de funcionar.
 *
 * Uso (con GOOGLE_APPLICATION_CREDENTIALS=./service-account.json):
 *   npm run revocar-enlaces              # simulación: muestra qué archivos tienen token
 *   npm run revocar-enlaces -- --aplicar  # borra los tokens
 *
 * Es idempotente. No borra ni modifica los archivos, solo su token de descarga.
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const APLICAR = process.argv.includes("--aplicar");
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "pacientes-2c28e";
const BUCKET = process.env.FIREBASE_STORAGE_BUCKET || "pacientes-2c28e.firebasestorage.app";

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID, storageBucket: BUCKET });
const bucket = getStorage().bucket();

async function main() {
  const [archivos] = await bucket.getFiles({ prefix: "pacientes/" });
  console.log(`Archivos de pacientes: ${archivos.length}`);

  let conToken = 0;
  let revocados = 0;
  for (const archivo of archivos) {
    const [meta] = await archivo.getMetadata();
    if (!meta.metadata?.firebaseStorageDownloadTokens) continue;
    conToken++;
    console.log(`- ${archivo.name}`);
    if (!APLICAR) continue;
    // null borra la clave de la metadata personalizada
    await archivo.setMetadata({ metadata: { firebaseStorageDownloadTokens: null } });
    revocados++;
  }

  console.log(`Con enlace permanente: ${conToken}`);
  console.log(
    APLICAR ? `Enlaces revocados: ${revocados}` : "Simulación terminada. Ejecutá con --aplicar para revocarlos.",
  );
}

main().catch((e) => {
  console.error(`Error: ${e.message}`);
  if (/billing/i.test(e.message)) {
    console.error("La cuenta de facturación del proyecto está desactivada: Storage requiere el plan Blaze.");
  }
  process.exit(1);
});
