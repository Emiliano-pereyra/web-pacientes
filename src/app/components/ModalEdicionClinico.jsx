"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Swal from "sweetalert2";

const ModalEdicionClinico = ({ open, onClose, datos, pacienteId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const initialValues = {
        antecedentes: { ...datos.antecedentes },
        examenFisico: { ...datos.examenFisico },
        tratamientoActual: { ...datos.tratamientoActual },
        evolucion: { ...datos.evolucion },
      };
      setFormValues(initialValues);
    }
  }, [open, datos]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleChange = (section, field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const flattened = {};
      Object.keys(formValues).forEach((section) => {
        const sectionData = formValues[section];
        if (sectionData && typeof sectionData === "object") {
          Object.keys(sectionData).forEach((field) => {
            flattened[field] = sectionData[field];
          });
        }
      });

      const res = await fetch(`/api/pacientes/editar?id=${pacienteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flattened),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error al guardar");

      Swal.fire("¡Éxito!", "Datos guardados correctamente", "success");
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const sections = ["antecedentes", "examenFisico", "tratamientoActual", "evolucion"];
  const currentSection = sections[tabIndex];
  const currentData = formValues[currentSection] || {};

  const getValue = (field) => {
    const value = currentData[field];
    if (value === null || value === undefined) return "";
    return value;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Editar Datos Clínicos Psicosociales</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable">
              <Tab label="Antecedentes" />
              <Tab label="Examen Físico" />
              <Tab label="Tratamiento Actual" />
              <Tab label="Evolución" />
            </Tabs>
          </Box>

          {currentSection === "antecedentes" && (
            <Box>
              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="TA (Vasculares)"
                  value={getValue("TA")}
                  onChange={(e) => handleChange("antecedentes", "TA", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Cardio (Vasculares)"
                  value={getValue("Cardio")}
                  onChange={(e) => handleChange("antecedentes", "Cardio", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Digestivos"
                  multiline
                  rows={2}
                  value={getValue("Digestivos")}
                  onChange={(e) => handleChange("antecedentes", "Digestivos", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Constipación"
                  value={getValue("Constipacion")}
                  onChange={(e) => handleChange("antecedentes", "Constipacion", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Metabólicas"
                  multiline
                  rows={2}
                  value={getValue("Metabolicas")}
                  onChange={(e) => handleChange("antecedentes", "Metabolicas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Auditivas"
                  value={getValue("Auditivas")}
                  onChange={(e) => handleChange("antecedentes", "Auditivas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Olfativas"
                  value={getValue("Olfativas")}
                  onChange={(e) => handleChange("antecedentes", "Olfativas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Visuales"
                  value={getValue("Visuales")}
                  onChange={(e) => handleChange("antecedentes", "Visuales", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Gustativas"
                  value={getValue("Gustativas")}
                  onChange={(e) => handleChange("antecedentes", "Gustativas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Ginecológicas"
                  multiline
                  rows={2}
                  value={getValue("Ginecologicas")}
                  onChange={(e) => handleChange("antecedentes", "Ginecologicas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Edemas (V PERIF)"
                  value={getValue("Edemas")}
                  onChange={(e) => handleChange("antecedentes", "Edemas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Várices (V PERIF)"
                  value={getValue("Varices")}
                  onChange={(e) => handleChange("antecedentes", "Varices", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Úlceras (V PERIF)"
                  value={getValue("Ulceras")}
                  onChange={(e) => handleChange("antecedentes", "Ulceras", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Tiroides (DBT)"
                  value={getValue("Tiroides")}
                  onChange={(e) => handleChange("antecedentes", "Tiroides", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Parálisis (SNC)"
                  value={getValue("Paralisis")}
                  onChange={(e) => handleChange("antecedentes", "Paralisis", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Parestesias (SNC)"
                  value={getValue("Parestesias")}
                  onChange={(e) => handleChange("antecedentes", "Parestesias", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Temblores (SNC)"
                  value={getValue("Temblores")}
                  onChange={(e) => handleChange("antecedentes", "Temblores", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Convulsiones (SNC)"
                  value={getValue("Convulsiones")}
                  onChange={(e) => handleChange("antecedentes", "Convulsiones", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Afasias (SNC)"
                  value={getValue("Afasias")}
                  onChange={(e) => handleChange("antecedentes", "Afasias", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Disartria (SNC)"
                  value={getValue("Disartria")}
                  onChange={(e) => handleChange("antecedentes", "Disartria", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Urológicas"
                  multiline
                  rows={2}
                  value={getValue("Urologicas")}
                  onChange={(e) => handleChange("antecedentes", "Urologicas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Dermatológicas"
                  multiline
                  rows={2}
                  value={getValue("Dermatologicas")}
                  onChange={(e) => handleChange("antecedentes", "Dermatologicas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Activa (Psíquica)"
                  value={getValue("PsiquicaActiva")}
                  onChange={(e) => handleChange("antecedentes", "PsiquicaActiva", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Pasiva (Psíquica)"
                  value={getValue("PsiquicaPasiva")}
                  onChange={(e) => handleChange("antecedentes", "PsiquicaPasiva", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>
            </Box>
          )}

          {currentSection === "examenFisico" && (
            <Box>
              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Ojos (Fasciales)"
                  value={getValue("FacialOjos")}
                  onChange={(e) => handleChange("examenFisico", "FacialOjos", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Boca (Fasciales)"
                  value={getValue("FacialBoca")}
                  onChange={(e) => handleChange("examenFisico", "FacialBoca", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Dentición (Fasciales)"
                  value={getValue("FacialDenticion")}
                  onChange={(e) => handleChange("examenFisico", "FacialDenticion", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="R1 y R2 (Ap Cardiovascular)"
                  value={getValue("CardioR1R2")}
                  onChange={(e) => handleChange("examenFisico", "CardioR1R2", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="PPBL (Ap Genitourinario)"
                  value={getValue("PPBL")}
                  onChange={(e) => handleChange("examenFisico", "PPBL", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Control Esfínter (Ap Genitourinario)"
                  value={getValue("GenitourinarioEsfinter")}
                  onChange={(e) => handleChange("examenFisico", "GenitourinarioEsfinter", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Otros (Ap Genitourinario)"
                  value={getValue("GenitourinarioOtros")}
                  onChange={(e) => handleChange("examenFisico", "GenitourinarioOtros", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Atención (Tr. Mentales)"
                  value={getValue("TrAtencion")}
                  onChange={(e) => handleChange("examenFisico", "TrAtencion", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Orientación (Tr. Mentales)"
                  value={getValue("TrOrientacion")}
                  onChange={(e) => handleChange("examenFisico", "TrOrientacion", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Memoria (Tr. Mentales)"
                  value={getValue("TrMemoria")}
                  onChange={(e) => handleChange("examenFisico", "TrMemoria", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Signos Depresivos (Tr. Mentales)"
                  value={getValue("SignoDepre")}
                  onChange={(e) => handleChange("examenFisico", "SignoDepre", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Tr. del Sueño (Tr. Mentales)"
                  value={getValue("TrSueno")}
                  onChange={(e) => handleChange("examenFisico", "TrSueno", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Adenopatías (Cuello)"
                  value={getValue("Adenopatias")}
                  onChange={(e) => handleChange("examenFisico", "Adenopatias", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Bocio (Cuello)"
                  value={getValue("Bocio")}
                  onChange={(e) => handleChange("examenFisico", "Bocio", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="TA (Signos Falla Cardíaca)"
                  value={getValue("CardiacaTA")}
                  onChange={(e) => handleChange("examenFisico", "CardiacaTA", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Edemas (Signos Falla Cardíaca)"
                  value={getValue("CardiacaEdemas")}
                  onChange={(e) => handleChange("examenFisico", "CardiacaEdemas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="TEJ CP (Dermatológicos)"
                  value={getValue("TEJCP")}
                  onChange={(e) => handleChange("examenFisico", "TEJCP", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Peso (Dermatológicos)"
                  value={getValue("Peso")}
                  onChange={(e) => handleChange("examenFisico", "Peso", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Percusión (Ap Respiratoria)"
                  value={getValue("Percusion")}
                  onChange={(e) => handleChange("examenFisico", "Percusion", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Auscultación (Ap Respiratoria)"
                  value={getValue("Auscultacion")}
                  onChange={(e) => handleChange("examenFisico", "Auscultacion", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Otros (Ap Respiratoria)"
                  value={getValue("RespiratoriaOtros")}
                  onChange={(e) => handleChange("examenFisico", "RespiratoriaOtros", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Abdomen (Ap Digestivo)"
                  value={getValue("Abdomen")}
                  onChange={(e) => handleChange("examenFisico", "Abdomen", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="A la Palpación (Ap Digestivo)"
                  value={getValue("Palpacion")}
                  onChange={(e) => handleChange("examenFisico", "Palpacion", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Catarsis (Ap Digestivo)"
                  value={getValue("Catarsis")}
                  onChange={(e) => handleChange("examenFisico", "Catarsis", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Control Esfínter (Ap Digestivo)"
                  value={getValue("DigestivoEsfinter")}
                  onChange={(e) => handleChange("examenFisico", "DigestivoEsfinter", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Otros (Ap Digestivo)"
                  value={getValue("DigestivoOtros")}
                  onChange={(e) => handleChange("examenFisico", "DigestivoOtros", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Alteraciones Motoras (SNC)"
                  value={getValue("SNCAltMotoras")}
                  onChange={(e) => handleChange("examenFisico", "SNCAltMotoras", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Sensitivas (SNC)"
                  value={getValue("SNCSensitivas")}
                  onChange={(e) => handleChange("examenFisico", "SNCSensitivas", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Temblores (SNC)"
                  value={getValue("SNCTemblores")}
                  onChange={(e) => handleChange("examenFisico", "SNCTemblores", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Postura (SNC)"
                  value={getValue("SNCPostura")}
                  onChange={(e) => handleChange("examenFisico", "SNCPostura", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Equilibrio (SNC)"
                  value={getValue("SNCEquilibrio")}
                  onChange={(e) => handleChange("examenFisico", "SNCEquilibrio", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Marcha (SNC)"
                  value={getValue("SNCMarcha")}
                  onChange={(e) => handleChange("examenFisico", "SNCMarcha", e.target.value)}
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>
            </Box>
          )}

          {currentSection === "tratamientoActual" && (
            <Box>
              <TextField
                fullWidth
                label="Tratamiento Actual"
                multiline
                rows={4}
                value={getValue("TratamientoActual")}
                onChange={(e) => handleChange("tratamientoActual", "TratamientoActual", e.target.value)}
                variant="outlined"
                placeholder="Valor actual"
              />
            </Box>
          )}

          {currentSection === "evolucion" && (
            <Box>
              <TextField
                fullWidth
                label="Texto de Evolución"
                multiline
                rows={6}
                value={getValue("texto")}
                onChange={(e) => handleChange("evolucion", "texto", e.target.value)}
                variant="outlined"
                placeholder="Valor actual"
              />
            </Box>
          )}
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdicionClinico;