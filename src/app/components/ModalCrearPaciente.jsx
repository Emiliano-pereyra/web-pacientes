import React, { useState } from "react";
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
  MenuItem,
  Typography,
  Divider,
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
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!formData.nombreCompleto?.trim()) {
        throw new Error("El nombre completo es obligatorio.");
      }

      const today = getCurrentDate();

      const payload = {
        // Info paciente
        nombreCompleto: formData.nombreCompleto || "",
        dni: formData.dni || "",
        edad: formData.edad || "",
        genero: formData.genero || "",
        obraSocial: formData.obraSocial || "",
        afialiadoNumero: formData.afialiadoNumero || "",
        urlFoto: formData.urlFoto || "",
        fechaNacimiento: formData.fechaNacimiento || "",
        fechaIngreso: formData.fechaIngreso || today,

        // Social
        acompanado: formData.acompanado || "",
        conQuienVive: formData.conQuienVive || "",
        concurreALaConsulta: formData.concurreALaConsulta || "",
        conyuge: formData.conyuge || "",
        hermanos: formData.hermanos || "",
        hijos: formData.hijos || "",
        otros: formData.otros || "",

        // Mental
        calculo1: formData.calculo1 || "",
        calculo2: formData.calculo2 || "",
        calculo3: formData.calculo3 || "",
        cierreOjosYHagalo: formData.cierreOjosYHagalo || "",
        concurreALaConsultaMental: formData.concurreALaConsultaMental || "",
        fraseEscrita: formData.fraseEscrita || "",
        hijosMental: formData.hijosMental || "",
        logradoCopieDibujo: formData.logradoCopieDibujo || "",
        logradoDoblePapel: formData.logradoDoblePapel || "",
        orientacionEnT: formData.orientacionEnT || "",
        palabra1: formData.palabra1 || "",
        palabra1Memoria: formData.palabra1Memoria || "",
        palabra2: formData.palabra2 || "",
        palabra2Memoria: formData.palabra2Memoria || "",
        palabra3: formData.palabra3 || "",
        palabra3Memoria: formData.palabra3Memoria || "",
        respuesta1: formData.respuesta1 || "",
        respuesta2: formData.respuesta2 || "",
        respuestaRepita: formData.respuestaRepita || "",
        textoLeido: formData.textoLeido || "",

        // Funcional
        articulaciones: formData.articulaciones || "",
        caidas: formData.caidas || "",
        camina: formData.camina || "",
        equilibrio: formData.equilibrio || "",
        levantateYAnda: formData.levantateYAnda || "",
        pasaMuchoTiempoSentado: formData.pasaMuchoTiempoSentado || "",

        // Flia y Apoderados
        calidadDe: formData.calidadDe || "",

        // Interconsulta - fechas automáticas al crear
        antecedentesPatologicos: formData.antecedentesPatologicos || "",
        fechaUltModifAntecedentesPatologicos: today,
        fechaAnterioModifAntecedentesPatologicos: "",
        enfermedadActual: formData.enfermedadActual || "",
        fechaUltModifEnfermedadActual: today,
        fechaAnterioModifEnfermedadActual: "",
        informeInterconsulta: formData.informeInterconsulta || "",
        enfermedadBase: formData.enfermedadBase || "",
        fechaEnfermedadBase: formData.fechaEnfermedadBase || "",

        // Historia clínica
        tratamientoBase: formData.tratamientoBase || "",
        fechaTratamientoBase: formData.fechaTratamientoBase || "",
        tratamientoActual: formData.tratamientoActual || "",
        fechaTratamientoActual: formData.fechaTratamientoActual || "",

        // Clínico
        TA: formData.TA || "",
        Cardio: formData.Cardio || "",
        Digestivos: formData.Digestivos || "",
        Constipacion: formData.Constipacion || "",
        Metabolicas: formData.Metabolicas || "",
        Auditivas: formData.Auditivas || "",
        Olfativas: formData.Olfativas || "",
        Visuales: formData.Visuales || "",
        Gustativas: formData.Gustativas || "",
        Ginecologicas: formData.Ginecologicas || "",
        Edemas: formData.Edemas || "",
        Varices: formData.Varices || "",
        Ulceras: formData.Ulceras || "",
        Tiroides: formData.Tiroides || "",
        Paralisis: formData.Paralisis || "",
        Parestesias: formData.Parestesias || "",
        Temblores: formData.Temblores || "",
        Convulsiones: formData.Convulsiones || "",
        Afasias: formData.Afasias || "",
        Disartria: formData.Disartria || "",
        Urologicas: formData.Urologicas || "",
        Dermatologicas: formData.Dermatologicas || "",
        PsiquicaActiva: formData.PsiquicaActiva || "",
        PsiquicaPasiva: formData.PsiquicaPasiva || "",

        // Examen físico
        FacialOjos: formData.FacialOjos || "",
        FacialBoca: formData.FacialBoca || "",
        FacialDenticion: formData.FacialDenticion || "",
        CardioR1R2: formData.CardioR1R2 || "",
        PPBL: formData.PPBL || "",
        GenitourinarioEsfinter: formData.GenitourinarioEsfinter || "",
        GenitourinarioOtros: formData.GenitourinarioOtros || "",
        TrAtencion: formData.TrAtencion || "",
        TrOrientacion: formData.TrOrientacion || "",
        TrMemoria: formData.TrMemoria || "",
        TrSignoDepre: formData.TrSignoDepre || "",
        TrSueno: formData.TrSueno || "",
        Adenopatias: formData.Adenopatias || "",
        Bocio: formData.Bocio || "",
        CardiacaTA: formData.CardiacaTA || "",
        CardiacaEdemas: formData.CardiacaEdemas || "",
        TEJCP: formData.TEJCP || "",
        Peso: formData.Peso || "",
        Percusion: formData.Percusion || "",
        Auscultacion: formData.Auscultacion || "",
        RespiratoriaOtros: formData.RespiratoriaOtros || "",
        Abdomen: formData.Abdomen || "",
        Palpacion: formData.Palpacion || "",
        Catarsis: formData.Catarsis || "",
        DigestivoEsfinter: formData.DigestivoEsfinter || "",
        DigestivoOtros: formData.DigestivoOtros || "",
        SNCAltMotoras: formData.SNCAltMotoras || "",
        SNCSensitivas: formData.SNCSensitivas || "",
        SNCTemblores: formData.SNCTemblores || "",
        SNCPostura: formData.SNCPostura || "",
        SNCEquilibrio: formData.SNCEquilibrio || "",
        SNCMarcha: formData.SNCMarcha || "",

        // Evolución
        Evolucion: formData.Evolucion || "",
        UltFechaModifEvolucion: formData.UltFechaModifEvolucion || "",
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

    if (!file.type.startsWith("image/")) {
      setError("Por favor seleccione una imagen válida (jpg, png, gif, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    setUploadingPhoto(true);
    setError("");

    try {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      const tempId = formData.nombreCompleto
        ? formData.nombreCompleto
            .trim()
            .split(/\s+/)
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
            .join("_")
        : `paciente_${Date.now()}`;

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("patientId", tempId);

      const response = await fetch("/api/upload", {
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
    setFormData((prev) => ({
      ...prev,
      urlFoto: "",
    }));
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
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
            <Tab label="Social" />
            <Tab label="Mental" />
            <Tab label="Funcional" />
            <Tab label="Clínico" />
            <Tab label="Examen Físico" />
            <Tab label="Historia Clínica" />
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
                select
                fullWidth
              >
                <MenuItem value="">-</MenuItem>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </TextField>
              <TextField
                label="Obra Social"
                name="obraSocial"
                value={formData.obraSocial || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="N° Afiliado"
                name="afialiadoNumero"
                value={formData.afialiadoNumero || ""}
                onChange={handleChange}
                fullWidth
              />
              <Box sx={{ gridColumn: "span 4" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Foto del Paciente
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {/* Preview de la imagen */}
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
                            unoptimized // Para URLs de Google Drive que no son de un dominio configurado
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

        {/* TAB 1: SOCIAL */}
        {tabIndex === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Información Social
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
                label="¿Acompañado?"
                name="acompanado"
                value={formData.acompanado || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Con quién vive"
                name="conQuienVive"
                value={formData.conQuienVive || ""}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">-</MenuItem>
                <MenuItem value="solo">Solo</MenuItem>
                <MenuItem value="conyuge">Cónyuge</MenuItem>
                <MenuItem value="familia">Familia</MenuItem>
              </TextField>
              <TextField
                label="Concurre a consulta"
                name="concurreALaConsulta"
                value={formData.concurreALaConsulta || ""}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">-</MenuItem>
                <MenuItem value="solo">Solo</MenuItem>
                <MenuItem value="acompañado">Acompañado</MenuItem>
              </TextField>
              <TextField
                label="Cónyuge"
                name="conyuge"
                value={formData.conyuge || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Hermanos"
                name="hermanos"
                value={formData.hermanos || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Hijos"
                name="hijos"
                value={formData.hijos || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Otros"
                name="otros"
                value={formData.otros || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
        )}

        {/* TAB 2: MENTAL */}
        {tabIndex === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Evaluación Mental
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
                label="Orientación en T"
                name="orientacionEnT"
                value={formData.orientacionEnT || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Hijos (mental)"
                name="hijosMental"
                value={formData.hijosMental || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Concurre a consulta (mental)"
                name="concurreALaConsultaMental"
                value={formData.concurreALaConsultaMental || ""}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">-</MenuItem>
                <MenuItem value="solo">Solo</MenuItem>
                <MenuItem value="acompañado">Acompañado</MenuItem>
              </TextField>
              <TextField
                label="Palabra 1"
                name="palabra1"
                value={formData.palabra1 || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Palabra 2"
                name="palabra2"
                value={formData.palabra2 || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Palabra 3"
                name="palabra3"
                value={formData.palabra3 || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Cálculo 1"
                name="calculo1"
                value={formData.calculo1 || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Cálculo 2"
                name="calculo2"
                value={formData.calculo2 || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Cálculo 3"
                name="calculo3"
                value={formData.calculo3 || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Respuesta 1"
                name="respuesta1"
                value={formData.respuesta1 || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Respuesta 2"
                name="respuesta2"
                value={formData.respuesta2 || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Palabra 1 Memoria"
                name="palabra1Memoria"
                value={formData.palabra1Memoria || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Palabra 2 Memoria"
                name="palabra2Memoria"
                value={formData.palabra2Memoria || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Palabra 3 Memoria"
                name="palabra3Memoria"
                value={formData.palabra3Memoria || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Respuesta 'Repita'"
                name="respuestaRepita"
                value={formData.respuestaRepita || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Texto leído"
                name="textoLeido"
                value={formData.textoLeido || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Cierre ojos y hágalo"
                name="cierreOjosYHagalo"
                value={formData.cierreOjosYHagalo || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Logró doblar papel"
                name="logradoDoblePapel"
                value={formData.logradoDoblePapel || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Logró copiar dibujo"
                name="logradoCopieDibujo"
                value={formData.logradoCopieDibujo || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Frase escrita"
                name="fraseEscrita"
                value={formData.fraseEscrita || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
        )}

        {/* TAB 3: FUNCIONAL */}
        {tabIndex === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Estado Funcional
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                label="Camina"
                name="camina"
                value={formData.camina || ""}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">-</MenuItem>
                <MenuItem value="solo">Solo</MenuItem>
                <MenuItem value="con apoyo">Con apoyo</MenuItem>
              </TextField>
              <TextField
                label="Levántese y ande"
                name="levantateYAnda"
                value={formData.levantateYAnda || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Articulaciones"
                name="articulaciones"
                value={formData.articulaciones || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Pasa mucho tiempo sentado"
                name="pasaMuchoTiempoSentado"
                value={formData.pasaMuchoTiempoSentado || ""}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">-</MenuItem>
                <MenuItem value="si">Sí</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              <TextField
                label="Equilibrio"
                name="equilibrio"
                value={formData.equilibrio || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Caídas"
                name="caidas"
                value={formData.caidas || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
        )}

        {/* TAB 4: CLÍNICO */}
        {tabIndex === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Antecedentes Clínicos
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Vasculares
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="TA"
                name="TA"
                value={formData.TA || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Cardio"
                name="Cardio"
                value={formData.Cardio || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Digestivos
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Digestivos"
                name="Digestivos"
                value={formData.Digestivos || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
              />
              <TextField
                label="Constipación"
                name="Constipacion"
                value={formData.Constipacion || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Metabólicas
            </Typography>
            <TextField
              label="Metabólicas"
              name="Metabolicas"
              value={formData.Metabolicas || ""}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" gutterBottom>
              Sensoriales
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Auditivas"
                name="Auditivas"
                value={formData.Auditivas || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Olfativas"
                name="Olfativas"
                value={formData.Olfativas || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Visuales"
                name="Visuales"
                value={formData.Visuales || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Gustativas"
                name="Gustativas"
                value={formData.Gustativas || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Ginecológicas
            </Typography>
            <TextField
              label="Ginecológicas"
              name="Ginecologicas"
              value={formData.Ginecologicas || ""}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" gutterBottom>
              V PERIF
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Edemas"
                name="Edemas"
                value={formData.Edemas || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Várices"
                name="Varices"
                value={formData.Varices || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Úlceras"
                name="Ulceras"
                value={formData.Ulceras || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              DBT
            </Typography>
            <TextField
              label="Tiroides"
              name="Tiroides"
              value={formData.Tiroides || ""}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" gutterBottom>
              SNC
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Parálisis"
                name="Paralisis"
                value={formData.Paralisis || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Parestesias"
                name="Parestesias"
                value={formData.Parestesias || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Temblores"
                name="Temblores"
                value={formData.Temblores || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Convulsiones"
                name="Convulsiones"
                value={formData.Convulsiones || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Afasias"
                name="Afasias"
                value={formData.Afasias || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Disartria"
                name="Disartria"
                value={formData.Disartria || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Urológicas
            </Typography>
            <TextField
              label="Urológicas"
              name="Urologicas"
              value={formData.Urologicas || ""}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" gutterBottom>
              Dermatológicas
            </Typography>
            <TextField
              label="Dermatológicas"
              name="Dermatologicas"
              value={formData.Dermatologicas || ""}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" gutterBottom>
              Actitud Psíquica
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Activa"
                name="PsiquicaActiva"
                value={formData.PsiquicaActiva || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Pasiva"
                name="PsiquicaPasiva"
                value={formData.PsiquicaPasiva || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
        )}

        {/* TAB 5: EXAMEN FÍSICO */}
        {tabIndex === 5 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Examen Físico
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Fasciales
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Ojos"
                name="FacialOjos"
                value={formData.FacialOjos || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Boca"
                name="FacialBoca"
                value={formData.FacialBoca || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Dentición"
                name="FacialDenticion"
                value={formData.FacialDenticion || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Ap. Cardiovascular
            </Typography>
            <TextField
              label="R1 y R2"
              name="CardioR1R2"
              value={formData.CardioR1R2 || ""}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" gutterBottom>
              Ap. Genitourinario
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="PPBL"
                name="PPBL"
                value={formData.PPBL || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Control Esfínter"
                name="GenitourinarioEsfinter"
                value={formData.GenitourinarioEsfinter || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Otros"
                name="GenitourinarioOtros"
                value={formData.GenitourinarioOtros || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Trastornos Mentales
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Atención"
                name="TrAtencion"
                value={formData.TrAtencion || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Orientación"
                name="TrOrientacion"
                value={formData.TrOrientacion || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Memoria"
                name="TrMemoria"
                value={formData.TrMemoria || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Signos Depresivos"
                name="TrSignoDepre"
                value={formData.TrSignoDepre || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Tr. del Sueño"
                name="TrSueno"
                value={formData.TrSueno || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Cuello
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Adenopatías"
                name="Adenopatias"
                value={formData.Adenopatias || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Bocio"
                name="Bocio"
                value={formData.Bocio || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Signos Falla Cardíaca
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="TA"
                name="CardiacaTA"
                value={formData.CardiacaTA || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Edemas"
                name="CardiacaEdemas"
                value={formData.CardiacaEdemas || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Dermatológicos
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="TEJ CP"
                name="TEJCP"
                value={formData.TEJCP || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Peso"
                name="Peso"
                value={formData.Peso || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Ap. Respiratoria
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Percusión"
                name="Percusion"
                value={formData.Percusion || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Auscultación"
                name="Auscultacion"
                value={formData.Auscultacion || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Otros"
                name="RespiratoriaOtros"
                value={formData.RespiratoriaOtros || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Ap. Digestivo
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Abdomen"
                name="Abdomen"
                value={formData.Abdomen || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="A la Palpación"
                name="Palpacion"
                value={formData.Palpacion || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Catarsis"
                name="Catarsis"
                value={formData.Catarsis || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Control Esfínter"
                name="DigestivoEsfinter"
                value={formData.DigestivoEsfinter || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Otros"
                name="DigestivoOtros"
                value={formData.DigestivoOtros || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              SNC
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Alteraciones Motoras"
                name="SNCAltMotoras"
                value={formData.SNCAltMotoras || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Sensitivas"
                name="SNCSensitivas"
                value={formData.SNCSensitivas || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Temblores"
                name="SNCTemblores"
                value={formData.SNCTemblores || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Postura"
                name="SNCPostura"
                value={formData.SNCPostura || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Equilibrio"
                name="SNCEquilibrio"
                value={formData.SNCEquilibrio || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Marcha"
                name="SNCMarcha"
                value={formData.SNCMarcha || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
        )}

        {/* TAB 6: HISTORIA CLÍNICA */}
        {tabIndex === 6 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Historia Clínica
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Enfermedad de Base
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Enfermedad de Base"
                name="enfermedadBase"
                value={formData.enfermedadBase || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
              />
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  label="Fecha"
                  name="fechaEnfermedadBase"
                  type="date"
                  value={formData.fechaEnfermedadBase || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Enfermedad Actual
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Enfermedad Actual"
                name="enfermedadActual"
                value={formData.enfermedadActual || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
              />
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  label="Fecha Última Modificación"
                  name="fechaUltModifEnfermedadActual"
                  type="date"
                  value={formData.fechaUltModifEnfermedadActual || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Tratamiento de Base
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Tratamiento de Base"
                name="tratamientoBase"
                value={formData.tratamientoBase || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
              />
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  label="Fecha"
                  name="fechaTratamientoBase"
                  type="date"
                  value={formData.fechaTratamientoBase || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Tratamiento Actual
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Tratamiento Actual"
                name="tratamientoActual"
                value={formData.tratamientoActual || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
              />
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  label="Fecha"
                  name="fechaTratamientoActual"
                  type="date"
                  value={formData.fechaTratamientoActual || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Antecedentes Patológicos
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Antecedentes Patológicos"
                name="antecedentesPatologicos"
                value={formData.antecedentesPatologicos || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
              />
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  label="Fecha Última Modificación"
                  name="fechaUltModifAntecedentesPatologicos"
                  type="date"
                  value={formData.fechaUltModifAntecedentesPatologicos || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Informe de Interconsulta
            </Typography>
            <TextField
              label="Informe de Interconsulta"
              name="informeInterconsulta"
              value={formData.informeInterconsulta || ""}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Evolución
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Evolución"
                name="Evolucion"
                value={formData.Evolucion || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  label="Última Fecha Modificación"
                  name="UltFechaModifEvolucion"
                  type="date"
                  value={formData.UltFechaModifEvolucion || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
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
