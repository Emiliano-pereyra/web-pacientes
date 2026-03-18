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
    console.log("Datos recibidos (Clínico):", body);

    const pacienteDocRef = doc(db, "pacientes", "lista", "nombresPacientes", id);
    const docSnap = await getDoc(pacienteDocRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Paciente no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const updateData = {};

    // === ANTECEDENTES (24 campos) ===
    if (body.TA !== undefined) updateData.TA = getStringOrDash(body.TA);
    if (body.Cardio !== undefined) updateData.Cardio = getStringOrDash(body.Cardio);
    if (body.Digestivos !== undefined) updateData.Digestivos = getStringOrDash(body.Digestivos);
    if (body.Constipacion !== undefined) updateData.Constipacion = getStringOrDash(body.Constipacion);
    if (body.Metabolicas !== undefined) updateData.Metabolicas = getStringOrDash(body.Metabolicas);
    if (body.Auditivas !== undefined) updateData.Auditivas = getStringOrDash(body.Auditivas);
    if (body.Olfativas !== undefined) updateData.Olfativas = getStringOrDash(body.Olfativas);
    if (body.Visuales !== undefined) updateData.Visuales = getStringOrDash(body.Visuales);
    if (body.Gustativas !== undefined) updateData.Gustativas = getStringOrDash(body.Gustativas);
    if (body.Ginecologicas !== undefined) updateData.Ginecologicas = getStringOrDash(body.Ginecologicas);
    if (body.Edemas !== undefined) updateData.Edemas = getStringOrDash(body.Edemas);
    if (body.Varices !== undefined) updateData.Varices = getStringOrDash(body.Varices);
    if (body.Ulceras !== undefined) updateData.Ulceras = getStringOrDash(body.Ulceras);
    if (body.Tiroides !== undefined) updateData.Tiroides = getStringOrDash(body.Tiroides);
    if (body.Paralisis !== undefined) updateData.Paralisis = getStringOrDash(body.Paralisis);
    if (body.Parestesias !== undefined) updateData.Parestesias = getStringOrDash(body.Parestesias);
    if (body.Temblores !== undefined) updateData.Temblores = getStringOrDash(body.Temblores);
    if (body.Convulsiones !== undefined) updateData.Convulsiones = getStringOrDash(body.Convulsiones);
    if (body.Afasias !== undefined) updateData.Afasias = getStringOrDash(body.Afasias);
    if (body.Disartria !== undefined) updateData.Disartria = getStringOrDash(body.Disartria);
    if (body.Urologicas !== undefined) updateData.Urologicas = getStringOrDash(body.Urologicas);
    if (body.Dermatologicas !== undefined) updateData.Dermatologicas = getStringOrDash(body.Dermatologicas);
    if (body.PsiquicaActiva !== undefined) updateData.PsiquicaActiva = getStringOrDash(body.PsiquicaActiva);
    if (body.PsiquicaPasiva !== undefined) updateData.PsiquicaPasiva = getStringOrDash(body.PsiquicaPasiva);

    // === EXAMEN FÍSICO (36 campos) ===
    if (body.FacialOjos !== undefined) updateData.FacialOjos = getStringOrDash(body.FacialOjos);
    if (body.FacialBoca !== undefined) updateData.FacialBoca = getStringOrDash(body.FacialBoca);
    if (body.FacialDenticion !== undefined) updateData.FacialDenticion = getStringOrDash(body.FacialDenticion);
    if (body.CardioR1R2 !== undefined) updateData.CardioR1R2 = getStringOrDash(body.CardioR1R2);
    if (body.PPBL !== undefined) updateData.PPBL = getStringOrDash(body.PPBL);
    if (body.GenitourinarioEsfinter !== undefined) updateData.GenitourinarioEsfinter = getStringOrDash(body.GenitourinarioEsfinter);
    if (body.GenitourinarioOtros !== undefined) updateData.GenitourinarioOtros = getStringOrDash(body.GenitourinarioOtros);
    if (body.TrAtencion !== undefined) updateData.TrAtencion = getStringOrDash(body.TrAtencion);
    if (body.TrOrientacion !== undefined) updateData.TrOrientacion = getStringOrDash(body.TrOrientacion);
    if (body.TrMemoria !== undefined) updateData.TrMemoria = getStringOrDash(body.TrMemoria);
    if (body.SignoDepre !== undefined) updateData.SignoDepre = getStringOrDash(body.SignoDepre);
    if (body.TrSueno !== undefined) updateData.TrSueno = getStringOrDash(body.TrSueno);
    if (body.Adenopatias !== undefined) updateData.Adenopatias = getStringOrDash(body.Adenopatias);
    if (body.Bocio !== undefined) updateData.Bocio = getStringOrDash(body.Bocio);
    if (body.CardiacaTA !== undefined) updateData.CardiacaTA = getStringOrDash(body.CardiacaTA);
    if (body.CardiacaEdemas !== undefined) updateData.CardiacaEdemas = getStringOrDash(body.CardiacaEdemas);
    if (body.TEJCP !== undefined) updateData.TEJCP = getStringOrDash(body.TEJCP);
    if (body.Peso !== undefined) updateData.Peso = getStringOrDash(body.Peso);
    if (body.Percusion !== undefined) updateData.Percusion = getStringOrDash(body.Percusion);
    if (body.Auscultacion !== undefined) updateData.Auscultacion = getStringOrDash(body.Auscultacion);
    if (body.RespiratoriaOtros !== undefined) updateData.RespiratoriaOtros = getStringOrDash(body.RespiratoriaOtros);
    if (body.Abdomen !== undefined) updateData.Abdomen = getStringOrDash(body.Abdomen);
    if (body.Palpacion !== undefined) updateData.Palpacion = getStringOrDash(body.Palpacion);
    if (body.Catarsis !== undefined) updateData.Catarsis = getStringOrDash(body.Catarsis);
    if (body.DigestivoEsfinter !== undefined) updateData.DigestivoEsfinter = getStringOrDash(body.DigestivoEsfinter);
    if (body.DigestivoOtros !== undefined) updateData.DigestivoOtros = getStringOrDash(body.DigestivoOtros);
    if (body.SNCAltMotoras !== undefined) updateData.SNCAltMotoras = getStringOrDash(body.SNCAltMotoras);
    if (body.SNCSensitivas !== undefined) updateData.SNCSensitivas = getStringOrDash(body.SNCSensitivas);
    if (body.SNCTemblores !== undefined) updateData.SNCTemblores = getStringOrDash(body.SNCTemblores);
    if (body.SNCPostura !== undefined) updateData.SNCPostura = getStringOrDash(body.SNCPostura);
    if (body.SNCEquilibrio !== undefined) updateData.SNCEquilibrio = getStringOrDash(body.SNCEquilibrio);
    if (body.SNCMarcha !== undefined) updateData.SNCMarcha = getStringOrDash(body.SNCMarcha);

    // === TRATAMIENTO ACTUAL Y EVOLUCIÓN ===
    if (body.TratamientoActual !== undefined) updateData.TratamientoActual = getStringOrDash(body.TratamientoActual);
    if (body.texto !== undefined) updateData.evolucionTexto = getStringOrDash(body.texto);

    if (Object.keys(updateData).length > 0) {
      await updateDoc(pacienteDocRef, updateData);
    }

    return new Response(
      JSON.stringify({ message: "Datos clínicos actualizados correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error) {
    console.error("Error actualizando clínico:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}