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
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }

    const body = await req.json();
    console.log("Datos recibidos (Interconsulta):", body);

    const pacienteDocRef = doc(
      db,
      "pacientes",
      "lista",
      "nombresPacientes",
      id,
    );
    const docSnap = await getDoc(pacienteDocRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Paciente no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const updateData = {};

    // === PACIENTE (6 campos) ===
    if (body.fecha !== undefined)
      updateData.fecha = getStringOrDash(body.fecha);
    if (body.nombreCompleto !== undefined)
      updateData.nombreCompleto = getStringOrDash(body.nombreCompleto);
    if (body.os !== undefined) updateData.os = getStringOrDash(body.os);
    if (body.dni !== undefined) updateData.dni = getStringOrDash(body.dni);
    if (body.especialidad !== undefined)
      updateData.especialidad = getStringOrDash(body.especialidad);
    if (body.afNumero !== undefined)
      updateData.afNumero = getStringOrDash(body.afNumero);

    // === ANTECEDENTES PATOLÓGICOS (2 campos) ===
    if (body.antecedentesPatologicosActual !== undefined)
      updateData.antecedentesPatologicosActual = getStringOrDash(
        body.antecedentesPatologicosActual,
      );
    if (body.fechaUltModifAntecedentesPatologicos !== undefined)
      updateData.fechaUltModifAntecedentesPatologicos = getStringOrDash(
        body.fechaUltModifAntecedentesPatologicos,
      );

    // === ENFERMEDAD ACTUAL (2 campos) ===
    if (body.enfermedadActual !== undefined)
      updateData.enfermedadActual = getStringOrDash(body.enfermedadActual);
    if (body.fechaUltModifEnfermedadActual !== undefined)
      updateData.fechaUltModifEnfermedadActual = getStringOrDash(
        body.fechaUltModifEnfermedadActual,
      );

    // === INFORME INTERCONSULTA (1 campo) ===
    if (body.informeInterconsulta !== undefined)
      updateData.informeInterconsulta = getStringOrDash(
        body.informeInterconsulta,
      );

    // === ACTUALIZACIÓN EN FIRESTORE ===
    if (Object.keys(updateData).length > 0) {
      await updateDoc(pacienteDocRef, updateData);
    }

    return new Response(
      JSON.stringify({ message: "Interconsulta actualizada correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("Error actualizando interconsulta:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
