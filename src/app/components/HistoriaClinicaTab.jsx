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
import ModalEdicionHistoriaClinica from "./ModalEdicionHC";

const HistoriaClinicaTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);
  const [fotoError, setFotoError] = useState(false);

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
      text: "¿Deseas generar el PDF de antecedentes?",
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
            "error",
          );
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
  };

  if (!paciente) {
    return (
      <Alert severity="info">
        Por favor selecciona un paciente para ver los antecedentes.
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
      {/* === INFORMACIÓN DEL PACIENTE === */}
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

      {/* === ANTECEDENTES (Nueva estructura - Texto Libre) === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
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
          </Grid>
        </Grid>
      </Paper>

      {/* === EXAMEN FÍSICO (Nueva estructura - Texto Libre) === */}
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
          </Grid>
        </Grid>
      </Paper>

      {/* === TRATAMIENTO ACTUAL (Campo único de texto libre) === */}
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
          {paciente.tratamientoActual || "-"}
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
        <ModalEdicionHistoriaClinica
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
