import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Alert,
  CircularProgress,
<<<<<<< HEAD
} from "@mui/material";
import Swal from "sweetalert2";
import ModalEdicion from "./ModalEdicion";

const ClinicoTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);
=======
  Avatar,
} from "@mui/material";
import Swal from "sweetalert2";
import ModalEdicionClinico from "./ModalEdicionClinico";

const ClinicoTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);
  const [fotoError, setFotoError] = useState(false);
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453

  const handleEditar = () => {
    if (!paciente) {
      Swal.fire("Error", "No hay paciente seleccionado", "error");
      return;
    }
    setOpenModal(true);
  };

<<<<<<< HEAD
=======
  const safe = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "-"
    ) {
      return "-";
    }
    return value;
  };

>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
  const handleImprimir = async () => {
    if (!paciente || !datos) {
      Swal.fire("Error", "Selecciona un paciente con datos clínicos", "error");
      return;
    }

    Swal.fire({
      title: "Imprimir planilla",
<<<<<<< HEAD
      text: "¿Deseas generar el PDF historia clínica?",
=======
      text: "¿Deseas generar el PDF antecedentes?",
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, imprimir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Generando PDF...",
          text: "Por favor espera",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        try {
<<<<<<< HEAD
          const res = await fetch("/api/exportador", {
=======
          const res = await fetch("/api/exportador/clinico", {
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipoTab: "clinico",
              datos: { paciente, historia: datos },
            }),
          });

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
          Swal.close();
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "No se pudo generar el PDF", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

<<<<<<< HEAD
  const datosParaEditar = {
    antecedentes: datos?.antecedentes || {
      vasculares: {
        ta: "",
        cardio: "",
      },
      digestivos: {
        parrafoDigestivos: "",
        constipacion: "",
      },
      metabolicas: {
        parrafoMetabolicos: "",
      },
      sensoriales: {
        auditivas: "",
        olfativas: "",
        visuales: "",
        gustativas: "",
      },
      ginecologicas: {
        parrafoGinecologicas: "",
      },
      vPerif: {
        edemas: "",
        varices: "",
        ulceras: "",
      },
      dbt: {
        tiroides: "",
      },
      snC: {
        paralisis: "",
        parestesias: "",
        temblores: "",
        convulsiones: "",
        afasias: "",
        disartria: "",
      },
      urologicas: {
        parrafoUrologicas: "",
      },
      dermatologicas: {
        parrafoDermatologicas: "",
      },
      actitudPsiquica: {
        activa: "",
        pasiva: "",
      },
    },
    examenFisico: datos?.examenFisico || {
      fasciales: {
        ojos: "",
        boca: "",
        denticion: "",
      },
      apCardiovascular: {
        r1yr2: "",
      },
      apGenitourinario: {
        ppbl: "",
        controlEsfinter: "",
        otro: "",
      },
      trMentales: {
        atencion: "",
        orientacion: "",
        memoria: "",
        signosDepresivos: "",
        trSueno: "",
      },
      cuello: {
        adenopatias: "",
        bocio: "",
      },
      signosFallaCardiaca: {
        ta: "",
        edemas: "",
      },
      dermatologicos: {
        tejCp: "",
        peso: "",
      },
      apRespiratoria: {
        percusion: "",
        auscultacion: "",
        otros: "",
      },
      apDigestivo: {
        abdomen: "",
        palpacion: "",
        catarsis: "",
        controlEsfinter: "",
        otro: "",
      },
      snC: {
        alteracionesMotoras: "",
        sensitivas: "",
        temblores: "",
        postura: "",
        equilibrio: "",
        marcha: "",
      },
    },
    tratamientoActual: datos?.tratamientoActual || {
      tratamiento1: "",
      tratamiento2: "",
    },
    evolucion: datos?.evolucion || {
      texto: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!",
      ultimaActualizacion: "",
    },
  };

=======
  // === ACTUALIZADO: datosParaEditar con Social, Mental y Funcional ===
  const datosParaEditar = {
    Informacion: paciente
      ? {
          nombreCompleto: paciente.nombreCompleto || "",
          dni: paciente.dni || "",
          fechaNacimiento: paciente.fechaNacimiento || "",
          edad: paciente.edad || "",
          obraSocial: paciente.obraSocial || "",
          afiliadoNumero: paciente.afiliadoNumero || "",
          fechaIngreso: paciente.fechaIngreso || "",
        }
      : {},
    // === NUEVOS CAMPOS - SOCIAL ===
    social: {
      acompanado: paciente?.acompanado || "",
      conQuienVive: paciente?.conQuienVive || "",
      concurreALaConsulta: paciente?.concurreALaConsulta || "",
      conyuge: paciente?.conyuge || "",
      hermanos: paciente?.hermanos || "",
      hijos: paciente?.hijos || "",
      otros: paciente?.otros || "",
    },
    // === NUEVOS CAMPOS - MENTAL ===
    mental: {
      orientacionEnT: paciente?.orientacionEnT || "",
      hijosMental: paciente?.hijosMental || "",
      concurreALaConsultaMental: paciente?.concurreALaConsultaMental || "",
      palabra1: paciente?.palabra1 || "",
      palabra2: paciente?.palabra2 || "",
      palabra3: paciente?.palabra3 || "",
      calculo1: paciente?.calculo1 || "",
      calculo2: paciente?.calculo2 || "",
      calculo3: paciente?.calculo3 || "",
      respuesta1: paciente?.respuesta1 || "",
      respuesta2: paciente?.respuesta2 || "",
      palabra1Memoria: paciente?.palabra1Memoria || "",
      palabra2Memoria: paciente?.palabra2Memoria || "",
      palabra3Memoria: paciente?.palabra3Memoria || "",
      respuestaRepita: paciente?.respuestaRepita || "",
      textoLeido: paciente?.textoLeido || "",
      cierreOjosYHagalo: paciente?.cierreOjosYHagalo || "",
      logradoDoblePapel: paciente?.logradoDoblePapel || "",
      logradoCopieDibujo: paciente?.logradoCopieDibujo || "",
      fraseEscrita: paciente?.fraseEscrita || "",
    },
    // === NUEVOS CAMPOS - FUNCIONAL ===
    funcional: {
      camina: paciente?.camina || "",
      levantateYAnda: paciente?.levantateYAnda || "",
      articulaciones: paciente?.articulaciones || "",
      pasaMuchoTiempoSentado: paciente?.pasaMuchoTiempoSentado || "",
      equilibrio: paciente?.equilibrio || "",
      caidas: paciente?.caidas || "",
    },
    // === EXAMEN FÍSICO DETALLADO (Se mantiene en esta pestaña) ===
    examenFisico: datos?.examenFisico || {
      fasciales: {
        ojos: paciente?.FacialOjos,
        boca: paciente?.FacialBoca,
        denticion: paciente?.FacialDenticion,
      },
      apCardiovascular: {
        r1yr2: paciente?.CardioR1R2,
      },
      apGenitourinario: {
        ppbl: paciente?.PPBL,
        controlEsfinter: paciente?.GenitourinarioEsfinter,
        otro: paciente?.GenitourinarioOtros,
      },
      trMentales: {
        atencion: paciente?.TrAtencion,
        orientacion: paciente?.TrOrientacion,
        memoria: paciente?.TrMemoria,
        signosDepresivos: paciente?.TrSignoDepre,
        trSueno: paciente?.TrSueno,
      },
      cuello: {
        adenopatias: paciente?.Adenopatias,
        bocio: paciente?.Bocio,
      },
      signosFallaCardiaca: {
        ta: paciente?.CardiacaTA,
        edemas: paciente?.CardiacaEdemas,
      },
      dermatologicos: {
        tejCp: paciente?.TEJCP,
        peso: paciente?.Peso,
      },
      apRespiratoria: {
        percusion: paciente?.Percusion,
        auscultacion: paciente?.Auscultacion,
        otros: paciente?.RespiratoriaOtros,
      },
      apDigestivo: {
        abdomen: paciente?.Abdomen,
        palpacion: paciente?.Palpacion,
        catarsis: paciente?.Catarsis,
        controlEsfinter: paciente?.DigestivoEsfinter,
        otro: paciente?.DigestivoOtros,
      },
      SNC: {
        alteracionesMotoras: paciente?.SNCAltMotoras,
        sensitivas: paciente?.SNCSensitivas,
        temblores: paciente?.SNCTemblores,
        postura: paciente?.SNCPostura,
        equilibrio: paciente?.SNCEquilibrio,
        marcha: paciente?.SNCMarcha,
      },
    },
    // === TRATAMIENTO ACTUAL Y EVOLUCIÓN ===
    tratamientoActual: datos?.tratamientoActual || {
      tratamientoActual: paciente?.tratamientoActual,
    },
    evolucion: datos?.evolucion || {
      texto: paciente?.Evolucion || "",
      ultimaActualizacion: paciente?.UltFechaModifEvolucion || "",
    },
  };

  const handleFotoError = () => {
    setFotoError(true);
  };

  const getInitials = (nombre) => {
    if (!nombre) return "?";
    const palabras = nombre.trim().split(/\s+/);
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
  if (!paciente) {
    return (
      <Alert severity="info">
        Por favor selecciona un paciente para ver los datos clínicos.
      </Alert>
    );
  }

  if (!datos) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

<<<<<<< HEAD
  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
=======
  const d = (v) => v ?? "-";

  return (
    <Box>
      {/* === INFORMACIÓN DEL PACIENTE (Siempre visible) === */}
      <Paper sx={{ p: 2, mb: 3, maxWidth: "650px" }}>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
<<<<<<< HEAD
          <Typography variant="h6">Antecedentes del paciente</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Vasculares
            </Typography>
            <Typography variant="body2">TA:</Typography>
            <Typography variant="body2">Cardio:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Digestivos
            </Typography>
            <Typography variant="body2">Párrafo para digestivos</Typography>
            <Typography variant="body2">Constipación:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Metabólicas
            </Typography>
            <Typography variant="body2">Párrafo para metabolicos</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Sensoriales
            </Typography>
            <Typography variant="body2">Auditivas:</Typography>
            <Typography variant="body2">Olfativas:</Typography>
            <Typography variant="body2">Visuales:</Typography>
            <Typography variant="body2">Gustativas:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Ginecológicas
            </Typography>
            <Typography variant="body2">Párrafo de ginecológicas</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              V PERIF
            </Typography>
            <Typography variant="body2">Edemas:</Typography>
            <Typography variant="body2">Várices:</Typography>
            <Typography variant="body2">Úlceras:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              DBT
            </Typography>
            <Typography variant="body2">Tiroides:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              SNC
            </Typography>
            <Typography variant="body2">Parálisis:</Typography>
            <Typography variant="body2">Parestesias:</Typography>
            <Typography variant="body2">Temblores:</Typography>
            <Typography variant="body2">Convulsiones:</Typography>
            <Typography variant="body2">Afasias:</Typography>
            <Typography variant="body2">Disartria:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Urológicas
            </Typography>
            <Typography variant="body2">Párrafo de urologicas</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Dermatológicas
            </Typography>
            <Typography variant="body2">Párrafo de dermatologicas:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Actitud psíquica
            </Typography>
            <Typography variant="body2">Activa:</Typography>
            <Typography variant="body2">Pasiva:</Typography>
=======
          <Typography variant="h6">Información</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              Fecha de ingreso: {paciente.fechaIngreso || "-"}
            </Typography>
            <Typography variant="body2">
              Nombre completo: {paciente.nombreCompleto || "-"}
            </Typography>
            <Typography variant="body2">
              Obra Social: {paciente.obraSocial || "-"}
            </Typography>
            <Typography variant="body2">DNI: {paciente.dni || "-"}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              Fecha de nacimiento: {paciente.fechaNacimiento || "-"}
            </Typography>
            <Typography variant="body2">
              Edad: {paciente.edad || "-"}
            </Typography>
            <Typography variant="body2">
              AF N°: {paciente.afiliadoNumero || "-"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ ml: 5, mb: 2 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              src={paciente.urlFoto && !fotoError ? paciente.urlFoto : ""}
              alt={paciente.nombreCompleto || "Paciente"}
              onError={handleFotoError}
              sx={{
                width: 80,
                height: 80,
                fontSize: 32,
                bgcolor:
                  fotoError || !paciente.urlFoto ? "primary.main" : undefined,
                border: "2px solid",
                borderColor: "divider",
              }}
            >
              {(fotoError || !paciente.urlFoto) &&
                getInitials(paciente.nombreCompleto)}
            </Avatar>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          </Grid>
        </Grid>
      </Paper>

<<<<<<< HEAD
      {/* Examen físico */}
=======
      {/* === SOCIAL (Nueva sección) === */}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
<<<<<<< HEAD
          <Typography variant="h6">Examen físico</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Fasciales
            </Typography>
            <Typography variant="body2">Ojos:</Typography>
            <Typography variant="body2">Boca:</Typography>
            <Typography variant="body2">Dentición:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Ap cardiovascular
            </Typography>
            <Typography variant="body2">R1 y R2:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Ap. genitourinario
            </Typography>
            <Typography variant="body2">PPBL:</Typography>
            <Typography variant="body2">Control de esfínter:</Typography>
            <Typography variant="body2">Otro:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Tr. mentales
            </Typography>
            <Typography variant="body2">Atención:</Typography>
            <Typography variant="body2">Orientación:</Typography>
            <Typography variant="body2">Memoria:</Typography>
            <Typography variant="body2">Signos depresivos:</Typography>
            <Typography variant="body2">Tr. del sueño:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Cuello
            </Typography>
            <Typography variant="body2">Adenopatías:</Typography>
            <Typography variant="body2">Bocio:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Signos falla cardíaca
            </Typography>
            <Typography variant="body2">TA:</Typography>
            <Typography variant="body2">Edemas:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Dermatológicos
            </Typography>
            <Typography variant="body2">TEJ CP:</Typography>
            <Typography variant="body2">Peso:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Ap. respiratoria
            </Typography>
            <Typography variant="body2">Percusión:</Typography>
            <Typography variant="body2">Auscultación:</Typography>
            <Typography variant="body2">Otros:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              Ap. digestivo
            </Typography>
            <Typography variant="body2">Abdomen:</Typography>
            <Typography variant="body2">A la palpación:</Typography>
            <Typography variant="body2">Catarsis:</Typography>
            <Typography variant="body2">Control de esfínter:</Typography>
            <Typography variant="body2">Otro:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
              SNC
            </Typography>
            <Typography variant="body2">Alteraciones motoras:</Typography>
            <Typography variant="body2">Sensitivas:</Typography>
            <Typography variant="body2">Temblores:</Typography>
            <Typography variant="body2">Postura:</Typography>
            <Typography variant="body2">Equilibrio:</Typography>
            <Typography variant="body2">Marcha:</Typography>
=======
          <Typography variant="h6">Social</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              ¿Acompañado?: {safe(paciente.acompanado)}
            </Typography>
            <Typography variant="body2">
              Con quién vive: {safe(paciente.conQuienVive)}
            </Typography>
            <Typography variant="body2">
              Concurre a consulta: {safe(paciente.concurreALaConsulta)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              Cónyuge: {safe(paciente.conyuge)}
            </Typography>
            <Typography variant="body2">
              Hermanos: {safe(paciente.hermanos)}
            </Typography>
            <Typography variant="body2">
              Hijos: {safe(paciente.hijos)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              Otros: {safe(paciente.otros)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* === MENTAL (Nueva sección) === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Mental</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Orientación y Consulta
            </Typography>
            <Typography variant="body2">
              Orientación en T: {safe(paciente.orientacionEnT)}
            </Typography>
            <Typography variant="body2">
              Hijos: {safe(paciente.hijosMental)}
            </Typography>
            <Typography variant="body2">
              Concurre a consulta: {safe(paciente.concurreALaConsultaMental)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Fijación (3 palabras)
            </Typography>
            <Typography variant="body2">
              Palabra 1: {safe(paciente.palabra1)}
            </Typography>
            <Typography variant="body2">
              Palabra 2: {safe(paciente.palabra2)}
            </Typography>
            <Typography variant="body2">
              Palabra 3: {safe(paciente.palabra3)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Cálculo
            </Typography>
            <Typography variant="body2">
              Cálculo 1: {safe(paciente.calculo1)}
            </Typography>
            <Typography variant="body2">
              Cálculo 2: {safe(paciente.calculo2)}
            </Typography>
            <Typography variant="body2">
              Cálculo 3: {safe(paciente.calculo3)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Respuestas
            </Typography>
            <Typography variant="body2">
              Respuesta 1: {safe(paciente.respuesta1)}
            </Typography>
            <Typography variant="body2">
              Respuesta 2: {safe(paciente.respuesta2)}
            </Typography>
            <Typography variant="body2">
              Repita: {safe(paciente.respuestaRepita)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Memoria
            </Typography>
            <Typography variant="body2">
              Palabra 1: {safe(paciente.palabra1Memoria)}
            </Typography>
            <Typography variant="body2">
              Palabra 2: {safe(paciente.palabra2Memoria)}
            </Typography>
            <Typography variant="body2">
              Palabra 3: {safe(paciente.palabra3Memoria)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Lectura y Ejecución
            </Typography>
            <Typography variant="body2">
              Texto leído: {safe(paciente.textoLeido)}
            </Typography>
            <Typography variant="body2">
              Cierre ojos y hágalo: {safe(paciente.cierreOjosYHagalo)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Tareas Manuales
            </Typography>
            <Typography variant="body2">
              Logró doblar papel: {safe(paciente.logradoDoblePapel)}
            </Typography>
            <Typography variant="body2">
              Logró copiar dibujo: {safe(paciente.logradoCopieDibujo)}
            </Typography>
            <Typography variant="body2">
              Frase escrita: {safe(paciente.fraseEscrita)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* === FUNCIONAL (Nueva sección) === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Funcional</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Camina: {safe(paciente.camina)}
            </Typography>
            <Typography variant="body2">
              Levántate y anda: {safe(paciente.levantateYAnda)}
            </Typography>
            <Typography variant="body2">
              Articulaciones: {safe(paciente.articulaciones)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Pasa mucho tiempo sentado: {safe(paciente.pasaMuchoTiempoSentado)}
            </Typography>
            <Typography variant="body2">
              Equilibrio: {safe(paciente.equilibrio)}
            </Typography>
            <Typography variant="body2">
              Caídas: {safe(paciente.caidas)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* === EXAMEN FÍSICO DETALLADO (Se mantiene en esta pestaña) === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Examen Físico</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Fasciales
            </Typography>
            <Typography variant="body2">
              Ojos: {safe(paciente.FacialOjos)}
            </Typography>
            <Typography variant="body2">
              Boca: {safe(paciente.FacialBoca)}
            </Typography>
            <Typography variant="body2">
              Dentición: {safe(paciente.FacialDenticion)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ap. Cardiovascular
            </Typography>
            <Typography variant="body2">
              R1 y R2: {safe(paciente.CardioR1R2)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ap. Genitourinario
            </Typography>
            <Typography variant="body2">PPBL: {safe(paciente.PPBL)}</Typography>
            <Typography variant="body2">
              Control esfínter: {safe(paciente.GenitourinarioEsfinter)}
            </Typography>
            <Typography variant="body2">
              Otro: {safe(paciente.GenitourinarioOtros)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Tr. Mentales
            </Typography>
            <Typography variant="body2">
              Atención: {safe(paciente.TrAtencion)}
            </Typography>
            <Typography variant="body2">
              Orientación: {safe(paciente.TrOrientacion)}
            </Typography>
            <Typography variant="body2">
              Memoria: {safe(paciente.TrMemoria)}
            </Typography>
            <Typography variant="body2">
              Signos depresivos: {safe(paciente.TrSignoDepre)}
            </Typography>
            <Typography variant="body2">
              Tr. del sueño: {safe(paciente.TrSueno)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Cuello
            </Typography>
            <Typography variant="body2">
              Adenopatías: {safe(paciente.Adenopatias)}
            </Typography>
            <Typography variant="body2">
              Bocio: {safe(paciente.Bocio)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Signos Falla Cardíaca
            </Typography>
            <Typography variant="body2">
              TA: {safe(paciente.CardiacaTA)}
            </Typography>
            <Typography variant="body2">
              Edemas: {safe(paciente.CardiacaEdemas)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Dermatológicos
            </Typography>
            <Typography variant="body2">
              TEJ CP: {safe(paciente.TEJCP)}
            </Typography>
            <Typography variant="body2">Peso: {safe(paciente.Peso)}</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ap. Respiratoria
            </Typography>
            <Typography variant="body2">
              Percusión: {safe(paciente.Percusion)}
            </Typography>
            <Typography variant="body2">
              Auscultación: {safe(paciente.Auscultacion)}
            </Typography>
            <Typography variant="body2">
              Otros: {safe(paciente.RespiratoriaOtros)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ap. Digestivo
            </Typography>
            <Typography variant="body2">
              Abdomen: {safe(paciente.Abdomen)}
            </Typography>
            <Typography variant="body2">
              Palpación: {safe(paciente.Palpacion)}
            </Typography>
            <Typography variant="body2">
              Catarsis: {safe(paciente.Catarsis)}
            </Typography>
            <Typography variant="body2">
              Control esfínter: {safe(paciente.DigestivoEsfinter)}
            </Typography>
            <Typography variant="body2">
              Otro: {safe(paciente.DigestivoOtros)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              SNC
            </Typography>
            <Typography variant="body2">
              Alt. motoras: {safe(paciente.SNCAltMotoras)}
            </Typography>
            <Typography variant="body2">
              Sensitivas: {safe(paciente.SNCSensitivas)}
            </Typography>
            <Typography variant="body2">
              Temblores: {safe(paciente.SNCTemblores)}
            </Typography>
            <Typography variant="body2">
              Postura: {safe(paciente.SNCPostura)}
            </Typography>
            <Typography variant="body2">
              Equilibrio: {safe(paciente.SNCEquilibrio)}
            </Typography>
            <Typography variant="body2">
              Marcha: {safe(paciente.SNCMarcha)}
            </Typography>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
<<<<<<< HEAD
          <Typography variant="h6">Tratamiento actual</Typography>
        </Box>
        <Typography variant="body2">Tratamiento1...</Typography>
        <Typography variant="body2">Tratamiento2...</Typography>
=======
          <Typography variant="h6">Tratamiento Actual</Typography>
        </Box>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {safe(paciente.tratamientoActual)}
        </Typography>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="span">
<<<<<<< HEAD
              Evolución -
            </Typography>
            <Typography variant="subtitle2" component="span" ml={1}>
              última fecha de actualización
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!
        </Typography>
      </Paper>

=======
              Evolución 
            </Typography>
            <Typography variant="subtitle2" component="span" ml={1}>
              {safe(paciente.UltFechaModifEvolucion)}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {safe(paciente.Evolucion)}
        </Typography>
      </Paper>

      {/* === BOTONES DE ACCIÓN === */}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      <Box display="flex" justifyContent="center" mt={3} gap={2}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleEditar}
        >
          Editar Contenido
        </Button>
        <Button
          variant="contained"
          color="warning"
          size="large"
          onClick={handleImprimir}
<<<<<<< HEAD
          sx={{ backgroundColor: "#ed6c02", "&:hover": { backgroundColor: "#e65100" } }}
=======
          sx={{
            backgroundColor: "#ed6c02",
            "&:hover": { backgroundColor: "#e65100" },
          }}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
        >
          Imprimir planilla
        </Button>
      </Box>

      {openModal && (
<<<<<<< HEAD
        <ModalEdicion
=======
        <ModalEdicionClinico
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          open={openModal}
          onClose={handleCloseModal}
          datos={datosParaEditar}
          pacienteId={paciente.id}
        />
      )}
    </Box>
  );
};

export default ClinicoTab;
