import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const listaRef = collection(db, "pacientes", "lista", "nombresPacientes");
    const snapshot = await getDocs(listaRef);

<<<<<<< HEAD
    const pacientes = snapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.id.replace(/_/g, " "),
    }));
=======
    const pacientes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombreVisible: data.nombreCompleto?.trim() || doc.id.replace(/_/g, " "),
        nombreDerivado: doc.id.replace(/_/g, " "),
      };
    });
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453

    return new Response(JSON.stringify(pacientes), { status: 200 });
  } catch (error) {
    console.error("Error obteniendo pacientes:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
