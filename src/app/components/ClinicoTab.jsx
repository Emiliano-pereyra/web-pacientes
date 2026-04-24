import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Swal from "sweetalert2";
import ModalEdicionClinico from "./ModalEdicionClinico";

const ClinicoTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);
  const [fotoError, setFotoError] = useState(false);

  const handleEditar = () => {
    if (!paciente) {
      Swal.fire("Error", "No hay paciente seleccionado", "error");
      return;
    }
    setOpenModal(true);
  };

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

  const handleImprimir = async () => {
    if (!paciente || !datos) {
      Swal.fire("Error", "Selecciona un paciente con datos clínicos", "error");
      return;
    }

    Swal.fire({
      title: "Imprimir planilla",
      text: "¿Deseas generar el PDF antecedentes?",
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
          const res = await fetch("/api/exportador/clinico", {
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

  const d = (v) => v ?? "-";

  return (
    <Box>
      {/* === INFORMACIÓN DEL PACIENTE (Siempre visible) === */}
      <Paper sx={{ p: 2, mb: 3, maxWidth: "650px" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
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
          </Grid>
        </Grid>
      </Paper>

      {/* === SOCIAL (Nueva sección) === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
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
          <Typography variant="h6">Tratamiento Actual</Typography>
        </Box>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {safe(paciente.tratamientoActual)}
        </Typography>
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
          sx={{
            backgroundColor: "#ed6c02",
            "&:hover": { backgroundColor: "#e65100" },
          }}
        >
          Imprimir planilla
        </Button>
      </Box>

      {openModal && (
        <ModalEdicionClinico
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
