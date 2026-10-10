/**
 * Firebase en el navegador: solo se usa para iniciar sesión.
 * Los datos se leen y escriben siempre a través de la API (ver src/lib/server).
 */
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyA0UHMyHqtxx5yDsBaRFXbMkTbfkF4qYs0",
  authDomain: "pacientes-2c28e.firebaseapp.com",
  projectId: "pacientes-2c28e",
  storageBucket: "pacientes-2c28e.firebasestorage.app",
  messagingSenderId: "458153598528",
  appId: "1:458153598528:web:f92a305edc99cb269949a5",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
