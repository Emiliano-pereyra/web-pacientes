import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function getStringOrDash(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  return String(value);
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Falta el parámetro id del paciente" }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } },
      );
    }

    const body = await req.json();
    console.log("Datos recibidos (Familia/Apoderados):", body);

    const pacienteDocRef = doc(db, "pacientes", "lista", "nombresPacientes", id);
    const docSnap = await getDoc(pacienteDocRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Paciente no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const updateData = {};

    // === DATOS DEL PACIENTE (2 campos) ===
    if (body.nombreCompleto !== undefined) updateData.nombreCompleto = getStringOrDash(body.nombreCompleto);
    if (body.dni !== undefined) updateData.dni = getStringOrDash(body.dni);

    // === INFORMACIÓN ADICIONAL / APODERADOS (5 campos) ===
    if (body.yo !== undefined) updateData.apoderadoNombre = getStringOrDash(body.yo);
    if (body.dniNumero !== undefined) updateData.apoderadoDni = getStringOrDash(body.dniNumero);
    if (body.calidad !== undefined) updateData.apoderadoParentesco = getStringOrDash(body.calidad);
    if (body.residenteNombre !== undefined) updateData.residenteNombre = getStringOrDash(body.residenteNombre);
    if (body.textoConsentimiento !== undefined) updateData.consentimientoTexto = getStringOrDash(body.textoConsentimiento);

    // === ACTUALIZACIÓN EN FIRESTORE ===
    if (Object.keys(updateData).length > 0) {
      await updateDoc(pacienteDocRef, updateData);
    }

    return new Response(
      JSON.stringify({ message: "Datos de familia/apoderados actualizados correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error) {
    console.error("Error actualizando familia/apoderados:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}