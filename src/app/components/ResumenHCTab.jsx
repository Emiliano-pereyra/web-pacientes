import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import ModalEdicion from "./ModalEdicion";

const ResumenHCTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleEditar = () => {
    if (!paciente) {
      Swal.fire("Error", "No hay paciente seleccionado", "error");
      return;
    }
    setOpenModal(true);
  };

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
          const res = await fetch("/api/exportador", {
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

  return (
    <Box>
      {/* Información del paciente */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
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
            </Typography>
          </Grid>
        </Grid>
      </Paper>

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
          </Typography>
        </Box>
      </Paper>

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
        <ModalEdicion
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
