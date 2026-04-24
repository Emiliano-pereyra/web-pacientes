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
import ModalEdicionInterconsulta from "./ModalEdicionInterconsulta";

const InterconsultaTab = ({ paciente, datos }) => {
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
      text: "¿Deseas generar el PDF historia clínica?",
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
          const res = await fetch("/api/exportador/interconsulta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipoTab: "historia-clinica",
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

  // === ACTUALIZADO: datosParaEditar con nueva estructura ===
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
    // === ANTECEDENTES (Nueva estructura - Texto Libre) ===
    antecedentes: {
      cardiovascular: paciente?.antecedentesCardiovascular || "",
      digestivo: paciente?.antecedentesDigestivo || "",
      metabolico: paciente?.antecedentesMetabolico || "",
      neurologico: paciente?.antecedentesNeurologico || "",
      urologico: paciente?.antecedentesUrologico || "",
      psiquiatrico: paciente?.antecedentesPsiquiatrico || "",
      otros: paciente?.antecedentesOtros || "",
    },
    // === TRATAMIENTO ACTUAL ===
    tratamientoActual: paciente?.tratamientoActual || "",
    // === MOTIVO DE CONSULTA (Nuevo campo) ===
    motivoConsulta: paciente?.motivoConsulta || "",
    // === INFORME DE INTERCONSULTA (Se mantiene) ===
    informeInterconsulta: paciente?.informeInterconsulta || "",
  };

  if (!paciente) {
    return (
      <Alert severity="info">
        Por favor selecciona un paciente para ver la interconsulta.
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
          <Grid item xs={12} md={4} sx={{ ml: 5, mb: 2 }} display="flex" justifyContent="center" alignItems="center">
            <Avatar
              src={paciente.urlFoto && !fotoError ? paciente.urlFoto : ""}
              alt={paciente.nombreCompleto || "Paciente"}
              onError={handleFotoError}
              sx={{
                width: 80,
                height: 80,
                fontSize: 32,
                bgcolor: fotoError || !paciente.urlFoto ? "primary.main" : undefined,
                border: "2px solid",
                borderColor: "divider",
              }}
            >
              {(fotoError || !paciente.urlFoto) && getInitials(paciente.nombreCompleto)}
            </Avatar>
          </Grid>
        </Grid>
      </Paper>

      {/* === MOTIVO DE CONSULTA (Nuevo campo) === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Motivo de Consulta</Typography>
        <Box sx={{ p: 1, borderRadius: "4px", bgcolor: "grey.50", mt: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {safe(paciente.motivoConsulta)}
          </Typography>
        </Box>
      </Paper>

      {/* === ANTECEDENTES (Nueva estructura - Texto Libre) === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Antecedentes</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline", mb: 1 }}>
              Cardiovascular
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {safe(paciente.antecedentesCardiovascular)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline", mb: 1 }}>
              Digestivo
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {safe(paciente.antecedentesDigestivo)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline", mb: 1 }}>
              Metabólico
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {safe(paciente.antecedentesMetabolico)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline", mb: 1 }}>
              Neurológico
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {safe(paciente.antecedentesNeurologico)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline", mb: 1 }}>
              Urológico
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {safe(paciente.antecedentesUrologico)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline", mb: 1 }}>
              Psiquiátrico
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {safe(paciente.antecedentesPsiquiatrico)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ textDecoration: "underline", mb: 1 }}>
              Otros
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {safe(paciente.antecedentesOtros)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* === TRATAMIENTO ACTUAL === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Tratamiento Actual</Typography>
        <Box sx={{ p: 1, borderRadius: "4px", bgcolor: "grey.50", mt: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {safe(paciente.tratamientoActual)}
          </Typography>
        </Box>
      </Paper>

      {/* === INFORME DE INTERCONSULTA (Se mantiene) === */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Informe de Interconsulta</Typography>
        <Box sx={{ p: 1, borderRadius: "4px", bgcolor: "grey.50", mt: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {safe(paciente.informeInterconsulta)}
          </Typography>
        </Box>
      </Paper>

      {/* === BOTONES DE ACCIÓN === */}
      <Box display="flex" justifyContent="center" mt={3} gap={2}>
        <Button variant="contained" color="primary" size="large" onClick={handleEditar}>
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
        <ModalEdicionInterconsulta
          open={openModal}
          onClose={handleCloseModal}
          datos={datosParaEditar}
          pacienteId={paciente.id}
        />
      )}
    </Box>
  );
};

export default InterconsultaTab;
