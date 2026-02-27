import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

/**
  Convierte un nombre completo en un ID válido para Firestore
  Ej: "María José López" → "María_José_López"
  NOTA: Se preservan caracteres especiales como ñ, acentos, tildes
 */
function convertirNombreAId(nombre) {
  if (!nombre) return "";
  return nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("_");
}

function getStringOrDash(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  return String(value);
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Datos recibidos:", body);

    const { nombreCompleto } = body;

    if (!nombreCompleto?.trim()) {
      return new Response(JSON.stringify({ error: "El nombre completo es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const id = convertirNombreAId(nombreCompleto);

    if (!id) {
      return new Response(JSON.stringify({ error: "Nombre inválido para generar ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const fechaActual = new Date().toISOString().split("T")[0];

    const paciente = {
      // === DATOS PERSONALES ===
      afiliadoNumero: getStringOrDash(body.afiliadoNumero),
      dni: getStringOrDash(body.dni),
      edad: getStringOrDash(body.edad),
      fechaIngreso: getStringOrDash(body.fechaIngreso),
      fechaNacimiento: getStringOrDash(body.fechaNacimiento),
      genero: getStringOrDash(body.genero),
      nombreCompleto: getStringOrDash(body.nombreCompleto),
      obraSocial: getStringOrDash(body.obraSocial),
      urlFoto: getStringOrDash(body.urlFoto),

      // === ANTECEDENTES (Texto Libre - Nueva estructura) ===
      antecedentesCardiovascular: getStringOrDash(body.antecedentesCardiovascular),
      antecedentesDigestivo: getStringOrDash(body.antecedentesDigestivo),
      antecedentesMetabolico: getStringOrDash(body.antecedentesMetabolico),
      antecedentesNeurologico: getStringOrDash(body.antecedentesNeurologico),
      antecedentesUrologico: getStringOrDash(body.antecedentesUrologico),
      antecedentesPsiquiatrico: getStringOrDash(body.antecedentesPsiquiatrico),
      antecedentesOtros: getStringOrDash(body.antecedentesOtros),

      // === EXAMEN FÍSICO (Texto Libre - Nueva estructura) ===
      examenOrientacion: getStringOrDash(body.examenOrientacion),
      examenCardiovascular: getStringOrDash(body.examenCardiovascular),
      examenRespiratorio: getStringOrDash(body.examenRespiratorio),
      examenDigestivo: getStringOrDash(body.examenDigestivo),
      examenGenitourinario: getStringOrDash(body.examenGenitourinario),
      examenNeurologico: getStringOrDash(body.examenNeurologico),
      examenOtros: getStringOrDash(body.examenOtros),

      // === TRATAMIENTO ACTUAL (Campo único de texto libre) ===
      tratamientoActual: getStringOrDash(body.tratamientoActual),

      // === CAMPOS DE HISTORIA CLÍNICA / INTERCONSULTA (Se mantienen) ===
      antecedentesPatologicos: getStringOrDash(body.antecedentesPatologicos),
      enfermedadActual: getStringOrDash(body.enfermedadActual),
      enfermedadBase: getStringOrDash(body.enfermedadBase),
      fechaEnfermedadBase: getStringOrDash(body.fechaEnfermedadBase),
      informeInterconsulta: getStringOrDash(body.informeInterconsulta),
      tratamientoBase: getStringOrDash(body.tratamientoBase),

      // === FECHAS AUTO-GENERADAS AL CREAR (Mantener por confirmación) ===
      // Estas fechas se setean automáticamente con la fecha de creación del paciente
      fechaUltModifAntecedentesPatologicos: fechaActual,
      fechaAnteriorModifAntecedentesPatologicos: getStringOrDash(body.fechaAnteriorModifAntecedentesPatologicos),
      
      fechaUltModifEnfermedadActual: fechaActual,
      fechaAnteriorModifEnfermedadActual: getStringOrDash(body.fechaAnteriorModifEnfermedadActual),
      
      // Fechas de tratamientos (se mantienen por si se usan en el futuro)
      fechaTratamientoBase: getStringOrDash(body.fechaTratamientoBase),
      fechaTratamientoActual: getStringOrDash(body.fechaTratamientoActual),
    };

    const pacienteDocRef = doc(
      db,
      "pacientes",
      "lista",
      "nombresPacientes",
      id
    );

    await setDoc(pacienteDocRef, paciente);

    return new Response(
      JSON.stringify({ message: "Paciente creado correctamente", id }),
      { 
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("Error creando paciente:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}