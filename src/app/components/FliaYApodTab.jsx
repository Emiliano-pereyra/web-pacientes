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

const FliaYApodTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleEditar = () => {
    if (!paciente) {
      Swal.fire("Error", "No hay paciente seleccionado", "error");
      return;
    }
    setOpenModal(true);
  };

  const handleImprimir = () => {
    Swal.fire({
      title: "Imprimir planilla",
      text: "¿Deseas imprimir la planilla de información familiar y apoderados?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, imprimir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Imprimiendo", "Generando PDF...", "info");
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const datosParaEditar = {
    paciente: paciente
      ? {
          nombreCompleto: paciente.nombre || "",
          dni: paciente.dni || "",
        }
      : {},
    informacionAdicional: datos?.informacionAdicional || {
      yo: "",
      dniNumero: "",
      calidad: "",
      residenteNombre: "",
      textoConsentimiento:
        "Que se encuentra ingresado en esta Residencia, ha sido informado/a de la medida de sujeción que se realiza bajo preescripción médica y dado el estado de salud de mi familiar/apoderante, es necesaria para evitar complicaciones graves tales como lesiones y/o caídas",
    },
  };

  if (!paciente) {
    return (
      <Alert severity="info">
        Por favor selecciona un paciente para ver la información familiar y
        apoderados.
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Información adicional</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
                p: 1,
                borderRadius: "4px",
              }}
            >
              <Typography variant="body2">Yo:</Typography>
              <Box display="flex" alignItems="center" gap={6} mt={1}>
                <Typography variant="body2">
                  Identificado/a con DNI N°:
                </Typography>
                <Typography variant="body2">y en calidad de:</Typography>
              </Box>
              <Typography variant="body2" mt={1}>
                Del residente Sr/Sra:
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Información adicional</Typography>
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
                Que se encuentra ingresado en esta Residencia, ha sido
                informado/a de la medida de sujeción que se realiza bajo
                preescripción médica y dado el estado de salud de mi
                familiar/apoderante, es necesaria para evitar complicaciones
                graves tales como lesiones y/o caídas
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

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

export default FliaYApodTab;
