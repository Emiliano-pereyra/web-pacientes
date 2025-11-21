// app/api/pacientes/crear/route.js
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

function convertirNombreAId(nombre) {
  if (!nombre) return "";
  return nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('_');
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Datos recibidos para crear paciente:", body);

    const { id: nombreOriginal, ...otrosDatos } = body;

    if (!nombreOriginal) {
      return new Response(
        JSON.stringify({ error: "Falta el campo 'id' (nombre del paciente) en el cuerpo de la solicitud" }),
        { status: 400 }
      );
    }

    const id = convertirNombreAId(nombreOriginal);
    console.log(`Nombre original: "${nombreOriginal}", ID generado: "${id}"`);

    if (!id) {
      return new Response(
        JSON.stringify({ error: "El nombre del paciente no es válido o está vacío después de procesarlo" }),
        { status: 400 }
      );
    }

    const pacienteDocRef = doc(db, "pacientes", "lista", "nombresPacientes", id);

    await setDoc(pacienteDocRef, otrosDatos);

    return new Response(
      JSON.stringify({ message: "Paciente creado correctamente", id }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando paciente:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}