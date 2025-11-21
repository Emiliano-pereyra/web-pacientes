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
import ModalEdicion from "./ModalEdicion";

const HistoriaClinicaTab = ({ paciente, datos }) => {
  const [openModal, setOpenModal] = useState(false);

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
      text: "¿Deseas generar el PDF de historia clínica?",
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
            "error"
          );
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
  };

  if (!paciente) {
    return (
      <Alert severity="info">
        Por favor selecciona un paciente para ver la historia clínica.
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
      <Paper sx={{ p: 2, mb: 3, maxWidth: "500px" }}>
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
            <Typography variant="body2">Fecha de ingreso: {paciente.Informacion?.fechaIngreso}</Typography>
            <Typography variant="body2">Nombre completo: {paciente.Informacion?.nombreCompleto}</Typography>
            <Typography variant="body2">Os:</Typography>
            <Typography variant="body2">DNI:</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">Fecha de nacimiento:</Typography>
            <Typography variant="body2">Edad: {paciente.edad}</Typography>
            <Typography variant="body2">AF N°:</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              src={paciente.urlFoto}
              alt={paciente.nombre}
              sx={{ width: 60, height: 60 }}
            />
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

export default HistoriaClinicaTab;
