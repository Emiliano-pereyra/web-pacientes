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
import Swal from "sweetalert2";

const ModalEdicionFliaYApod = ({ open, onClose, datos, pacienteId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const initialValues = {
        paciente: { ...datos.paciente },
        informacionAdicional: { ...datos.informacionAdicional },
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

      const res = await fetch(`/api/pacientes/editar/fliaYApod?id=${pacienteId}`, {
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

  const sections = ["paciente", "informacionAdicional"];
  const currentSection = sections[tabIndex];
  const currentData = formValues[currentSection] || {};

  const getValue = (field) => {
    const value = currentData[field];
    if (value === null || value === undefined) return "";
    return value;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Editar Información Familiar y Apoderados</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable">
            <Tab label="Paciente" />
            <Tab label="Información Adicional" />
          </Tabs>
        </Box>

        {currentSection === "paciente" && (
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <TextField
                sx={{ flex: 1, minWidth: 250 }}
                label="Nombre Completo"
                value={getValue("nombreCompleto")}
                onChange={(e) => handleChange("paciente", "nombreCompleto", e.target.value)}
                variant="outlined"
                placeholder="Nombre actual"
              />
              <TextField
                sx={{ flex: 1, minWidth: 150 }}
                label="DNI"
                value={getValue("dni")}
                onChange={(e) => handleChange("paciente", "dni", e.target.value)}
                variant="outlined"
                placeholder="DNI actual"
              />
            </Box>
          </Box>
        )}

        {currentSection === "informacionAdicional" && (
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <TextField
                sx={{ flex: 1, minWidth: 200 }}
                label="Yo (Nombre del apoderado)"
                value={getValue("yo")}
                onChange={(e) => handleChange("informacionAdicional", "yo", e.target.value)}
                variant="outlined"
                placeholder="Nombre actual"
              />
              <TextField
                sx={{ flex: 1, minWidth: 150 }}
                label="DNI Número"
                value={getValue("dniNumero")}
                onChange={(e) => handleChange("informacionAdicional", "dniNumero", e.target.value)}
                variant="outlined"
                placeholder="DNI actual"
              />
              <TextField
                sx={{ flex: 1, minWidth: 180 }}
                label="Calidad (Parentesco)"
                value={getValue("calidad")}
                onChange={(e) => handleChange("informacionAdicional", "calidad", e.target.value)}
                variant="outlined"
                placeholder="Calidad actual"
              />
            </Box>

            <TextField
              fullWidth
              label="Nombre del Residente"
              value={getValue("residenteNombre")}
              onChange={(e) => handleChange("informacionAdicional", "residenteNombre", e.target.value)}
              variant="outlined"
              placeholder="Nombre actual"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Texto de Consentimiento"
              multiline
              rows={4}
              value={getValue("textoConsentimiento")}
              onChange={(e) => handleChange("informacionAdicional", "textoConsentimiento", e.target.value)}
              variant="outlined"
              placeholder="Texto actual"
            />
          </Box>
        )}
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

export default ModalEdicionFliaYApod;
