import { db } from "@/lib/firebase";
import { getStepIconUtilityClass } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";

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

    if (!nombreCompleto) {
      return new Response(JSON.stringify({ error: "Falta nombreCompleto" }), {
        status: 400,
      });
    }

    const id = convertirNombreAId(nombreCompleto);

    if (!id) {
      return new Response(JSON.stringify({ error: "Nombre inválido" }), {
        status: 400,
      });
    }

    const paciente = {
      //Info paciente
      afiliadoNumero: getStringOrDash(body.afialiadoNumero),
      dni: getStringOrDash(body.dni),
      edad: getStringOrDash(body.edad),
      fechaIngreso: getStringOrDash(body.fechaIngreso),
      fechaNacimiento: getStringOrDash(body.fechaNacimiento),
      genero: getStringOrDash(body.genero),
      nombreCompleto: getStringOrDash(body.nombreCompleto),
      obraSocial: getStringOrDash(body.obraSocial),
      urlFoto: urlFoto || "-",

      // Social
      acompanado: getStringOrDash(body.acompanado),
      conQuienVive: getStringOrDash(body.conQuienVive),
      concurreALaConsulta: getStringOrDash(body.concurreALaConsulta),
      conyuge: getStringOrDash(body.conyuge),
      hermanos: getStringOrDash(body.hermanos),
      hijos: getStringOrDash(body.hijos),
      otros: getStringOrDash(body.otros),

      // Mental
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

      // Funcional
      articulaciones: getStringOrDash(body.articulaciones),
      caidas: getStringOrDash(body.caidas),
      camina: getStringOrDash(body.camina), // opciones solo - con apoyo
      equilibrio: getStringOrDash(body.equilibrio),
      levantateYAnda: getStringOrDash(body.levantateYAnda),
      pasaMuchoTiempoSentado: getStringOrDash(body.pasaMuchoTiempoSentado), // si - no

      // flia y apoderados
      calidadDe: getStringOrDash(body.calidadDe), // lo rellenaria por lo que va solo -

      //Interconsulta
      antecedentesPatologicosActual: getStringOrDash(
        body.antecedentesPatologicos,
      ),
      fechaUltModifAntecedentesPatologicos: getStringOrDash(
        body.fechaUltModifAntecedentesPatologicos,
      ), //se almacena la fecha actual de la edicion
      fechaAnterioModifAntecedentesPatologicos: getStringOrDash(
        body.fechaAnterioModifAntecedentesPatologicos,
      ), //se almacena la fecha anterio de la edicion
      enfermedadActual: getStringOrDash(body.enfermedadActual),
      enfermedadBase: getStringOrDash(body.enfermedadBase),
      fechaEnfermedadBase: getStringOrDash(body.fechaEnfermedadBase),
      fechaUltModifEnfermedadActual: getStringOrDash(
        body.fechaUltModifEnfermedadActual,
      ),
      fechaAnterioModifEnfermedadActual: getStringOrDash(
        body.fechaAnterioModifEnfermedadActual,
      ),
      informeInterconsulta: getStringOrDash(body.informeInterconsulta),

      // Historia clinica
      tratamientoBase: getStringOrDash(body.tratamientoBase),
      fechaTratamientoBase: getStringOrDash(body.fechaTratamientoBase),
      tratamientoActual: getStringOrDash(body.tratamientoActual),
      fechaTratamientoActual: getStringOrDash(body.fechaTratamientoActual),

      // clinico
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

      //Examen fisico
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
      Percusion: getStepIconUtilityClass(body.Percusion),
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

      Evolucion: getStringOrDash(body.Evolucion),
      UltFechaModifEvolucion: getStringOrDash(body.UltFechaModifEvolucion),
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
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creando paciente:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
