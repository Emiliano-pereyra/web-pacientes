<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState } from "react";
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
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

const ResumenHCTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);
=======
  Avatar,
} from "@mui/material";
import Swal from "sweetalert2";
import ModalEdicionResumenHc from "./ModalEdicionResumenHC";

const ResumenHCTab = ({ paciente, datos }) => {
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
      text: "¿Deseas generar el PDF del resumen de historia clínica?",
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
          const res = await fetch("/api/exportador/resumenHc", {
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipoTab: "resumen-hc",
              datos: { paciente, resumen: datos },
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
    paciente: paciente
      ? {
          fecha: paciente.fecha || "",
          nombreCompleto: paciente.nombre || "",
          os: paciente.os || "",
          dni: paciente.dni || "",
          edad: paciente.edad || "",
          afNumero: paciente.afNumero || "",
        }
      : {},
    enfermedadBase: datos?.enfermedadBase || {
      texto:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!",
      ultimaActualizacion: datos?.ultimaActualizacion || "",
    },
    enfermedadActual: datos?.enfermedadActual || {
      texto:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!",
      ultimaActualizacion: datos?.ultimaActualizacion || "",
    },
    tratamientoBase: datos?.tratamientoBase || {
      texto:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!",
      ultimaActualizacion: datos?.ultimaActualizacion || "",
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

  // === ACTUALIZADO: datosParaEditar con nuevos campos ===
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
    // === ANTECEDENTES (Texto Libre - Nueva estructura) ===
    antecedentes: {
      cardiovascular: paciente?.antecedentesCardiovascular || "",
      digestivo: paciente?.antecedentesDigestivo || "",
      metabolico: paciente?.antecedentesMetabolico || "",
      neurologico: paciente?.antecedentesNeurologico || "",
      urologico: paciente?.antecedentesUrologico || "",
      psiquiatrico: paciente?.antecedentesPsiquiatrico || "",
      otros: paciente?.antecedentesOtros || "",
    },
    // === ENFERMEDAD ACTUAL ===
    enfermedadActual: paciente?.enfermedadActual || "",
    fechaUltModifEnfermedadActual:
      paciente?.fechaUltModifEnfermedadActual || "",
    // === TRATAMIENTO ACTUAL ===
    tratamientoActual: paciente?.tratamientoActual || "",
    // === ENFERMEDAD DE BASE / ANTECEDENTES PATOLÓGICOS ===
    antecedentesPatologicos: paciente?.antecedentesPatologicos || "",
    fechaUltModifAntecedentesPatologicos:
      paciente?.fechaUltModifAntecedentesPatologicos || "",
    tratamientoBase: paciente?.tratamientoBase || "",
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
  };

  if (!paciente) {
    return (
      <Alert severity="info">
        Por favor selecciona un paciente para ver el resumen de historia
        clínica.
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
      {/* Información del paciente */}
=======
  const d = (v) => v ?? "-";

  return (
    <Box>
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

>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
<<<<<<< HEAD
          <Typography variant="h6">Paciente</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <strong>Fecha:</strong> {paciente.fecha || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>Nombre completo:</strong> {paciente.nombre || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>Os:</strong> {paciente.os || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <strong>Dni:</strong> {paciente.dni || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>Edad:</strong> {paciente.edad || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>AF N°:</strong> {paciente.afNumero || "-"}
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
              {safe(paciente.antecedentesCardiovascular)}
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
              {safe(paciente.antecedentesDigestivo)}
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
              {safe(paciente.antecedentesMetabolico)}
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
              {safe(paciente.antecedentesNeurologico)}
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
              {safe(paciente.antecedentesUrologico)}
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
              {safe(paciente.antecedentesPsiquiatrico)}
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
              {safe(paciente.antecedentesOtros)}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
            </Typography>
          </Grid>
        </Grid>
      </Paper>

<<<<<<< HEAD
      {/* Enfermedad de base */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="span">
              Enfermedad de base -
            </Typography>
            <Typography variant="subtitle2" component="span" ml={1}>
              {datos?.enfermedadBase?.ultimaActualizacion || "sin fecha"}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
            p: 1,
            borderRadius: "4px",
          }}
        >
          <Typography variant="body2">
            {datos?.enfermedadBase?.texto ||
              "No hay información disponible sobre la enfermedad de base."}
=======
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="h6">Enfermedad actual -</Typography>
          <Typography variant="subtitle2" ml={1} color="text.secondary">
            {safe(paciente.fechaUltModifEnfermedadActual)}
          </Typography>
        </Box>
        <Box sx={{ p: 1, borderRadius: "4px" }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {safe(paciente.enfermedadActual)}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          </Typography>
        </Box>
      </Paper>

<<<<<<< HEAD
      {/* Enfermedad actual */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="span">
              Enfermedad actual -
            </Typography>
            <Typography variant="subtitle2" component="span" ml={1}>
              {datos?.enfermedadActual?.ultimaActualizacion || "sin fecha"}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
            p: 1,
            borderRadius: "4px",
          }}
        >
          <Typography variant="body2">
            {datos?.enfermedadActual?.texto ||
              "No hay información disponible sobre la enfermedad actual."}
          </Typography>
        </Box>
      </Paper>

      {/* Tratamiento de base */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="span">
              Tratamiento de base -
            </Typography>
            <Typography variant="subtitle2" component="span" ml={1}>
              {datos?.tratamientoBase?.ultimaActualizacion || "sin fecha"}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
            p: 1,
            borderRadius: "4px",
          }}
        >
          <Typography variant="body2">
            {datos?.tratamientoBase?.texto ||
              "No hay información disponible sobre el tratamiento de base."}
=======
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Tratamiento Actual</Typography>
        <Box sx={{ p: 1, borderRadius: "4px", mt: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {safe(paciente.tratamientoActual)}
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
          </Typography>
        </Box>
      </Paper>

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
        <ModalEdicionResumenHc
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

export default ResumenHCTab;
