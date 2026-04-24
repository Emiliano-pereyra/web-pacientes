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
<<<<<<< HEAD
import ModalEdicion from "./ModalEdicion";

const HistoriaClinicaTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);
=======
import ModalEdicionAntecedentes from "./ModalEdicionAntecedentes";

const HistoriaClinicaTab = ({ paciente, datos }) => {
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

  const handleImprimir = async () => {
    Swal.fire({
      title: "Imprimir planilla",
<<<<<<< HEAD
      text: "¿Deseas generar el PDF de historia clínica?",
=======
      text: "¿Deseas generar el PDF de antecedentes?",
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
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
          const payload = {
            tipoTab: "historia-clinica",
            datos: {
              paciente: paciente,
              historia: datos,
            },
          };

          const res = await fetch("/api/exportador/historiaClinica", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Error al generar el PDF");
          }

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
          Swal.close();
        } catch (err) {
          console.error(err);
          Swal.fire(
            "Error",
            "No se pudo generar el PDF: " + err.message,
<<<<<<< HEAD
            "error"
=======
            "error",
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          );
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

<<<<<<< HEAD
  const datosParaEditar = {
    Informacion: paciente
      ? {
          nombreCompleto: paciente.nombre || "",
          dni: paciente.dni || "",
          fechaNacimiento: paciente.fechaNacimiento || "",
          edad: paciente.edad || "",
          os: paciente.os || "",
          afNumero: paciente.afNumero || "",
          fechaIngreso: paciente.fechaIngreso || "",
        }
      : {},
    funcional: datos?.funcional || {
      camina: "",
      levantateYAnda: "",
      articulaciones: "",
      pasaMuchoTiempoSentado: "",
      equilibrio: "",
      caidas: "",
    },
    social: datos?.social || {
      conQuienVive: "",
      hijos: "",
      concurreALaConsulta: "",
      conyuge: "",
      hermanos: "",
      acompanado: "",
      otros: "",
    },
    mental: datos?.mental || {
      orientacionEnT: "",
      hijosMental: "",
      concurreALaConsultaMental: "",
      palabra1: "",
      palabra2: "",
      palabra3: "",
      calculo1: "",
      calculo2: "",
      calculo3: "",
      respuesta1: "",
      respuesta2: "",
      palabra1Memoria: "",
      palabra2Memoria: "",
      palabra3Memoria: "",
      respuestaRepita: "",
      textoLeido: "",
      cierreOjosYHagalo: "",
      logradoDoblePapel: "",
      logradoCopieDibujo: "",
      fraseEscrita: "",
    },
=======
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

  // === ACTUALIZADO: datosParaEditar con nueva estructura + secciones mantenidas ===
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
    // === NUEVOS CAMPOS - ANTECEDENTES (Texto Libre) ===
    antecedentes: {
      cardiovascular: paciente?.antecedentesCardiovascular || "",
      digestivo: paciente?.antecedentesDigestivo || "",
      metabolico: paciente?.antecedentesMetabolico || "",
      neurologico: paciente?.antecedentesNeurologico || "",
      urologico: paciente?.antecedentesUrologico || "",
      psiquiatrico: paciente?.antecedentesPsiquiatrico || "",
      otros: paciente?.antecedentesOtros || "",
    },
    // === NUEVOS CAMPOS - EXAMEN FÍSICO (Texto Libre) ===
    examenFisico: {
      orientacion: paciente?.examenOrientacion || "",
      cardiovascular: paciente?.examenCardiovascular || "",
      respiratorio: paciente?.examenRespiratorio || "",
      digestivo: paciente?.examenDigestivo || "",
      genitourinario: paciente?.examenGenitourinario || "",
      neurologico: paciente?.examenNeurologico || "",
      otros: paciente?.examenOtros || "",
    },
    // === NUEVO CAMPO - TRATAMIENTO ACTUAL ===
    tratamientoActual: paciente?.tratamientoActual || "",
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
  };

  if (!paciente) {
    return (
      <Alert severity="info">
<<<<<<< HEAD
        Por favor selecciona un paciente para ver la historia clínica.
=======
        Por favor selecciona un paciente para ver los antecedentes.
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
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
      <Paper sx={{ p: 2, mb: 3, maxWidth: "500px" }}>
=======
  const d = (v) => v ?? "-";

  return (
    <Box>
      {/* === INFORMACIÓN DEL PACIENTE === */}
      <Paper sx={{ p: 2, mb: 3, maxWidth: "650px" }}>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
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
<<<<<<< HEAD
            <Typography variant="body2">Fecha de ingreso: {paciente.Informacion?.fechaIngreso}</Typography>
            <Typography variant="body2">Nombre completo: {paciente.Informacion?.nombreCompleto}</Typography>
            <Typography variant="body2">Os:</Typography>
            <Typography variant="body2">DNI:</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">Fecha de nacimiento:</Typography>
            <Typography variant="body2">Edad: {paciente.edad}</Typography>
            <Typography variant="body2">AF N°:</Typography>
=======
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
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
<<<<<<< HEAD
=======
            sx={{ ml: 5, mb: 2 }}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
<<<<<<< HEAD
              src={paciente.urlFoto}
              alt={paciente.nombre}
              sx={{ width: 60, height: 60 }}
            />
=======
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
=======
      {/* === ANTECEDENTES (Nueva estructura - Texto Libre) === */}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
<<<<<<< HEAD
          <Typography variant="h6">Funcional</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">Camina:</Typography>
            <Typography variant="body2">Levántate y anda:</Typography>
            <Typography variant="body2">Articulaciones:</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">Pasa mucho tiempo sentado:</Typography>
            <Typography variant="body2">Equilibrio:</Typography>
            <Typography variant="body2">Caídas:</Typography>
=======
          <Typography variant="h6">Antecedentes</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Cardiovascular
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.antecedentesCardiovascular || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Digestivo
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.antecedentesDigestivo || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Metabólico
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.antecedentesMetabolico || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Neurológico
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.antecedentesNeurologico || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Urológico
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.antecedentesUrologico || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Psiquiátrico
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.antecedentesPsiquiatrico || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Otros
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.antecedentesOtros || "-"}
            </Typography>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          </Grid>
        </Grid>
      </Paper>

<<<<<<< HEAD
=======
      {/* === EXAMEN FÍSICO (Nueva estructura - Texto Libre) === */}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
<<<<<<< HEAD
          <Typography variant="h6">Social</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">Con quién vive:</Typography>
            <Typography variant="body2">Hijos:</Typography>
            <Typography variant="body2">Concurre a la consulta:</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">Cónyuge:</Typography>
            <Typography variant="body2">Hermanos:</Typography>
            <Typography variant="body2">Acompañado:</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">Otros:</Typography>
=======
          <Typography variant="h6">Examen Físico</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Orientación
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.examenOrientacion || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              AP. Cardiovascular
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.examenCardiovascular || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Respiratorio
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.examenRespiratorio || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Digestivo
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.examenDigestivo || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Genitourinario
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.examenGenitourinario || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Neurológico / Psiquis
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.examenNeurologico || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline", mb: 1 }}
            >
              Otros
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {paciente.examenOtros || "-"}
            </Typography>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          </Grid>
        </Grid>
      </Paper>

<<<<<<< HEAD
=======
      {/* === TRATAMIENTO ACTUAL (Campo único de texto libre) === */}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
<<<<<<< HEAD
          <Typography variant="h6">Mental</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Orientación en T y E:
            </Typography>
            <Typography variant="body2">Hijos:</Typography>
            <Typography variant="body2">Concurre a la consulta:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Fijación (repita 3 palabras)
            </Typography>
            <Typography variant="body2">Palabra 1:</Typography>
            <Typography variant="body2">Palabra 2:</Typography>
            <Typography variant="body2">Palabra 3:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Concentración y cálculo
            </Typography>
            <Typography variant="body2">Cálculo 1:</Typography>
            <Typography variant="body2">Cálculo 2:</Typography>
            <Typography variant="body2">Cálculo 3:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              ¿Qué es esto?
            </Typography>
            <Typography variant="body2">Respuesta 1:</Typography>
            <Typography variant="body2">Respuesta 2:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Memoria (3 palabras)
            </Typography>
            <Typography variant="body2">Palabra 1:</Typography>
            <Typography variant="body2">Palabra 2:</Typography>
            <Typography variant="body2">Palabra 3:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Repita
            </Typography>
            <Typography variant="body2">Respuesta:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Lea esto
            </Typography>
            <Typography variant="body2">Texto leído:</Typography>
            <Typography variant="body2">Cierre los ojos y hágalo:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Doble papel
            </Typography>
            <Typography variant="body2">Logrado:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Copie dibujo
            </Typography>
            <Typography variant="body2">Logrado:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Escriba frase
            </Typography>
            <Typography variant="body2">Frase escrita:</Typography>
          </Grid>
        </Grid>
      </Paper>

=======
          <Typography variant="h6">Tratamiento Actual</Typography>
        </Box>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {paciente.tratamientoActual || "-"}
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
          sx={{
            backgroundColor: "#ed6c02",
            "&:hover": { backgroundColor: "#e65100" },
          }}
        >
          Imprimir planilla
        </Button>
      </Box>

      {openModal && (
<<<<<<< HEAD
        <ModalEdicion
=======
        <ModalEdicionAntecedentes
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

export default HistoriaClinicaTab;
