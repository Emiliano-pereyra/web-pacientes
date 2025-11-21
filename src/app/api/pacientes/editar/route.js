import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Falta el parámetro id del paciente" }),
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("Datos recibidos para actualizar:", body);

    const pacienteDocRef = doc(db, "pacientes", "lista", "nombresPacientes", id);

    await updateDoc(pacienteDocRef, body);

    return new Response(
      JSON.stringify({ message: "Datos actualizados correctamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error actualizando datos del paciente:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}