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
        { status: 400 },
      );
    }

    const body = await req.json();
    console.log("Datos recibidos para actualizar:", body);

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
      });
    }

    const existingData = docSnap.data();

    const updateData = {
      afiliadoNumero: getStringOrDash(body.afiliadoNumero),
      dni: getStringOrDash(body.dni),
      edad: getStringOrDash(body.edad),
      fechaIngreso: getStringOrDash(body.fechaIngreso),
      fechaNacimiento: getStringOrDash(body.fechaNacimiento),
      genero: getStringOrDash(body.genero),
      nombreCompleto: getStringOrDash(body.nombreCompleto),
      obraSocial: getStringOrDash(body.obraSocial),
      urlFoto: getStringOrDash(body.urlFoto),

      acompanado: getStringOrDash(body.acompanado),
      conQuienVive: getStringOrDash(body.conQuienVive),
      concurreALaConsulta: getStringOrDash(body.concurreALaConsulta),
      conyuge: getStringOrDash(body.conyuge),
      hermanos: getStringOrDash(body.hermanos),
      hijos: getStringOrDash(body.hijos),
      otros: getStringOrDash(body.otros),

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

      articulaciones: getStringOrDash(body.articulaciones),
      caidas: getStringOrDash(body.caidas),
      camina: getStringOrDash(body.camina),
      equilibrio: getStringOrDash(body.equilibrio),
      levantateYAnda: getStringOrDash(body.levantateYAnda),
      pasaMuchoTiempoSentado: getStringOrDash(body.pasaMuchoTiempoSentado),

      calidadDe: getStringOrDash(body.calidadDe),

      informeInterconsulta: getStringOrDash(body.informeInterconsulta),

      tratamientoBase: getStringOrDash(body.tratamientoBase),
    };

    const nuevoAntecedentesRaw = body.antecedentesPatologicos;
    const nuevoAntecedentes = getStringOrDash(nuevoAntecedentesRaw);
    const actualAntecedentes = getStringOrDash(
      existingData.antecedentesPatologicosActual,
    );

    if (nuevoAntecedentes !== actualAntecedentes && nuevoAntecedentes !== "-") {
      updateData.antecedentesPatologicosPrevio = actualAntecedentes;
      const ahora = new Date().toISOString();
      updateData.fechaAnterioModifAntecedentesPatologicos = getStringOrDash(
        existingData.fechaUltModifAntecedentesPatologicos,
      );
      updateData.fechaUltModifAntecedentesPatologicos = ahora;
    }
    updateData.antecedentesPatologicosActual = nuevoAntecedentes;

    const nuevaEnfermedad = getStringOrDash(body.enfermedadActual);
    const actualEnfermedad = getStringOrDash(existingData.enfermedadActual);

    if (nuevaEnfermedad !== actualEnfermedad && nuevaEnfermedad !== "-") {
      updateData.enfermedadPrevia = actualEnfermedad;
      const ahora = new Date().toISOString();
      updateData.fechaAnterioModifEnfermedadActual = getStringOrDash(
        existingData.fechaUltModifEnfermedadActual,
      );
      updateData.fechaUltModifEnfermedadActual = ahora;
    }
    updateData.enfermedadActual = nuevaEnfermedad;

    await updateDoc(pacienteDocRef, updateData);

    return new Response(
      JSON.stringify({ message: "Datos actualizados correctamente" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error actualizando datos del paciente:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
