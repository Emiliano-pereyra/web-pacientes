import { db, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
export const runtime = "nodejs";

/**
 * Convierte un nombre completo en un ID válido para Firestore
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
    const contentType = req.headers.get("content-type") || "";
    let body = {};
    let file = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      file = formData.get("file");

      for (const [key, value] of formData.entries()) {
        if (key !== "file" && typeof value === "string") {
          body[key] = value;
        }
      }
    } else {
      body = await req.json();
    }

    const { nombreCompleto } = body;

    if (!nombreCompleto?.trim()) {
      return NextResponse.json(
        { error: "El nombre completo es obligatorio" },
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }

    const id = convertirNombreAId(nombreCompleto);
    if (!id) {
      return NextResponse.json(
        { error: "Nombre inválido para generar ID" },
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }

    let urlFoto = getStringOrDash(body.urlFoto);
    let fotoMetadata = null;

    if (file && file.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Tipo de archivo no permitido. Solo JPG, PNG, WebP o GIF" },
          { status: 400 },
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "La imagen supera el límite de 5MB" },
          { status: 400 },
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `perfil_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `pacientes/${id}/${fileName}`);

      await uploadBytes(storageRef, buffer, {
        contentType: file.type,
        customMetadata: {
          pacienteId: id,
          tipo: "perfil",
          uploadedAt: new Date().toISOString(),
        },
      });

      const downloadURL = await getDownloadURL(storageRef);
      urlFoto = downloadURL;

      fotoMetadata = {
        id: `perfil_${Date.now()}`,
        url: downloadURL,
        path: storageRef.fullPath,
        tipo: "perfil",
        descripcion: "Foto de perfil al crear paciente",
        nombreOriginal: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
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
      nombreCompleto: getStringOrDash(nombreCompleto),
      obraSocial: getStringOrDash(body.obraSocial),
      urlFoto: urlFoto,

      // === SOCIAL ===
      acompanado: getStringOrDash(body.acompanado),
      conQuienVive: getStringOrDash(body.conQuienVive),
      concurreALaConsulta: getStringOrDash(body.concurreALaConsulta),
      conyuge: getStringOrDash(body.conyuge),
      hermanos: getStringOrDash(body.hermanos),
      hijos: getStringOrDash(body.hijos),
      otros: getStringOrDash(body.otros),

      // === MENTAL ===
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

      // === FUNCIONAL ===
      articulaciones: getStringOrDash(body.articulaciones),
      caidas: getStringOrDash(body.caidas),
      camina: getStringOrDash(body.camina),
      equilibrio: getStringOrDash(body.equilibrio),
      levantateYAnda: getStringOrDash(body.levantateYAnda),
      pasaMuchoTiempoSentado: getStringOrDash(body.pasaMuchoTiempoSentado),

      // === FAMILIA Y APODERADOS ===
      calidadDe: getStringOrDash(body.calidadDe),

      // === CLÍNICO / ANTECEDENTES ===
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

      // === EXAMEN FÍSICO ===
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

      // === HISTORIA CLÍNICA ===
      antecedentesPatologicos: getStringOrDash(body.antecedentesPatologicos),
      enfermedadActual: getStringOrDash(body.enfermedadActual),
      enfermedadBase: getStringOrDash(body.enfermedadBase),
      fechaEnfermedadBase: getStringOrDash(body.fechaEnfermedadBase),
      informeInterconsulta: getStringOrDash(body.informeInterconsulta),
      tratamientoBase: getStringOrDash(body.tratamientoBase),
      tratamientoActual: getStringOrDash(body.tratamientoActual),

      // === EVOLUCIÓN ===
      Evolucion: getStringOrDash(body.Evolucion),
      UltFechaModifEvolucion: getStringOrDash(body.UltFechaModifEvolucion),

      // === FECHAS AUTO ===
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

      // === GALERÍA ===
      galeriaFotos: fotoMetadata ? [fotoMetadata] : [],
    };

    const pacienteDocRef = doc(
      db,
      "pacientes",
      "lista",
      "nombresPacientes",
      id,
    );
    await setDoc(pacienteDocRef, paciente);

    return NextResponse.json(
      {
        message: "Paciente creado correctamente",
        id,
        urlFoto,
        hasPhoto: !!fotoMetadata,
      },
      {
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("Error creando paciente:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || "Error interno al crear paciente" },
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
}
