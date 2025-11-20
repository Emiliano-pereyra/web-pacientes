import React, { useState } from "react";
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

const InterconsultaTab = ({ paciente, datos }) => {
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
          const res = await fetch("/api/exportador", {
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

  const datosParaEditar = {
    paciente: paciente
      ? {
          fecha: paciente.fecha || "",
          nombreCompleto: paciente.nombre || "",
          os: paciente.os || "",
          dni: paciente.dni || "",
          especialidad: paciente.especialidad || "",
          afNumero: paciente.afNumero || "",
        }
      : {},
    antecedentesPatologicos: datos?.antecedentesPatologicos || {
      texto:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!",
      ultimaActualizacion: datos?.ultimaActualizacion || "",
    },
    enfermedadActual: datos?.enfermedadActual || {
      texto:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!",
      ultimaActualizacion: datos?.ultimaActualizacion || "",
    },
    informeInterconsulta: datos?.informeInterconsulta || {
      texto:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!",
      ultimaActualizacion: datos?.ultimaActualizacion || "",
    },
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
            <Typography variant="body2">Fecha:</Typography>
            <Typography variant="body2">Nombre completo:</Typography>
            <Typography variant="body2">Os:</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">Dni:</Typography>
            <Typography variant="body2">Especialidad:</Typography>
            <Typography variant="body2">AF N°:</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Antecedentes patólogicos */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="span">
              Antecedentes patólogicos -
            </Typography>
            <Typography variant="subtitle2" component="span" ml={1}>
              última fecha de actualización
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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo
            dolorem dignissimos veniam quos adipisci ab dolor maiores delectus
            voluptates! Maiores, placeat ullam perspiciatis asperiores amet
            atque adipisci labore minima!
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
              última fecha de actualización
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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo
            dolorem dignissimos veniam quos adipisci ab dolor maiores delectus
            voluptates! Maiores, placeat ullam perspiciatis asperiores amet
            atque adipisci labore minima!
          </Typography>
        </Box>
      </Paper>

      {/* Informe de Interconsulta */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="span">
              Informe de Interconsulta -
            </Typography>
            <Typography variant="subtitle2" component="span" ml={1}>
              última fecha de actualización
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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo
            dolorem dignissimos veniam quos adipisci ab dolor maiores delectus
            voluptates! Maiores, placeat ullam perspiciatis asperiores amet
            atque adipisci labore minima!
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

export default InterconsultaTab;
