import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const listaRef = collection(db, "pacientes", "lista", "nombresPacientes");
    const snapshot = await getDocs(listaRef);

    const pacientes = snapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.id.replace(/_/g, " "),
    }));

    return new Response(JSON.stringify(pacientes), { status: 200 });
  } catch (error) {
    console.error("Error obteniendo pacientes:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
