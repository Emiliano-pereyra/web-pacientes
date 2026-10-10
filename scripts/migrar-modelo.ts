/**
 * Migra todos los pacientes al modelo unificado (schemaVersion 2).
 *
 * Uso:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run migrar              # simulación, no escribe
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run migrar -- --aplicar
 *
 * - Antes de escribir guarda un respaldo completo en ./backups/ (no se sube al repo).
 * - Es idempotente: los pacientes ya migrados se saltean.
 * - La evolución vieja pasa a la subcolección `evoluciones`, y los valores "previos"
 *   (enfermedadPrevia, antecedentesPatologicosPrevio) pasan a `historial`.
 * - El documento se reescribe completo: los campos viejos desaparecen.
 *   No hace falta correrlo para que la app funcione (la app lee ambos modelos y
 *   migra cada paciente la primera vez que se lo edita), pero deja la base prolija.
 */
import fs from "node:fs";
import path from "node:path";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { esDocumentoLegacy, migrarDocumento } from "../src/lib/paciente/migracion";

const APLICAR = process.argv.includes("--aplicar");
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "pacientes-2c28e";

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();
const coleccion = db.collection("pacientes").doc("lista").collection("nombresPacientes");

async function main() {
  const snap = await coleccion.get();
  console.log(`Pacientes encontrados: ${snap.size}`);

  const legacy = snap.docs.filter((d) => esDocumentoLegacy(d.data()));
  console.log(`A migrar: ${legacy.length} · ya migrados: ${snap.size - legacy.length}`);

  if (legacy.length === 0) return;

  // Respaldo
  const dirBackup = path.join(process.cwd(), "backups");
  fs.mkdirSync(dirBackup, { recursive: true });
  const archivo = path.join(dirBackup, `pacientes-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(archivo, JSON.stringify(Object.fromEntries(snap.docs.map((d) => [d.id, d.data()])), null, 2));
  console.log(`Respaldo guardado en ${archivo}`);

  const ahora = new Date().toISOString();
  let ok = 0;

  for (const d of legacy) {
    const { doc, evoluciones, historial } = migrarDocumento(d.data());
    doc.migradoEn = ahora;
    doc.actualizadoEn = doc.actualizadoEn || ahora;
    doc.creadoEn = doc.creadoEn || ahora;

    const nombre = doc.datosPersonales.nombreCompleto || d.id;
    console.log(`- ${nombre} (${d.id}): ${evoluciones.length} evolución(es), ${historial.length} registro(s) de historial`);

    if (!APLICAR) continue;

    const batch = db.batch();
    batch.set(d.ref, doc); // reemplaza el documento entero
    evoluciones.forEach((e) => batch.set(d.ref.collection("evoluciones").doc(), { ...e, creadoEn: ahora }));
    historial.forEach((h) => batch.set(d.ref.collection("historial").doc(), { ...h, creadoEn: ahora }));
    batch.set(d.ref.collection("historial").doc(), {
      creadoEn: ahora,
      profesional: "Script de migración",
      seccion: "migracion",
      cambios: [],
      descripcion: "Migración al modelo unificado (schemaVersion 2)",
    });
    await batch.commit();
    ok++;
  }

  console.log(APLICAR ? `Migrados: ${ok}` : "Simulación terminada. Ejecutá con --aplicar para escribir los cambios.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
