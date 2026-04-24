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
    console.log("Datos recibidos para actualizar (Historia Clínica):", body);

    const pacienteDocRef = doc(db, "pacientes", "lista", "nombresPacientes", id);
    const docSnap = await getDoc(pacienteDocRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Paciente no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const existingData = docSnap.data();
    const updateData = {};

    // === DATOS PERSONALES (Sección "Informacion") ===
    if (body.nombreCompleto !== undefined) updateData.nombreCompleto = getStringOrDash(body.nombreCompleto);
    if (body.dni !== undefined) updateData.dni = getStringOrDash(body.dni);
    if (body.fechaNacimiento !== undefined) updateData.fechaNacimiento = getStringOrDash(body.fechaNacimiento);
    if (body.edad !== undefined) updateData.edad = getStringOrDash(body.edad);
    if (body.obraSocial !== undefined) updateData.obraSocial = getStringOrDash(body.obraSocial);
    if (body.afiliadoNumero !== undefined) updateData.afiliadoNumero = getStringOrDash(body.afiliadoNumero);
    if (body.fechaIngreso !== undefined) updateData.fechaIngreso = getStringOrDash(body.fechaIngreso);

    // === ANTECEDENTES (Texto Libre - 7 campos) ===
    if (body.antecedentesCardiovascular !== undefined) updateData.antecedentesCardiovascular = getStringOrDash(body.antecedentesCardiovascular);
    if (body.antecedentesDigestivo !== undefined) updateData.antecedentesDigestivo = getStringOrDash(body.antecedentesDigestivo);
    if (body.antecedentesMetabolico !== undefined) updateData.antecedentesMetabolico = getStringOrDash(body.antecedentesMetabolico);
    if (body.antecedentesNeurologico !== undefined) updateData.antecedentesNeurologico = getStringOrDash(body.antecedentesNeurologico);
    if (body.antecedentesUrologico !== undefined) updateData.antecedentesUrologico = getStringOrDash(body.antecedentesUrologico);
    if (body.antecedentesPsiquiatrico !== undefined) updateData.antecedentesPsiquiatrico = getStringOrDash(body.antecedentesPsiquiatrico);
    if (body.antecedentesOtros !== undefined) updateData.antecedentesOtros = getStringOrDash(body.antecedentesOtros);

    // === EXAMEN FÍSICO (Texto Libre - 7 campos) ===
    if (body.examenOrientacion !== undefined) updateData.examenOrientacion = getStringOrDash(body.examenOrientacion);
    if (body.examenCardiovascular !== undefined) updateData.examenCardiovascular = getStringOrDash(body.examenCardiovascular);
    if (body.examenRespiratorio !== undefined) updateData.examenRespiratorio = getStringOrDash(body.examenRespiratorio);
    if (body.examenDigestivo !== undefined) updateData.examenDigestivo = getStringOrDash(body.examenDigestivo);
    if (body.examenGenitourinario !== undefined) updateData.examenGenitourinario = getStringOrDash(body.examenGenitourinario);
    if (body.examenNeurologico !== undefined) updateData.examenNeurologico = getStringOrDash(body.examenNeurologico);
    if (body.examenOtros !== undefined) updateData.examenOtros = getStringOrDash(body.examenOtros);

    // === TRATAMIENTO ACTUAL (Campo único) ===
    if (body.tratamientoActual !== undefined) updateData.tratamientoActual = getStringOrDash(body.tratamientoActual);

    const ahora = new Date().toISOString().split("T")[0];

    // === ACTUALIZACIÓN EN FIRESTORE ===
    await updateDoc(pacienteDocRef, updateData);

    return new Response(
      JSON.stringify({ message: "Datos de historia clínica actualizados correctamente" }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("Error actualizando historia clínica:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}