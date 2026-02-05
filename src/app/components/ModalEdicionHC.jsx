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

const ModalEdicionHistoriaClinica = ({ open, onClose, datos, pacienteId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const initialValues = {
        Informacion: { ...datos.Informacion },
        funcional: { ...datos.funcional },
        social: { ...datos.social },
        mental: { ...datos.mental },
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

  const sections = ["Informacion", "funcional", "social", "mental"];
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
      <DialogTitle>Editar Historia Clínica</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="scrollable"
            >
              <Tab label="Información" />
              <Tab label="Funcional" />
              <Tab label="Social" />
              <Tab label="Mental" />
            </Tabs>
          </Box>

          {currentSection === "Informacion" && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Nombre Completo"
                  value={getValue("nombreCompleto")}
                  onChange={(e) =>
                    handleChange("Informacion", "nombreCompleto", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Nombre completo actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="DNI"
                  value={getValue("dni")}
                  onChange={(e) =>
                    handleChange("Informacion", "dni", e.target.value)
                  }
                  variant="outlined"
                  placeholder="DNI actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Obra Social"
                  value={getValue("obraSocial")}
                  onChange={(e) =>
                    handleChange("Informacion", "obraSocial", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Obra social actual"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={getDateValue("fechaNacimiento")}
                    onChange={(newValue) =>
                      handleChange("Informacion", "fechaNacimiento", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        placeholder="Fecha de nacimiento actual"
                      />
                    )}
                  />
                </Box>
                <TextField
                  sx={{ flex: 1, minWidth: 120 }}
                  label="Edad"
                  type="number"
                  value={getValue("edad")}
                  onChange={(e) =>
                    handleChange("Informacion", "edad", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Edad actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Número de afiliado"
                  value={getValue("afiliadoNumero")}
                  onChange={(e) =>
                    handleChange("Informacion", "afiliadoNumero", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Número de afiliado actual"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <DatePicker
                  label="Fecha de Ingreso"
                  value={getDateValue("fechaIngreso")}
                  onChange={(newValue) =>
                    handleChange("Informacion", "fechaIngreso", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder="Fecha de ingreso actual"
                    />
                  )}
                />
              </Box>
            </Box>
          )}

          {currentSection === "funcional" && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Camina"
                  value={getValue("camina")}
                  onChange={(e) =>
                    handleChange("funcional", "camina", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: camina"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Levántate y anda"
                  value={getValue("levantateYAnda")}
                  onChange={(e) =>
                    handleChange("funcional", "levantateYAnda", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: levántate y anda"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Articulaciones"
                  value={getValue("articulaciones")}
                  onChange={(e) =>
                    handleChange("funcional", "articulaciones", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: articulaciones"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Pasa mucho tiempo sentado"
                  value={getValue("pasaMuchoTiempoSentado")}
                  onChange={(e) =>
                    handleChange(
                      "funcional",
                      "pasaMuchoTiempoSentado",
                      e.target.value,
                    )
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Equilibrio"
                  value={getValue("equilibrio")}
                  onChange={(e) =>
                    handleChange("funcional", "equilibrio", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: equilibrio"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Caídas"
                  value={getValue("caidas")}
                  onChange={(e) =>
                    handleChange("funcional", "caidas", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: caídas"
                />
              </Box>
            </Box>
          )}

          {currentSection === "social" && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Con quién vive"
                  value={getValue("conQuienVive")}
                  onChange={(e) =>
                    handleChange("social", "conQuienVive", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Hijos"
                  value={getValue("hijos")}
                  onChange={(e) =>
                    handleChange("social", "hijos", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: hijos"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Concurre a la consulta"
                  value={getValue("concurreALaConsulta")}
                  onChange={(e) =>
                    handleChange("social", "concurreALaConsulta", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Cónyuge"
                  value={getValue("conyuge")}
                  onChange={(e) =>
                    handleChange("social", "conyuge", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: cónyuge"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Hermanos"
                  value={getValue("hermanos")}
                  onChange={(e) =>
                    handleChange("social", "hermanos", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: hermanos"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Acompañado"
                  value={getValue("acompanado")}
                  onChange={(e) =>
                    handleChange("social", "acompanado", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: acompañado"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Otros"
                  multiline
                  rows={3}
                  value={getValue("otros")}
                  onChange={(e) =>
                    handleChange("social", "otros", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Otros datos actuales"
                />
              </Box>
            </Box>
          )}

          {currentSection === "mental" && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Orientación en T"
                  value={getValue("orientacionEnT")}
                  onChange={(e) =>
                    handleChange("mental", "orientacionEnT", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Hijos (Mental)"
                  value={getValue("hijosMental")}
                  onChange={(e) =>
                    handleChange("mental", "hijosMental", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 220 }}
                  label="Concurre a la consulta (Mental)"
                  value={getValue("concurreALaConsultaMental")}
                  onChange={(e) =>
                    handleChange(
                      "mental",
                      "concurreALaConsultaMental",
                      e.target.value,
                    )
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Palabra 1"
                  value={getValue("palabra1")}
                  onChange={(e) =>
                    handleChange("mental", "palabra1", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: palabra 1"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Palabra 2"
                  value={getValue("palabra2")}
                  onChange={(e) =>
                    handleChange("mental", "palabra2", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: palabra 2"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Palabra 3"
                  value={getValue("palabra3")}
                  onChange={(e) =>
                    handleChange("mental", "palabra3", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual: palabra 3"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Cálculo 1"
                  value={getValue("calculo1")}
                  onChange={(e) =>
                    handleChange("mental", "calculo1", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Cálculo 2"
                  value={getValue("calculo2")}
                  onChange={(e) =>
                    handleChange("mental", "calculo2", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Cálculo 3"
                  value={getValue("calculo3")}
                  onChange={(e) =>
                    handleChange("mental", "calculo3", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Respuesta 1"
                  value={getValue("respuesta1")}
                  onChange={(e) =>
                    handleChange("mental", "respuesta1", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Respuesta 2"
                  value={getValue("respuesta2")}
                  onChange={(e) =>
                    handleChange("mental", "respuesta2", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Palabra 1 Memoria"
                  value={getValue("palabra1Memoria")}
                  onChange={(e) =>
                    handleChange("mental", "palabra1Memoria", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Palabra 2 Memoria"
                  value={getValue("palabra2Memoria")}
                  onChange={(e) =>
                    handleChange("mental", "palabra2Memoria", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Palabra 3 Memoria"
                  value={getValue("palabra3Memoria")}
                  onChange={(e) =>
                    handleChange("mental", "palabra3Memoria", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Respuesta Repita"
                  value={getValue("respuestaRepita")}
                  onChange={(e) =>
                    handleChange("mental", "respuestaRepita", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Texto Leído"
                  value={getValue("textoLeido")}
                  onChange={(e) =>
                    handleChange("mental", "textoLeido", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Cierre ojos y hágalo"
                  value={getValue("cierreOjosYHagalo")}
                  onChange={(e) =>
                    handleChange("mental", "cierreOjosYHagalo", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Logrado Doble Papel"
                  value={getValue("logradoDoblePapel")}
                  onChange={(e) =>
                    handleChange("mental", "logradoDoblePapel", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Logrado Copie Dibujo"
                  value={getValue("logradoCopieDibujo")}
                  onChange={(e) =>
                    handleChange("mental", "logradoCopieDibujo", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Frase Escrita"
                  value={getValue("fraseEscrita")}
                  onChange={(e) =>
                    handleChange("mental", "fraseEscrita", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Valor actual"
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

export default ModalEdicionHistoriaClinica;
