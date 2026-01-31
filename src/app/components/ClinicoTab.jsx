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
import ModalEdicionClinico from "./ModalEdicionClinico";

const ClinicoTab = ({ paciente, datos }) => {
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
          const res = await fetch("/api/exportador/clinico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipoTab: "clinico",
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
    antecedentes: datos?.antecedentes || {
      vasculares: {
        ta: paciente.TA,
        cardio: paciente.Cardio,
      },
      digestivos: {
        parrafoDigestivos: paciente.Digestivos,
        constipacion: paciente.Constipacion,
      },
      metabolicas: {
        parrafoMetabolicos: paciente.Metabolicas,
      },
      sensoriales: {
        auditivas: paciente.Auditivas,
        olfativas: paciente.Olfativas,
        visuales: paciente.Visuales,
        gustativas: paciente.Gustativas,
      },
      ginecologicas: {
        parrafoGinecologicas: paciente.Ginecologicas,
      },
      vPerif: {
        edemas: paciente.Edemas,
        varices: paciente.Varices,
        ulceras: paciente.Ulceras,
      },
      dbt: {
        tiroides: paciente.Tiroides,
      },
      SNC: {
        paralisis: paciente.Paralisis,
        parestesias: paciente.Parestesias,
        temblores: paciente.Temblores,
        convulsiones: paciente.Convulsiones,
        afasias: paciente.Afasias,
        disartria: paciente.Disartria,
      },
      urologicas: {
        parrafoUrologicas: paciente.Urologicas,
      },
      dermatologicas: {
        parrafoDermatologicas: paciente.Dermatologicas,
      },
      actitudPsiquica: {
        activa: paciente.PsiquicaActiva,
        pasiva: paciente.PsiquicaPasiva,
      },
    },
    examenFisico: datos?.examenFisico || {
      fasciales: {
        ojos: paciente.FacialOjos,
        boca: paciente.FacialBoca,
        denticion: paciente.FacialDenticion,
      },
      apCardiovascular: {
        r1yr2: paciente.CardioR1R2,
      },
      apGenitourinario: {
        ppbl: paciente.PPBL,
        controlEsfinter: paciente.GenitourinarioEsfinter,
        otro: paciente.GenitourinarioOtros,
      },
      trMentales: {
        atencion: paciente.TrAtencion,
        orientacion: paciente.TrOrientacion,
        memoria: paciente.TrMemoria,
        signosDepresivos: paciente.SignoDepre,
        trSueno: paciente.TrSueno,
      },
      cuello: {
        adenopatias: paciente.Adenopatias,
        bocio: paciente.Bocio,
      },
      signosFallaCardiaca: {
        ta: paciente.CardiacaTA,
        edemas: paciente.CardiacaEdemas,
      },
      dermatologicos: {
        tejCp: paciente.TEJCP,
        peso: paciente.Peso,
      },
      apRespiratoria: {
        percusion: paciente.Percusion,
        auscultacion: paciente.Auscultacion,
        otros: paciente.RespiratoriaOtros,
      },
      apDigestivo: {
        abdomen: paciente.Abdomen,
        palpacion: paciente.Palpacion,
        catarsis: paciente.Catarsis,
        controlEsfinter: paciente.DigestivoEsfinter,
        otro: paciente.DigestivoOtros,
      },
      SNC: {
        alteracionesMotoras: paciente.SNCAltMotoras,
        sensitivas: paciente.SNCSensitivas,
        temblores: paciente.SNCTemblores,
        postura: paciente.SNCPostura,
        equilibrio: paciente.SNCEquilibrio,
        marcha: paciente.SNCMarcha,
      },
    },
    tratamientoActual: datos?.tratamientoActual || {
      tratamientoActual: paciente.TratamientoActual,
    },
    evolucion: datos?.evolucion || {
      texto:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo dolorem dignissimos veniam quos adipisci ab dolor maiores delectus voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque adipisci labore minima!",
      ultimaActualizacion: "",
    },
  };

  if (!paciente) {
    return (
      <Alert severity="info">
        Por favor selecciona un paciente para ver los datos clínicos.
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Antecedentes del paciente</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Vasculares
            </Typography>
            <Typography variant="body2">TA:</Typography>
            <Typography variant="body2">Cardio:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Digestivos
            </Typography>
            <Typography variant="body2">Párrafo para digestivos</Typography>
            <Typography variant="body2">Constipación:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Metabólicas
            </Typography>
            <Typography variant="body2">Párrafo para metabolicos</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Sensoriales
            </Typography>
            <Typography variant="body2">Auditivas:</Typography>
            <Typography variant="body2">Olfativas:</Typography>
            <Typography variant="body2">Visuales:</Typography>
            <Typography variant="body2">Gustativas:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ginecológicas
            </Typography>
            <Typography variant="body2">Párrafo de ginecológicas</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              V PERIF
            </Typography>
            <Typography variant="body2">Edemas:</Typography>
            <Typography variant="body2">Várices:</Typography>
            <Typography variant="body2">Úlceras:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              DBT
            </Typography>
            <Typography variant="body2">Tiroides:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              SNC
            </Typography>
            <Typography variant="body2">Parálisis:</Typography>
            <Typography variant="body2">Parestesias:</Typography>
            <Typography variant="body2">Temblores:</Typography>
            <Typography variant="body2">Convulsiones:</Typography>
            <Typography variant="body2">Afasias:</Typography>
            <Typography variant="body2">Disartria:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Urológicas
            </Typography>
            <Typography variant="body2">Párrafo de urologicas</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Dermatológicas
            </Typography>
            <Typography variant="body2">Párrafo de dermatologicas:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Actitud psíquica
            </Typography>
            <Typography variant="body2">Activa:</Typography>
            <Typography variant="body2">Pasiva:</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Examen físico */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Examen físico</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Fasciales
            </Typography>
            <Typography variant="body2">Ojos:</Typography>
            <Typography variant="body2">Boca:</Typography>
            <Typography variant="body2">Dentición:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ap cardiovascular
            </Typography>
            <Typography variant="body2">R1 y R2:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ap. genitourinario
            </Typography>
            <Typography variant="body2">PPBL:</Typography>
            <Typography variant="body2">Control de esfínter:</Typography>
            <Typography variant="body2">Otro:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Tr. mentales
            </Typography>
            <Typography variant="body2">Atención:</Typography>
            <Typography variant="body2">Orientación:</Typography>
            <Typography variant="body2">Memoria:</Typography>
            <Typography variant="body2">Signos depresivos:</Typography>
            <Typography variant="body2">Tr. del sueño:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Cuello
            </Typography>
            <Typography variant="body2">Adenopatías:</Typography>
            <Typography variant="body2">Bocio:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Signos falla cardíaca
            </Typography>
            <Typography variant="body2">TA:</Typography>
            <Typography variant="body2">Edemas:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Dermatológicos
            </Typography>
            <Typography variant="body2">TEJ CP:</Typography>
            <Typography variant="body2">Peso:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ap. respiratoria
            </Typography>
            <Typography variant="body2">Percusión:</Typography>
            <Typography variant="body2">Auscultación:</Typography>
            <Typography variant="body2">Otros:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              Ap. digestivo
            </Typography>
            <Typography variant="body2">Abdomen:</Typography>
            <Typography variant="body2">A la palpación:</Typography>
            <Typography variant="body2">Catarsis:</Typography>
            <Typography variant="body2">Control de esfínter:</Typography>
            <Typography variant="body2">Otro:</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ textDecoration: "underline" }}
            >
              SNC
            </Typography>
            <Typography variant="body2">Alteraciones motoras:</Typography>
            <Typography variant="body2">Sensitivas:</Typography>
            <Typography variant="body2">Temblores:</Typography>
            <Typography variant="body2">Postura:</Typography>
            <Typography variant="body2">Equilibrio:</Typography>
            <Typography variant="body2">Marcha:</Typography>
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
          <Typography variant="h6">Tratamiento actual</Typography>
        </Box>
        <Typography variant="body2">Tratamiento1...</Typography>
        <Typography variant="body2">Tratamiento2...</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="span">
              Evolución -
            </Typography>
            <Typography variant="subtitle2" component="span" ml={1}>
              última fecha de actualización
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, quo
          dolorem dignissimos veniam quos adipisci ab dolor maiores delectus
          voluptates! Maiores, placeat ullam perspiciatis asperiores amet atque
          adipisci labore minima!
        </Typography>
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
        <ModalEdicionClinico
          open={openModal}
          onClose={handleCloseModal}
          datos={datosParaEditar}
          pacienteId={paciente.id}
        />
      )}
    </Box>
  );
};

export default ClinicoTab;
