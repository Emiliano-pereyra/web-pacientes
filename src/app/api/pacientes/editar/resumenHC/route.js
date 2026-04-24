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
    console.log("Datos recibidos (Resumen HC):", body);

    const pacienteDocRef = doc(db, "pacientes", "lista", "nombresPacientes", id);
    const docSnap = await getDoc(pacienteDocRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Paciente no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const updateData = {};

    // === PACIENTE (6 campos) ===
    if (body.fecha !== undefined) updateData.fecha = getStringOrDash(body.fecha);
    if (body.nombreCompleto !== undefined) updateData.nombreCompleto = getStringOrDash(body.nombreCompleto);
    if (body.os !== undefined) updateData.os = getStringOrDash(body.os);
    if (body.dni !== undefined) updateData.dni = getStringOrDash(body.dni);
    if (body.edad !== undefined) updateData.edad = getStringOrDash(body.edad);
    if (body.afNumero !== undefined) updateData.afNumero = getStringOrDash(body.afNumero);

    // === ENFERMEDAD DE BASE (2 campos) ===
    if (body.enfermedadBase !== undefined) updateData.enfermedadBase = getStringOrDash(body.enfermedadBase);
    if (body.fechaEnfermedadBase !== undefined) updateData.fechaEnfermedadBase = getStringOrDash(body.fechaEnfermedadBase);

    // === ENFERMEDAD ACTUAL (2 campos) ===
    if (body.enfermedadActual !== undefined) updateData.enfermedadActual = getStringOrDash(body.enfermedadActual);
    if (body.fechaUltModifEnfermedadActual !== undefined) updateData.fechaUltModifEnfermedadActual = getStringOrDash(body.fechaUltModifEnfermedadActual);

    // === TRATAMIENTO DE BASE (2 campos) ===
    if (body.tratamientoBase !== undefined) updateData.tratamientoBase = getStringOrDash(body.tratamientoBase);
    if (body.fechaTratamientoBase !== undefined) updateData.fechaTratamientoBase = getStringOrDash(body.fechaTratamientoBase);

    // === ACTUALIZACIÓN EN FIRESTORE ===
    if (Object.keys(updateData).length > 0) {
      await updateDoc(pacienteDocRef, updateData);
    }

    return new Response(
      JSON.stringify({ message: "Resumen de historia clínica actualizado correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error) {
    console.error("Error actualizando resumen HC:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}