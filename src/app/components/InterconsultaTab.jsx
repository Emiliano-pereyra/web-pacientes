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
import ModalEdicionInterconsulta from "./ModalEdicionInterconsulta";

const InterconsultaTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);

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
      antecedentesPatologicosActual:paciente.antecedentesPatologicosActual,
      fechaUltModifAntecedentesPatologicos: paciente.fechaUltModifAntecedentesPatologicos || "",
    },
    enfermedadActual: datos?.enfermedadActual || {
      enfermedadActual:
        paciente.enfermedadActual,
      fechaUltModifEnfermedadActual: datos?.ultimaActualizacion || "",
    },
    informeInterconsulta: datos?.informeInterconsulta || {
      informeInterconsulta:
       paciente.informeInterconsulta,
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

const d = (v) => v ?? "-";

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Paciente</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Fecha: {d(paciente.fechaIngreso)}
            </Typography>
            <Typography variant="body2">
              Nombre completo: {d(paciente.nombreCompleto)}
            </Typography>
            <Typography variant="body2">
              Obra Social: {d(paciente.obraSocial)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">DNI: {d(paciente.dni)}</Typography>
            <Typography variant="body2">
              AF N°: {d(paciente.afiliadoNumero)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="h6">Antecedentes patológicos -</Typography>
          <Typography variant="subtitle2" ml={1}>
            {d(paciente.fechaUltModifAntecedentesPatologicos)}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1,
            bgcolor: "#fff",
            borderRadius: "4px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="body2">
            {d(paciente.antecedentesPatologicosActual)}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="h6">Enfermedad actual -</Typography>
          <Typography variant="subtitle2" ml={1}>
            {d(paciente.fechaUltModifEnfermedadActual)}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1,
            bgcolor: "#fff",
            borderRadius: "4px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="body2">
            {d(paciente.enfermedadActual)}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Informe de Interconsulta</Typography>
        <Box
          sx={{
            p: 1,
            bgcolor: "#fff",
            borderRadius: "4px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="body2">
            {d(paciente.informeInterconsulta)}
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
