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

/**
  Convierte un valor a string o retorna "-" si está vacío
  IMPORTANTE: No se aplica normalización para preservar ñ, acentos, tildes, etc.
 */
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
      return new Response(
        JSON.stringify({ error: "El nombre completo es obligatorio" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }

    const id = convertirNombreAId(nombreCompleto);

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Nombre inválido para generar ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
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
      antecedentesCardiovascular: getStringOrDash(
        body.antecedentesCardiovascular,
      ),
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

      // === SOCIAL (Para futura integración en creación/edición) ===
      acompanado: getStringOrDash(body.acompanado),
      conQuienVive: getStringOrDash(body.conQuienVive),
      concurreALaConsulta: getStringOrDash(body.concurreALaConsulta),
      conyuge: getStringOrDash(body.conyuge),
      hermanos: getStringOrDash(body.hermanos),
      hijos: getStringOrDash(body.hijos),
      otros: getStringOrDash(body.otros),

      // === MENTAL (Para futura integración en creación/edición) ===
      calculo1: getStringOrDash(body.calculo1),
      calculo2: getStringOrDash(body.calculo2),
      calculo3: getStringOrDash(body.calculo3),
      cierreOjosYHagalo: getStringOrDash(body.cierreOjosYHagalo),
      concurreALaConsultaMental: getStringOrDash(
        body.concurreALaConsultaMental,
      ),
      fraseEscrita: getStringOrDash(body.fraseEscrita),
      hijosMental: getStringOrDash(body.hijosMental),
      logradoCopieDibujo: getStringOrDash(body.logradoCopieDibujo),
      logradoDoblePapel: getStringOrDash(body.logradoDoblePapel),
      orientacionEnT: getStringOrDash(body.orientacionEnT),
      palabra1: getStringOrDash(body.palabra1),
      palabra1Memoria: getStringOrDash(body.palabra1Memoria),
      palabra2: getStringOrDash(body.palabra2),
      palabra2Memoria: getStringOrDash(body.palabra2Memoria),
      palabra3: getStringOrDash(body.palabra3),
      palabra3Memoria: getStringOrDash(body.palabra3Memoria),
      respuesta1: getStringOrDash(body.respuesta1),
      respuesta2: getStringOrDash(body.respuesta2),
      respuestaRepita: getStringOrDash(body.respuestaRepita),
      textoLeido: getStringOrDash(body.textoLeido),

      // === FUNCIONAL (Para futura integración en creación/edición) ===
      articulaciones: getStringOrDash(body.articulaciones),
      caidas: getStringOrDash(body.caidas),
      camina: getStringOrDash(body.camina),
      equilibrio: getStringOrDash(body.equilibrio),
      levantateYAnda: getStringOrDash(body.levantateYAnda),
      pasaMuchoTiempoSentado: getStringOrDash(body.pasaMuchoTiempoSentado),

      // === FAMILIA Y APODERADOS ===
      calidadDe: getStringOrDash(body.calidadDe),

      // === CLÍNICO / ANTECEDENTES PATOLÓGICOS DETALLADOS ===
      TA: getStringOrDash(body.TA),
      Cardio: getStringOrDash(body.Cardio),
      Digestivos: getStringOrDash(body.Digestivos),
      Constipacion: getStringOrDash(body.Constipacion),
      Metabolicas: getStringOrDash(body.Metabolicas),
      Auditivas: getStringOrDash(body.Auditivas),
      Olfativas: getStringOrDash(body.Olfativas),
      Visuales: getStringOrDash(body.Visuales),
      Gustativas: getStringOrDash(body.Gustativas),
      Ginecologicas: getStringOrDash(body.Ginecologicas),
      Edemas: getStringOrDash(body.Edemas),
      Varices: getStringOrDash(body.Varices),
      Ulceras: getStringOrDash(body.Ulceras),
      Tiroides: getStringOrDash(body.Tiroides),
      Paralisis: getStringOrDash(body.Paralisis),
      Parestesias: getStringOrDash(body.Parestesias),
      Temblores: getStringOrDash(body.Temblores),
      Convulsiones: getStringOrDash(body.Convulsiones),
      Afasias: getStringOrDash(body.Afasias),
      Disartria: getStringOrDash(body.Disartria),
      Urologicas: getStringOrDash(body.Urologicas),
      Dermatologicas: getStringOrDash(body.Dermatologicas),
      PsiquicaActiva: getStringOrDash(body.PsiquicaActiva),
      PsiquicaPasiva: getStringOrDash(body.PsiquicaPasiva),

      // === EXAMEN FÍSICO DETALLADO ===
      FacialOjos: getStringOrDash(body.FacialOjos),
      FacialBoca: getStringOrDash(body.FacialBoca),
      FacialDenticion: getStringOrDash(body.FacialDenticion),
      CardioR1R2: getStringOrDash(body.CardioR1R2),
      PPBL: getStringOrDash(body.PPBL),
      GenitourinarioEsfinter: getStringOrDash(body.GenitourinarioEsfinter),
      GenitourinarioOtros: getStringOrDash(body.GenitourinarioOtros),
      TrAtencion: getStringOrDash(body.TrAtencion),
      TrOrientacion: getStringOrDash(body.TrOrientacion),
      TrMemoria: getStringOrDash(body.TrMemoria),
      TrSignoDepre: getStringOrDash(body.TrSignoDepre),
      TrSueno: getStringOrDash(body.TrSueno),
      Adenopatias: getStringOrDash(body.Adenopatias),
      Bocio: getStringOrDash(body.Bocio),
      CardiacaTA: getStringOrDash(body.CardiacaTA),
      CardiacaEdemas: getStringOrDash(body.CardiacaEdemas),
      TEJCP: getStringOrDash(body.TEJCP),
      Peso: getStringOrDash(body.Peso),
      Percusion: getStringOrDash(body.Percusion),
      Auscultacion: getStringOrDash(body.Auscultacion),
      RespiratoriaOtros: getStringOrDash(body.RespiratoriaOtros),
      Abdomen: getStringOrDash(body.Abdomen),
      Palpacion: getStringOrDash(body.Palpacion),
      Catarsis: getStringOrDash(body.Catarsis),
      DigestivoEsfinter: getStringOrDash(body.DigestivoEsfinter),
      DigestivoOtros: getStringOrDash(body.DigestivoOtros),
      SNCAltMotoras: getStringOrDash(body.SNCAltMotoras),
      SNCSensitivas: getStringOrDash(body.SNCSensitivas),
      SNCTemblores: getStringOrDash(body.SNCTemblores),
      SNCPostura: getStringOrDash(body.SNCPostura),
      SNCEquilibrio: getStringOrDash(body.SNCEquilibrio),
      SNCMarcha: getStringOrDash(body.SNCMarcha),

      // === HISTORIA CLÍNICA / INTERCONSULTA ===
      antecedentesPatologicos: getStringOrDash(body.antecedentesPatologicos),
      enfermedadActual: getStringOrDash(body.enfermedadActual),
      enfermedadBase: getStringOrDash(body.enfermedadBase),
      fechaEnfermedadBase: getStringOrDash(body.fechaEnfermedadBase),
      informeInterconsulta: getStringOrDash(body.informeInterconsulta),
      tratamientoBase: getStringOrDash(body.tratamientoBase),

      // === EVOLUCIÓN ===
      Evolucion: getStringOrDash(body.Evolucion),
      UltFechaModifEvolucion: getStringOrDash(body.UltFechaModifEvolucion),

      // === FECHAS AUTO-GENERADAS AL CREAR ===
      fechaUltModifAntecedentesPatologicos: fechaActual,
      fechaAnteriorModifAntecedentesPatologicos: getStringOrDash(
        body.fechaAnteriorModifAntecedentesPatologicos,
      ),
      fechaUltModifEnfermedadActual: fechaActual,
      fechaAnteriorModifEnfermedadActual: getStringOrDash(
        body.fechaAnteriorModifEnfermedadActual,
      ),
      fechaTratamientoBase: getStringOrDash(body.fechaTratamientoBase),
      fechaTratamientoActual: getStringOrDash(body.fechaTratamientoActual),
    };

    const pacienteDocRef = doc(
      db,
      "pacientes",
      "lista",
      "nombresPacientes",
      id,
    );

    await setDoc(pacienteDocRef, paciente);

    return new Response(
      JSON.stringify({ message: "Paciente creado correctamente", id }),
      {
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("Error creando paciente:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
