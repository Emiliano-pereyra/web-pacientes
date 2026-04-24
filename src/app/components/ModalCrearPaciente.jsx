<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
<<<<<<< HEAD
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from "@mui/material";

const CrearPacienteModal = ({ open, onClose, onCreateSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = ["Datos Personales"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
=======
  Alert,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  styled,
} from "@mui/material";
import { CloudUpload, Delete, Photo } from "@mui/icons-material";
import Image from "next/image";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileInput = React.forwardRef((props, ref) => (
  <VisuallyHiddenInput {...props} ref={ref} />
));
FileInput.displayName = "FileInput";

const CrearPacienteModal = ({ open, onClose, onCreateSuccess }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
    }));
    if (error) setError("");
  };

<<<<<<< HEAD
  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.nombre.trim() || !formData.apellido.trim()) {
        setError("Nombre y apellido son obligatorios.");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
=======
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor seleccione una imagen válida (jpg, png, gif, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    if (!formData.nombreCompleto?.trim()) {
      setError("Ingrese primero el nombre completo del paciente.");
      return;
    }

    setError("");
    setFotoSeleccionada(file);

    const preview = URL.createObjectURL(file);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(preview);
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
<<<<<<< HEAD
    try {
      const dataToSend = {
        id: `${formData.nombre} ${formData.apellido}`,
        ...formData,
      };

      const res = await fetch("/api/pacientes/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
=======

    try {
      if (!formData.nombreCompleto?.trim()) {
        throw new Error("El nombre completo es obligatorio.");
      }

      const fechaActual = getCurrentDate();

      const formDataToSend = new FormData();

      // === DATOS PERSONALES ===
      formDataToSend.append("nombreCompleto", formData.nombreCompleto || "");
      formDataToSend.append("dni", formData.dni || "");
      formDataToSend.append("edad", formData.edad || "");
      formDataToSend.append("genero", formData.genero || "");
      formDataToSend.append("obraSocial", formData.obraSocial || "");
      formDataToSend.append("afiliadoNumero", formData.afiliadoNumero || "");
      formDataToSend.append("urlFoto", formData.urlFoto || "");
      formDataToSend.append("fechaNacimiento", formData.fechaNacimiento || "");
      formDataToSend.append(
        "fechaIngreso",
        formData.fechaIngreso || fechaActual,
      );

      // === ANTECEDENTES PATOLÓGICOS ===
      formDataToSend.append(
        "Cardio",
        formData.antecedentesCardiovascular || "",
      );
      formDataToSend.append("Digestivos", formData.antecedentesDigestivo || "");
      formDataToSend.append(
        "Constipacion",
        formData.antecedentesDigestivo || "",
      );
      formDataToSend.append(
        "Metabolicas",
        formData.antecedentesMetabolico || "",
      );

      // Neurológico
      formDataToSend.append(
        "Paralisis",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append(
        "Parestesias",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append(
        "Temblores",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append(
        "Convulsiones",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append("Afasias", formData.antecedentesNeurologico || "");
      formDataToSend.append(
        "Disartria",
        formData.antecedentesNeurologico || "",
      );

      formDataToSend.append("Urologicas", formData.antecedentesUrologico || "");
      formDataToSend.append(
        "PsiquicaActiva",
        formData.antecedentesPsiquiatrico || "",
      );
      formDataToSend.append(
        "PsiquicaPasiva",
        formData.antecedentesPsiquiatrico || "",
      );

      // "Otros" antecedentes
      formDataToSend.append(
        "antecedentesPatologicos",
        formData.antecedentesOtros || "",
      );
      formDataToSend.append("Auditivas", formData.antecedentesOtros || "");
      formDataToSend.append("Olfativas", formData.antecedentesOtros || "");
      formDataToSend.append("Visuales", formData.antecedentesOtros || "");
      formDataToSend.append("Gustativas", formData.antecedentesOtros || "");
      formDataToSend.append("Ginecologicas", formData.antecedentesOtros || "");
      formDataToSend.append("Edemas", formData.antecedentesOtros || "");
      formDataToSend.append("Varices", formData.antecedentesOtros || "");
      formDataToSend.append("Ulceras", formData.antecedentesOtros || "");
      formDataToSend.append("Tiroides", formData.antecedentesOtros || "");
      formDataToSend.append("Dermatologicas", formData.antecedentesOtros || "");

      // === EXAMEN FÍSICO ===
      formDataToSend.append("TrOrientacion", formData.examenOrientacion || "");
      formDataToSend.append("TrAtencion", formData.examenOrientacion || "");
      formDataToSend.append("TrMemoria", formData.examenOrientacion || "");
      formDataToSend.append("TrSignoDepre", formData.examenOrientacion || "");
      formDataToSend.append("TrSueno", formData.examenOrientacion || "");
      formDataToSend.append("CardioR1R2", formData.examenCardiovascular || "");
      formDataToSend.append("PPBL", formData.examenCardiovascular || "");
      formDataToSend.append("CardiacaTA", formData.examenCardiovascular || "");
      formDataToSend.append(
        "CardiacaEdemas",
        formData.examenCardiovascular || "",
      );
      formDataToSend.append("TEJCP", formData.examenCardiovascular || "");
      formDataToSend.append("Auscultacion", formData.examenRespiratorio || "");
      formDataToSend.append("Percusion", formData.examenRespiratorio || "");
      formDataToSend.append(
        "RespiratoriaOtros",
        formData.examenRespiratorio || "",
      );
      formDataToSend.append("Abdomen", formData.examenDigestivo || "");
      formDataToSend.append("Palpacion", formData.examenDigestivo || "");
      formDataToSend.append("Catarsis", formData.examenDigestivo || "");
      formDataToSend.append(
        "DigestivoEsfinter",
        formData.examenDigestivo || "",
      );
      formDataToSend.append("DigestivoOtros", formData.examenDigestivo || "");
      formDataToSend.append(
        "GenitourinarioEsfinter",
        formData.examenGenitourinario || "",
      );
      formDataToSend.append(
        "GenitourinarioOtros",
        formData.examenGenitourinario || "",
      );
      formDataToSend.append("SNCAltMotoras", formData.examenNeurologico || "");
      formDataToSend.append("SNCSensitivas", formData.examenNeurologico || "");
      formDataToSend.append("SNCTemblores", formData.examenNeurologico || "");
      formDataToSend.append("SNCPostura", formData.examenNeurologico || "");
      formDataToSend.append("SNCEquilibrio", formData.examenNeurologico || "");
      formDataToSend.append("SNCMarcha", formData.examenNeurologico || "");
      formDataToSend.append("FacialOjos", formData.examenOtros || "");
      formDataToSend.append("FacialBoca", formData.examenOtros || "");
      formDataToSend.append("FacialDenticion", formData.examenOtros || "");
      formDataToSend.append("Adenopatias", formData.examenOtros || "");
      formDataToSend.append("Bocio", formData.examenOtros || "");
      formDataToSend.append("examenOtros", formData.examenOtros || "");

      // === TRATAMIENTO ACTUAL ===
      formDataToSend.append(
        "tratamientoActual",
        formData.tratamientoActual || "",
      );
      formDataToSend.append(
        "fechaTratamientoActual",
        formData.tratamientoActual ? fechaActual : "",
      );
      // Social
      formDataToSend.append("acompanado", "");
      formDataToSend.append("conQuienVive", "");
      formDataToSend.append("concurreALaConsulta", "");
      formDataToSend.append("conyuge", "");
      formDataToSend.append("hermanos", "");
      formDataToSend.append("hijos", "");
      formDataToSend.append("otros", "");
      // Mental
      formDataToSend.append("calculo1", "");
      formDataToSend.append("calculo2", "");
      formDataToSend.append("calculo3", "");
      formDataToSend.append("cierreOjosYHagalo", "");
      formDataToSend.append("concurreALaConsultaMental", "");
      formDataToSend.append("fraseEscrita", "");
      formDataToSend.append("hijosMental", "");
      formDataToSend.append("logradoCopieDibujo", "");
      formDataToSend.append("logradoDoblePapel", "");
      formDataToSend.append("orientacionEnT", "");
      formDataToSend.append("palabra1", "");
      formDataToSend.append("palabra1Memoria", "");
      formDataToSend.append("palabra2", "");
      formDataToSend.append("palabra2Memoria", "");
      formDataToSend.append("palabra3", "");
      formDataToSend.append("palabra3Memoria", "");
      formDataToSend.append("respuesta1", "");
      formDataToSend.append("respuesta2", "");
      formDataToSend.append("respuestaRepita", "");
      formDataToSend.append("textoLeido", "");
      // Funcional
      formDataToSend.append("articulaciones", "");
      formDataToSend.append("caidas", "");
      formDataToSend.append("camina", "");
      formDataToSend.append("equilibrio", "");
      formDataToSend.append("levantateYAnda", "");
      formDataToSend.append("pasaMuchoTiempoSentado", "");
      // Familia
      formDataToSend.append("calidadDe", "");
      // Evolución
      formDataToSend.append("Evolucion", "");
      formDataToSend.append("UltFechaModifEvolucion", "");
      formDataToSend.append("enfermedadActual", "");
      formDataToSend.append("enfermedadBase", "");
      formDataToSend.append("fechaEnfermedadBase", "");
      formDataToSend.append("informeInterconsulta", "");
      formDataToSend.append("tratamientoBase", "");
      formDataToSend.append("fechaAnteriorModifAntecedentesPatologicos", "");
      formDataToSend.append("fechaAnteriorModifEnfermedadActual", "");
      formDataToSend.append("fechaTratamientoBase", "");
      formDataToSend.append("TA", "");
      formDataToSend.append(
        "Cardio",
        formData.antecedentesCardiovascular || "",
      );
      formDataToSend.append("Digestivos", formData.antecedentesDigestivo || "");
      formDataToSend.append(
        "Constipacion",
        formData.antecedentesDigestivo || "",
      );
      formDataToSend.append(
        "Metabolicas",
        formData.antecedentesMetabolico || "",
      );
      formDataToSend.append("Auditivas", formData.antecedentesOtros || "");
      formDataToSend.append("Olfativas", formData.antecedentesOtros || "");
      formDataToSend.append("Visuales", formData.antecedentesOtros || "");
      formDataToSend.append("Gustativas", formData.antecedentesOtros || "");
      formDataToSend.append("Ginecologicas", formData.antecedentesOtros || "");
      formDataToSend.append("Edemas", formData.antecedentesOtros || "");
      formDataToSend.append("Varices", formData.antecedentesOtros || "");
      formDataToSend.append("Ulceras", formData.antecedentesOtros || "");
      formDataToSend.append("Tiroides", formData.antecedentesOtros || "");
      formDataToSend.append(
        "Paralisis",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append(
        "Parestesias",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append(
        "Temblores",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append(
        "Convulsiones",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append("Afasias", formData.antecedentesNeurologico || "");
      formDataToSend.append(
        "Disartria",
        formData.antecedentesNeurologico || "",
      );
      formDataToSend.append("Urologicas", formData.antecedentesUrologico || "");
      formDataToSend.append("Dermatologicas", formData.antecedentesOtros || "");
      formDataToSend.append(
        "PsiquicaActiva",
        formData.antecedentesPsiquiatrico || "",
      );
      formDataToSend.append(
        "PsiquicaPasiva",
        formData.antecedentesPsiquiatrico || "",
      );
      formDataToSend.append("FacialOjos", formData.examenOtros || "");
      formDataToSend.append("FacialBoca", formData.examenOtros || "");
      formDataToSend.append("FacialDenticion", formData.examenOtros || "");
      formDataToSend.append("CardioR1R2", formData.examenCardiovascular || "");
      formDataToSend.append("PPBL", formData.examenCardiovascular || "");
      formDataToSend.append(
        "GenitourinarioEsfinter",
        formData.examenGenitourinario || "",
      );
      formDataToSend.append(
        "GenitourinarioOtros",
        formData.examenGenitourinario || "",
      );
      formDataToSend.append("TrAtencion", formData.examenOrientacion || "");
      formDataToSend.append("TrOrientacion", formData.examenOrientacion || "");
      formDataToSend.append("TrMemoria", formData.examenOrientacion || "");
      formDataToSend.append("TrSignoDepre", formData.examenOrientacion || "");
      formDataToSend.append("TrSueno", formData.examenOrientacion || "");
      formDataToSend.append("Adenopatias", formData.examenOtros || "");
      formDataToSend.append("Bocio", formData.examenOtros || "");
      formDataToSend.append("CardiacaTA", formData.examenCardiovascular || "");
      formDataToSend.append(
        "CardiacaEdemas",
        formData.examenCardiovascular || "",
      );
      formDataToSend.append("TEJCP", formData.examenCardiovascular || "");
      formDataToSend.append("Peso", "");
      formDataToSend.append("Percusion", formData.examenRespiratorio || "");
      formDataToSend.append("Auscultacion", formData.examenRespiratorio || "");
      formDataToSend.append(
        "RespiratoriaOtros",
        formData.examenRespiratorio || "",
      );
      formDataToSend.append("Abdomen", formData.examenDigestivo || "");
      formDataToSend.append("Palpacion", formData.examenDigestivo || "");
      formDataToSend.append("Catarsis", formData.examenDigestivo || "");
      formDataToSend.append(
        "DigestivoEsfinter",
        formData.examenDigestivo || "",
      );
      formDataToSend.append("DigestivoOtros", formData.examenDigestivo || "");
      formDataToSend.append("SNCAltMotoras", formData.examenNeurologico || "");
      formDataToSend.append("SNCSensitivas", formData.examenNeurologico || "");
      formDataToSend.append("SNCTemblores", formData.examenNeurologico || "");
      formDataToSend.append("SNCPostura", formData.examenNeurologico || "");
      formDataToSend.append("SNCEquilibrio", formData.examenNeurologico || "");
      formDataToSend.append("SNCMarcha", formData.examenNeurologico || "");

      const selectedFile = fotoSeleccionada;

      if (selectedFile && selectedFile.size > 0) {
        if (!selectedFile.type.startsWith("image/")) {
          throw new Error("El archivo seleccionado no es una imagen válida.");
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error("La imagen supera el límite de 5MB.");
        }
        formDataToSend.append("file", selectedFile);
      }

      const res = await fetch("/api/pacientes/crear", {
        method: "POST",
        body: formDataToSend,
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Error al crear paciente");
      }

      onCreateSuccess(result.id);
      onClose();
    } catch (err) {
<<<<<<< HEAD
      console.error("Error creando paciente:", err);
=======
      console.error(" Error creando paciente:", err);
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const renderStep = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
            />
          </Box>
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Nuevo Paciente</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

=======
  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFotoSeleccionada(null);
    setFormData((prev) => ({ ...prev, urlFoto: "" }));
    setPreviewUrl(null);
  };

  const getDisplayImageUrl = () => {
    if (previewUrl) return previewUrl;

    if (
      formData.urlFoto &&
      typeof formData.urlFoto === "string" &&
      formData.urlFoto.trim() !== "" &&
      formData.urlFoto !== "-" &&
      formData.urlFoto !== "null" &&
      formData.urlFoto !== "undefined" &&
      formData.urlFoto.startsWith("http")
    ) {
      return formData.urlFoto;
    }

    return null;
  };

  useEffect(() => {
    if (!open) {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setFotoSeleccionada(null);
      setFormData({});
    }
  }, [open, previewUrl]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "85vh",
          width: "95vw",
          maxWidth: "1200px",
        },
      }}
    >
      <DialogTitle>Crear Nuevo Paciente</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "65vh", overflowY: "auto" }}>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
<<<<<<< HEAD

        {renderStep(activeStep)}
      </DialogContent>
      <DialogActions>
        {activeStep > 0 && (
          <Button onClick={handleBack} color="secondary">
            Volver
          </Button>
        )}
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} color="primary">
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Crear Paciente"}
          </Button>
        )}
=======
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
          >
            <Tab label="Datos Personales" />
            <Tab label="Antecedentes" />
            <Tab label="Examen Físico" />
            <Tab label="Tratamiento Actual" />
          </Tabs>
        </Box>

        {/* TAB 0: DATOS PERSONALES */}
        {tabIndex === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Datos Personales
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                label="Nombre Completo *"
                name="nombreCompleto"
                value={formData.nombreCompleto || ""}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="DNI"
                name="dni"
                value={formData.dni || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Edad"
                name="edad"
                value={formData.edad || ""}
                onChange={handleChange}
                type="number"
                fullWidth
              />
              <TextField
                label="Género"
                name="genero"
                value={formData.genero || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Obra Social"
                name="obraSocial"
                value={formData.obraSocial || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="N° Afiliado"
                name="afiliadoNumero"
                value={formData.afiliadoNumero || ""}
                onChange={handleChange}
                fullWidth
              />{" "}
              <TextField
                label="Fecha Nacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Fecha Ingreso"
                name="fechaIngreso"
                type="date"
                value={formData.fechaIngreso || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Box sx={{ gridColumn: "span 4" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Foto del Paciente
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      border: "2px dashed",
                      borderColor:
                        previewUrl || formData.urlFoto
                          ? "success.main"
                          : "grey.400",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {getDisplayImageUrl() ? (
                      <>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Image
                            src={getDisplayImageUrl()}
                            alt="Foto del paciente"
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </Box>
                        <Button
                          onClick={handleRemovePhoto}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            minWidth: "auto",
                            padding: "4px",
                            backgroundColor: "rgba(255,255,255,0.7)",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.9)",
                            },
                            zIndex: 1,
                          }}
                        >
                          <Delete fontSize="small" color="error" />
                        </Button>
                      </>
                    ) : (
                      <Photo color="disabled" sx={{ fontSize: 48 }} />
                    )}
                  </Box>
                  <Box
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUpload />}
                      disabled={uploadingPhoto}
                      sx={{ mb: 1, maxWidth: 250 }}
                    >
                      {uploadingPhoto ? "Subiendo..." : "Seleccionar Foto"}
                      <FileInput
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoSelect}
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      JPG, PNG o GIF. Máximo 5MB.
                    </Typography>
                    {formData.urlFoto && (
                      <Typography
                        variant="caption"
                        color="success.main"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Foto cargada exitosamente
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Antecedentes
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                label="Cardiovascular"
                name="antecedentesCardiovascular"
                value={formData.antecedentesCardiovascular || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Digestivo"
                name="antecedentesDigestivo"
                value={formData.antecedentesDigestivo || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Metabólico"
                name="antecedentesMetabolico"
                value={formData.antecedentesMetabolico || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Neurológico"
                name="antecedentesNeurologico"
                value={formData.antecedentesNeurologico || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Urológico"
                name="antecedentesUrologico"
                value={formData.antecedentesUrologico || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Psiquiátrico"
                name="antecedentesPsiquiatrico"
                value={formData.antecedentesPsiquiatrico || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Otros"
                name="antecedentesOtros"
                value={formData.antecedentesOtros || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Examen Físico
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                label="Orientación"
                name="examenOrientacion"
                value={formData.examenOrientacion || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="AP. Cardiovascular"
                name="examenCardiovascular"
                value={formData.examenCardiovascular || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Respiratorio"
                name="examenRespiratorio"
                value={formData.examenRespiratorio || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Digestivo"
                name="examenDigestivo"
                value={formData.examenDigestivo || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Genitourinario"
                name="examenGenitourinario"
                value={formData.examenGenitourinario || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Neurológico / Psiquis"
                name="examenNeurologico"
                value={formData.examenNeurologico || ""}
                onChange={handleChange}
                multiline
                rows={1}
                fullWidth
              />
              <TextField
                label="Otros"
                name="examenOtros"
                value={formData.examenOtros || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
          </Box>
        )}

        {tabIndex === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Tratamiento Actual
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                label="Descripción del Tratamiento"
                name="tratamientoActual"
                value={formData.tratamientoActual || ""}
                onChange={handleChange}
                multiline
                rows={11}
                fullWidth
                placeholder="Detalle medicamentos, dosis, frecuencia y observaciones..."
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading || !formData.nombreCompleto?.trim()}
        >
          {loading ? <CircularProgress size={24} /> : "Crear Paciente"}
        </Button>
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
      </DialogActions>
    </Dialog>
  );
};

<<<<<<< HEAD
export default CrearPacienteModal;
=======
export default CrearPacienteModal;
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
