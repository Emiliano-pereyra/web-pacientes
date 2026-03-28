import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
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

const CrearPacienteModal = ({ open, onClose, onCreateSuccess }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    }));
    if (error) setError("");
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (!formData.nombreCompleto?.trim()) {
        throw new Error("El nombre completo es obligatorio.");
      }

      const fechaActual = getCurrentDate();

      const payload = {
        // === DATOS PERSONALES ===
        nombreCompleto: formData.nombreCompleto || "",
        dni: formData.dni || "",
        edad: formData.edad || "",
        genero: formData.genero || "",
        obraSocial: formData.obraSocial || "",
        afiliadoNumero: formData.afiliadoNumero || "",
        urlFoto: formData.urlFoto || "",
        fechaNacimiento: formData.fechaNacimiento || "",
        fechaIngreso: formData.fechaIngreso || fechaActual,

        // === ANTECEDENTES PATOLÓGICOS ===
        Cardio: formData.antecedentesCardiovascular || "",
        Digestivos: formData.antecedentesDigestivo || "",
        Constipacion: formData.antecedentesDigestivo || "",
        Metabolicas: formData.antecedentesMetabolico || "",

        // Neurológico
        Paralisis: formData.antecedentesNeurologico || "",
        Parestesias: formData.antecedentesNeurologico || "",
        Temblores: formData.antecedentesNeurologico || "",
        Convulsiones: formData.antecedentesNeurologico || "",
        Afasias: formData.antecedentesNeurologico || "",
        Disartria: formData.antecedentesNeurologico || "",

        Urologicas: formData.antecedentesUrologico || "",
        PsiquicaActiva: formData.antecedentesPsiquiatrico || "",
        PsiquicaPasiva: formData.antecedentesPsiquiatrico || "",

        // "Otros" antecedentes
        antecedentesPatologicos: formData.antecedentesOtros || "",
        Auditivas: formData.antecedentesOtros || "",
        Olfativas: formData.antecedentesOtros || "",
        Visuales: formData.antecedentesOtros || "",
        Gustativas: formData.antecedentesOtros || "",
        Ginecologicas: formData.antecedentesOtros || "",
        Edemas: formData.antecedentesOtros || "",
        Varices: formData.antecedentesOtros || "",
        Ulceras: formData.antecedentesOtros || "",
        Tiroides: formData.antecedentesOtros || "",
        Dermatologicas: formData.antecedentesOtros || "",

        // === EXAMEN FÍSICO  ===
        // Orientación / Mental
        TrOrientacion: formData.examenOrientacion || "",
        TrAtencion: formData.examenOrientacion || "",
        TrMemoria: formData.examenOrientacion || "",
        TrSignoDepre: formData.examenOrientacion || "",
        TrSueno: formData.examenOrientacion || "",

        // Cardiovascular
        CardioR1R2: formData.examenCardiovascular || "",
        PPBL: formData.examenCardiovascular || "",
        CardiacaTA: formData.examenCardiovascular || "",
        CardiacaEdemas: formData.examenCardiovascular || "",
        TEJCP: formData.examenCardiovascular || "",

        // Respiratorio
        Auscultacion: formData.examenRespiratorio || "",
        Percusion: formData.examenRespiratorio || "",
        RespiratoriaOtros: formData.examenRespiratorio || "",

        // Digestivo
        Abdomen: formData.examenDigestivo || "",
        Palpacion: formData.examenDigestivo || "",
        Catarsis: formData.examenDigestivo || "",
        DigestivoEsfinter: formData.examenDigestivo || "",
        DigestivoOtros: formData.examenDigestivo || "",

        // Genitourinario
        GenitourinarioEsfinter: formData.examenGenitourinario || "",
        GenitourinarioOtros: formData.examenGenitourinario || "",

        // Neurológico / Psiquis
        SNCAltMotoras: formData.examenNeurologico || "",
        SNCSensitivas: formData.examenNeurologico || "",
        SNCTemblores: formData.examenNeurologico || "",
        SNCPostura: formData.examenNeurologico || "",
        SNCEquilibrio: formData.examenNeurologico || "",
        SNCMarcha: formData.examenNeurologico || "",

        // Facial / Otros
        FacialOjos: formData.examenOtros || "",
        FacialBoca: formData.examenOtros || "",
        FacialDenticion: formData.examenOtros || "",
        Adenopatias: formData.examenOtros || "",
        Bocio: formData.examenOtros || "",
        examenOtros: formData.examenOtros || "",

        // === TRATAMIENTO ACTUAL ===
        tratamientoActual: formData.tratamientoActual || "",
        fechaTratamientoActual: formData.tratamientoActual ? fechaActual : "",

        // === CAMPOS ADICIONALES QUE EL BACKEND ESPERA ===
        // Social
        acompanado: "",
        conQuienVive: "",
        concurreALaConsulta: "",
        conyuge: "",
        hermanos: "",
        hijos: "",
        otros: "",
        // Mental
        calculo1: "",
        calculo2: "",
        calculo3: "",
        cierreOjosYHagalo: "",
        concurreALaConsultaMental: "",
        fraseEscrita: "",
        hijosMental: "",
        logradoCopieDibujo: "",
        logradoDoblePapel: "",
        orientacionEnT: "",
        palabra1: "",
        palabra1Memoria: "",
        palabra2: "",
        palabra2Memoria: "",
        palabra3: "",
        palabra3Memoria: "",
        respuesta1: "",
        respuesta2: "",
        respuestaRepita: "",
        textoLeido: "",
        // Funcional
        articulaciones: "",
        caidas: "",
        camina: "",
        equilibrio: "",
        levantateYAnda: "",
        pasaMuchoTiempoSentado: "",
        // Familia
        calidadDe: "",
        // Evolución
        Evolucion: "",
        UltFechaModifEvolucion: "",
        enfermedadActual: "",
        enfermedadBase: "",
        fechaEnfermedadBase: "",
        informeInterconsulta: "",
        tratamientoBase: "",
        fechaAnteriorModifAntecedentesPatologicos: "",
        fechaAnteriorModifEnfermedadActual: "",
        fechaTratamientoBase: "",
      };

      const res = await fetch("/api/pacientes/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Error al crear paciente");
      }

      onCreateSuccess(result.id);
      onClose();
    } catch (err) {
      console.error("Error creando paciente:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith("image/")) {
      setError("Por favor seleccione una imagen válida (jpg, png, gif, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    if (!formData.nombreCompleto?.trim()) {
      setError(
        "Ingrese primero el nombre completo del paciente para subir la foto.",
      );
      return;
    }

    setUploadingPhoto(true);
    setError("");

    try {
      const preview = URL.createObjectURL(file);

      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(preview);

      const tempId = formData.nombreCompleto
        .trim()
        .split(/\s+/)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join("_");

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("tipo", "perfil");
      formDataUpload.append("descripcion", "Foto de perfil al crear paciente");

      const response = await fetch(`/api/pacientes/${tempId}/fotos`, {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al subir la imagen");
      }

      setFormData((prev) => ({
        ...prev,
        urlFoto: result.url,
      }));
    } catch (err) {
      console.error("Error subiendo foto:", err);
      setError(err.message);

      setPreviewUrl(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setFormData((prev) => ({
      ...prev,
      urlFoto: "",
    }));
    setPreviewUrl(null);
  };

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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
                    {previewUrl || formData.urlFoto ? (
                      <>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Image
                            src={previewUrl || formData.urlFoto}
                            alt="Foto del paciente"
                            fill
                            style={{
                              objectFit: "cover",
                            }}
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
                          }}
                        >
                          <Delete fontSize="small" color="error" />
                        </Button>
                      </>
                    ) : (
                      <Photo color="disabled" sx={{ fontSize: 48 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUpload />}
                      disabled={uploadingPhoto}
                      sx={{ mb: 1 }}
                    >
                      {uploadingPhoto ? "Subiendo..." : "Seleccionar Foto"}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
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
            </Box>
          </Box>
        )}

        {/* TAB 1: ANTECEDENTES */}
        {tabIndex === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Antecedentes
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, display: "block" }}
            >
              Complete solo los campos relevantes. Información parcial
              permitida.
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
                rows={3}
                fullWidth
              />
              <TextField
                label="Digestivo"
                name="antecedentesDigestivo"
                value={formData.antecedentesDigestivo || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Metabólico"
                name="antecedentesMetabolico"
                value={formData.antecedentesMetabolico || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Neurológico"
                name="antecedentesNeurologico"
                value={formData.antecedentesNeurologico || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Urológico"
                name="antecedentesUrologico"
                value={formData.antecedentesUrologico || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Psiquiátrico"
                name="antecedentesPsiquiatrico"
                value={formData.antecedentesPsiquiatrico || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Otros"
                name="antecedentesOtros"
                value={formData.antecedentesOtros || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
          </Box>
        )}

        {/* TAB 2: EXAMEN FÍSICO */}
        {tabIndex === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Examen Físico
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, display: "block" }}
            >
              Complete solo los campos relevantes. Información parcial
              permitida.
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
                rows={3}
                fullWidth
              />
              <TextField
                label="AP. Cardiovascular"
                name="examenCardiovascular"
                value={formData.examenCardiovascular || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Respiratorio"
                name="examenRespiratorio"
                value={formData.examenRespiratorio || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Digestivo"
                name="examenDigestivo"
                value={formData.examenDigestivo || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Genitourinario"
                name="examenGenitourinario"
                value={formData.examenGenitourinario || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Neurológico / Psiquis"
                name="examenNeurologico"
                value={formData.examenNeurologico || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Otros"
                name="examenOtros"
                value={formData.examenOtros || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
          </Box>
        )}

        {/* TAB 3: TRATAMIENTO ACTUAL */}
        {tabIndex === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Tratamiento Actual
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, display: "block" }}
            >
              Descripción libre del tratamiento actual.
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
                rows={10}
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
      </DialogActions>
    </Dialog>
  );
};

export default CrearPacienteModal;
