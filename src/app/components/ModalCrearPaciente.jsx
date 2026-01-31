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
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";

const CrearPacienteModal = ({ open, onClose, onCreateSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
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

        // Interconsulta — fechas automáticas al crear
        antecedentesPatologicos: formData.antecedentesPatologicos || "",
        fechaUltModifAntecedentesPatologicos: today,
        fechaAnterioModifAntecedentesPatologicos: "",
        enfermedadActual: formData.enfermedadActual || "",
        fechaUltModifEnfermedadActual: today,
        fechaAnterioModifEnfermedadActual: "",
        informeInterconsulta: formData.informeInterconsulta || "",

        // Historia clínica
        tratamientoBase: formData.tratamientoBase || "",
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
          maxWidth: "1100px",
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
          <TextField
            label="URL Foto"
            name="urlFoto"
            value={formData.urlFoto || ""}
            onChange={handleChange}
            fullWidth
          />
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

        <Divider sx={{ my: 2 }} />

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

        <Divider sx={{ my: 2 }} />

        {/* ===== MENTAL ===== */}
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
            label="Cierre ojos y hágalo"
            name="cierreOjosYHagalo"
            value={formData.cierreOjosYHagalo || ""}
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
            label="Frase escrita"
            name="fraseEscrita"
            value={formData.fraseEscrita || ""}
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
            label="Logró copiar dibujo"
            name="logradoCopieDibujo"
            value={formData.logradoCopieDibujo || ""}
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
            label="Orientación en T"
            name="orientacionEnT"
            value={formData.orientacionEnT || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Palabra 1"
            name="palabra1"
            value={formData.palabra1 || ""}
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
            label="Palabra 2"
            name="palabra2"
            value={formData.palabra2 || ""}
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
            label="Palabra 3"
            name="palabra3"
            value={formData.palabra3 || ""}
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
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ===== FUNCIONAL ===== */}
        <Typography variant="h6" gutterBottom>
          Estado Funcional
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
            label="Articulaciones"
            name="articulaciones"
            value={formData.articulaciones || ""}
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
            label="Equilibrio"
            name="equilibrio"
            value={formData.equilibrio || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Levántese y ande"
            name="levantateYAnda"
            value={formData.levantateYAnda || ""}
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
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ===== INTERCONSULTA ===== */}
        <Typography variant="h6" gutterBottom>
          Interconsulta
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
            label="Antecedentes Patológicos"
            name="antecedentesPatologicos"
            value={formData.antecedentesPatologicos || ""}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
          />
          <TextField
            label="Enfermedad Actual"
            name="enfermedadActual"
            value={formData.enfermedadActual || ""}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
          />
          <TextField
            label="Informe Interconsulta"
            name="informeInterconsulta"
            value={formData.informeInterconsulta || ""}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
            sx={{ gridColumn: "span 2" }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ===== HISTORIA CLÍNICA ===== */}
        <Typography variant="h6" gutterBottom>
          Historia Clínica
        </Typography>
        <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2, mb: 2 }}
        >
          <TextField
            label="Tratamiento Base"
            name="tratamientoBase"
            value={formData.tratamientoBase || ""}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
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
