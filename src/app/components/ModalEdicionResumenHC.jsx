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

const ModalEdicionResumenHc = ({ open, onClose, datos, pacienteId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const initialValues = {
        paciente: { ...datos.paciente },
        enfermedadBase: { ...datos.enfermedadBase },
        enfermedadActual: { ...datos.enfermedadActual },
        tratamientoBase: { ...datos.tratamientoBase },
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

      const res = await fetch(`/api/pacientes/editar/resumenHC?id=${pacienteId}`, {
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

  const sections = ["paciente", "enfermedadBase", "enfermedadActual", "tratamientoBase"];
  const currentSection = sections[tabIndex];
  const currentData = formValues[currentSection] || {};

  const getValue = (field) => {
    const value = currentData[field];
    if (value === null || value === undefined) return "";
    return value;
  };

  const getDateValue = (field) => {
    const value = currentData[field];
    if (!value) return null;
    return new Date(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Editar Resumen de Historia Clínica</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable">
              <Tab label="Paciente" />
              <Tab label="Enfermedad de Base" />
              <Tab label="Enfermedad Actual" />
              <Tab label="Tratamiento de Base" />
            </Tabs>
          </Box>

          {currentSection === "paciente" && (
            <Box>
              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1, minWidth: 180 }}>
                  <DatePicker
                    label="Fecha"
                    value={getDateValue("fecha")}
                    onChange={(newValue) => handleChange("paciente", "fecha", newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        placeholder="Fecha actual"
                      />
                    )}
                  />
                </Box>
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Nombre Completo"
                  value={getValue("nombreCompleto")}
                  onChange={(e) => handleChange("paciente", "nombreCompleto", e.target.value)}
                  variant="outlined"
                  placeholder="Nombre actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Obra Social"
                  value={getValue("os")}
                  onChange={(e) => handleChange("paciente", "os", e.target.value)}
                  variant="outlined"
                  placeholder="Obra social actual"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <TextField
                  sx={{ flex: 1, minWidth: 120 }}
                  label="DNI"
                  value={getValue("dni")}
                  onChange={(e) => handleChange("paciente", "dni", e.target.value)}
                  variant="outlined"
                  placeholder="DNI actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 100 }}
                  label="Edad"
                  type="number"
                  value={getValue("edad")}
                  onChange={(e) => handleChange("paciente", "edad", e.target.value)}
                  variant="outlined"
                  placeholder="Edad actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="AF N°"
                  value={getValue("afNumero")}
                  onChange={(e) => handleChange("paciente", "afNumero", e.target.value)}
                  variant="outlined"
                  placeholder="Número de afiliado actual"
                />
              </Box>
            </Box>
          )}

          {currentSection === "enfermedadBase" && (
            <Box>
              <TextField
                fullWidth
                label="Enfermedad de Base"
                multiline
                rows={4}
                value={getValue("enfermedadBase")}
                onChange={(e) => handleChange("enfermedadBase", "enfermedadBase", e.target.value)}
                variant="outlined"
                placeholder="Valor actual"
                sx={{ mb: 2 }}
              />
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <DatePicker
                  label="Fecha"
                  value={getDateValue("fechaEnfermedadBase")}
                  onChange={(newValue) => handleChange("enfermedadBase", "fechaEnfermedadBase", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder="Fecha actual"
                    />
                  )}
                />
              </Box>
            </Box>
          )}

          {currentSection === "enfermedadActual" && (
            <Box>
              <TextField
                fullWidth
                label="Enfermedad Actual"
                multiline
                rows={4}
                value={getValue("enfermedadActual")}
                onChange={(e) => handleChange("enfermedadActual", "enfermedadActual", e.target.value)}
                variant="outlined"
                placeholder="Valor actual"
                sx={{ mb: 2 }}
              />
              <Box sx={{ flex: 1, minWidth: 250 }}>
                <DatePicker
                  label="Fecha Última Modificación"
                  value={getDateValue("fechaUltModifEnfermedadActual")}
                  onChange={(newValue) => handleChange("enfermedadActual", "fechaUltModifEnfermedadActual", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder="Fecha actual"
                    />
                  )}
                />
              </Box>
            </Box>
          )}

          {currentSection === "tratamientoBase" && (
            <Box>
              <TextField
                fullWidth
                label="Tratamiento de Base"
                multiline
                rows={4}
                value={getValue("tratamientoBase")}
                onChange={(e) => handleChange("tratamientoBase", "tratamientoBase", e.target.value)}
                variant="outlined"
                placeholder="Valor actual"
                sx={{ mb: 2 }}
              />
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <DatePicker
                  label="Fecha"
                  value={getDateValue("fechaTratamientoBase")}
                  onChange={(newValue) => handleChange("tratamientoBase", "fechaTratamientoBase", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder="Fecha actual"
                    />
                  )}
                />
              </Box>
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

export default ModalEdicionResumenHc;
