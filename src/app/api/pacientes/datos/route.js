import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Falta el parámetro id del paciente" }),
      { status: 400 }
    );
  }

  try {
    const pacienteDocRef = doc(db, "pacientes", "lista", "nombresPacientes", id);
    const pacienteDoc = await getDoc(pacienteDocRef);

    if (!pacienteDoc.exists()) {
      return new Response(
        JSON.stringify({ error: "No se encontró el paciente" }),
        { status: 404 }
      );
    }

    const datos = pacienteDoc.data();
    return new Response(JSON.stringify(datos), { status: 200 });
  } catch (error) {
    console.error("Error obteniendo datos del paciente:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}