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
    funcional: datos?.funcional || {
      camina: paciente.camina,
      levantateYAnda: paciente.levantateYAnda,
      articulaciones: paciente.articulaciones,
      pasaMuchoTiempoSentado: paciente.pasaMuchoTiempoSentado,
      equilibrio: paciente.equilibrio,
      caidas: paciente.caidas,
    },
    social: datos?.social || {
      conQuienVive: paciente.conQuienVive,
      hijos: paciente.hijos,
      concurreALaConsulta: paciente.concurreALaConsulta,
      conyuge: paciente.conyuge,
      hermanos: paciente.hermanos,
      acompanado: paciente.acompanado,
      otros: paciente.otros,
    },
    mental: datos?.mental || {
      orientacionEnT: paciente.orientacionEnT,
      hijosMental: paciente.hijosMental,
      concurreALaConsultaMental: paciente.concurreALaConsultaMental,
      palabra1: paciente.palabra1,
      palabra2: paciente.palabra2,
      palabra3: paciente.palabra3,
      calculo1: paciente.calculo1,
      calculo2: paciente.calculo2,
      calculo3: paciente.calculo3,
      respuesta1: paciente.respuesta1,
      respuesta2: paciente.respuesta2,
      palabra1Memoria: paciente.palabra1Memoria,
      palabra2Memoria: paciente.palabra2Memoria,
      palabra3Memoria: paciente.palabra3Memoria,
      respuestaRepita: paciente.respuestaRepita,
      textoLeido: paciente.textoLeido,
      cierreOjosYHagalo: paciente.cierreOjosYHagalo,
      logradoDoblePapel: paciente.logradoDoblePapel,
      logradoCopieDibujo: paciente.logradoCopieDibujo,
      fraseEscrita: paciente.fraseEscrita,
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

  const d = (v) => v ?? "-";

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, maxWidth: "600px" }}>
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
            <Typography variant="body2">
              Camina: {paciente.camina || "-"}
            </Typography>
            <Typography variant="body2">
              Levántate y anda: {paciente.levantateYAnda || "-"}
            </Typography>
            <Typography variant="body2">
              Articulaciones: {paciente.articulaciones || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Pasa mucho tiempo sentado:{" "}
              {paciente.pasaMuchoTiempoSentado || "-"}
            </Typography>
            <Typography variant="body2">
              Equilibrio: {paciente.equilibrio || "-"}
            </Typography>
            <Typography variant="body2">
              Caídas: {paciente.caidas || "-"}
            </Typography>
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
            <Typography variant="body2">
              Con quién vive: {paciente.conQuienVive || "-"}
            </Typography>
            <Typography variant="body2">
              Hijos: {paciente.hijos || "-"}
            </Typography>
            <Typography variant="body2">
              Concurre a la consulta: {paciente.concurreALaConsulta || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              Cónyuge: {paciente.conyuge || "-"}
            </Typography>
            <Typography variant="body2">
              Hermanos: {paciente.hermanos || "-"}
            </Typography>
            <Typography variant="body2">
              Acompañado: {paciente.acompanado || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              Otros: {paciente.otros || "-"}
            </Typography>
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
            <Typography variant="body2">
              Orientación: {paciente.orientacionEnT || "-"}
            </Typography>
            <Typography variant="body2">
              Hijos: {paciente.hijosMental || "-"}
            </Typography>
            <Typography variant="body2">
              Concurre a la consulta:{" "}
              {paciente.concurreALaConsultaMental || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Fijación (repita 3 palabras)
            </Typography>
            <Typography variant="body2">
              Palabra 1: {paciente.palabra1 || "-"}
            </Typography>
            <Typography variant="body2">
              Palabra 2: {paciente.palabra2 || "-"}
            </Typography>
            <Typography variant="body2">
              Palabra 3: {paciente.palabra3 || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Concentración y cálculo
            </Typography>
            <Typography variant="body2">
              Cálculo 1: {paciente.calculo1 || "-"}
            </Typography>
            <Typography variant="body2">
              Cálculo 2: {paciente.calculo2 || "-"}
            </Typography>
            <Typography variant="body2">
              Cálculo 3: {paciente.calculo3 || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              ¿Qué es esto?
            </Typography>
            <Typography variant="body2">
              Respuesta 1: {paciente.respuesta1 || "-"}
            </Typography>
            <Typography variant="body2">
              Respuesta 2: {paciente.respuesta2 || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Memoria (3 palabras)
            </Typography>
            <Typography variant="body2">
              Palabra 1: {paciente.palabra1Memoria || "-"}
            </Typography>
            <Typography variant="body2">
              Palabra 2: {paciente.palabra2Memoria || "-"}
            </Typography>
            <Typography variant="body2">
              Palabra 3: {paciente.palabra3Memoria || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Repita
            </Typography>
            <Typography variant="body2">
              Respuesta: {paciente.respuestaRepita || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Lea esto
            </Typography>
            <Typography variant="body2">
              Texto leído: {paciente.textoLeido || "-"}
            </Typography>
            <Typography variant="body2">
              Cierre los ojos y hágalo: {paciente.cierreOjosYHagalo || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Doble papel
            </Typography>
            <Typography variant="body2">
              Logrado: {paciente.logradoDoblePapel || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Copie dibujo
            </Typography>
            <Typography variant="body2">
              Logrado: {paciente.logradoCopieDibujo || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Escriba frase
            </Typography>
            <Typography variant="body2">
              Frase escrita: {paciente.fraseEscrita || "-"}
            </Typography>
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
