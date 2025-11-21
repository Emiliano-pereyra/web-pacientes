import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyA0UHMyHqtxx5yDsBaRFXbMkTbfkF4qYs0",
  authDomain: "pacientes-2c28e.firebaseapp.com",
  projectId: "pacientes-2c28e",
  storageBucket: "pacientes-2c28e.firebasestorage.app",
  messagingSenderId: "458153598528",
  appId: "1:458153598528:web:f92a305edc99cb269949a5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
