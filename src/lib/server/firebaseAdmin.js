/**
 * Firebase Admin (solo servidor).
 *
 * El servidor accede a Firestore y Storage con privilegios de administrador,
 * así las reglas pueden negar todo acceso directo desde el navegador.
 *
 * Credenciales:
 *  - FIREBASE_SERVICE_ACCOUNT: el JSON de la cuenta de servicio en una sola
 *    variable (es lo que se configura en Vercel).
 *  - Si no está, GOOGLE_APPLICATION_CREDENTIALS con la ruta al archivo
 *    (útil en desarrollo: ./service-account.json).
 */
import { cert, applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "pacientes-2c28e";
const BUCKET = process.env.FIREBASE_STORAGE_BUCKET || "pacientes-2c28e.firebasestorage.app";

function credencial() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (json) return cert(JSON.parse(json));
  return applicationDefault();
}

const app =
  getApps()[0] ||
  initializeApp({ credential: credencial(), projectId: PROJECT_ID, storageBucket: BUCKET });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminBucket = getStorage(app).bucket();
