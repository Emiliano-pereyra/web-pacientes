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
import ModalEdicionFliaYApod from "./ModalEdicionFliaYApod";
const FliaYApodTab = ({ paciente, datos }) => {
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
      Swal.fire("Error", "Selecciona un paciente con datos completos", "error");
      return;
    }

    Swal.fire({
      title: "Imprimir planilla",
      text: "¿Deseas imprimir la planilla de información familiar y apoderados?",
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
            tipoTab: "flia-y-apod",
            datos: {
              paciente: paciente,
              informacionAdicional: datos.informacionAdicional,
            },
          };

          const res = await fetch("/api/exportador/fliaYApod", {
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

  const datosParaEditar = {
    paciente: paciente
      ? {
          nombreCompleto: paciente.nombre || "",
          dni: paciente.dni || "",
        }
      : {},
    informacionAdicional: datos?.informacionAdicional || {
      yo: paciente.nombreCompleto,
      dniNumero: paciente.dni,
      calidad: "",
      residenteNombre: "",
      textoConsentimiento:
        "Que se encuentra ingresado en esta Residencia, ha sido informado/a de la medida de sujeción que se realiza bajo preescripción médica y dado el estado de salud de mi familiar/apoderante, es necesaria para evitar complicaciones graves tales como lesiones y/o caídas",
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

  const d = (v) => v ?? "-";

  return (
    <Box>
      <Grid container spacing={3}>
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
              <Typography variant="body2">
                DNI: {paciente.dni || "-"}
              </Typography>
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
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Información adicional</Typography>
            <Box
              sx={{
                p: 1,
                borderRadius: "4px",
              }}
            >
              <Typography variant="body2">
                Yo: {d(paciente.nombreCompleto)}
              </Typography>
              <Box display="flex" gap={2} mt={1}>
                <Typography variant="body2">
                  Identificado/a con DNI N°: {d(paciente.dni)}
                </Typography>
                <Typography variant="body2">
                  y en calidad de: {d(paciente.calidadDe)}
                </Typography>
              </Box>
              <Typography variant="body2" mt={1}>
                Del residente Sr/Sra: {d(paciente.nombreCompleto)}
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
        <ModalEdicionFliaYApod
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
