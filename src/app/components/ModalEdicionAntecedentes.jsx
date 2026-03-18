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

const ModalEdicionAntecedentes = ({ open, onClose, datos, pacienteId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && datos) {
      const initialValues = {
        Informacion: { ...datos.Informacion },
        antecedentes: { ...datos.antecedentes },
        examenFisico: { ...datos.examenFisico },
        tratamientoActual: datos.tratamientoActual,
      };
      setFormValues(initialValues);
    }
  }, [open, datos]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleChange = (section, field, value) => {
    if (["antecedentes", "examenFisico"].includes(section)) {
      setFormValues((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  console.log("Datos recibidos en el modal:", datos); 

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const flattened = {};

      if (formValues.Informacion) {
        Object.keys(formValues.Informacion).forEach((field) => {
          flattened[field] = formValues.Informacion[field];
        });
      }

      if (formValues.antecedentes) {
        Object.keys(formValues.antecedentes).forEach((field) => {
          const key = `antecedentes${field.charAt(0).toUpperCase() + field.slice(1)}`;
          flattened[key] = formValues.antecedentes[field];
        });
      }

      if (formValues.examenFisico) {
        Object.keys(formValues.examenFisico).forEach((field) => {
          const key = `examen${field.charAt(0).toUpperCase() + field.slice(1)}`;
          flattened[key] = formValues.examenFisico[field];
        });
      }

      if (formValues.tratamientoActual !== undefined) {
        flattened.tratamientoActual = formValues.tratamientoActual;
      }

      const res = await fetch(
        `/api/pacientes/editar/antecedentes?id=${pacienteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flattened),
        },
      );

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

  const sections = [
    "Informacion",
    "antecedentes",
    "examenFisico",
    "tratamientoActual",
  ];
  const currentSection = sections[tabIndex];

  const getValue = (section, field) => {
    if (section === "tratamientoActual") {
      return formValues.tratamientoActual || "";
    }
    const sectionData = formValues[section] || {};
    const value = sectionData[field];
    if (value === null || value === undefined) return "";
    return value;
  };

  const getDateValue = (field) => {
    const value = formValues.Informacion?.[field];
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
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
              <Tab label="Antecedentes" />
              <Tab label="Examen Físico" />
              <Tab label="Tratamiento Actual" />
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
                  value={getValue("Informacion", "nombreCompleto")}
                  onChange={(e) =>
                    handleChange(
                      "Informacion",
                      "nombreCompleto",
                      e.target.value,
                    )
                  }
                  variant="outlined"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="DNI"
                  value={getValue("Informacion", "dni")}
                  onChange={(e) =>
                    handleChange("Informacion", "dni", e.target.value)
                  }
                  variant="outlined"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Obra Social"
                  value={getValue("Informacion", "obraSocial")}
                  onChange={(e) =>
                    handleChange("Informacion", "obraSocial", e.target.value)
                  }
                  variant="outlined"
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
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        placeholder: "Fecha de nacimiento",
                      },
                    }}
                  />
                </Box>
                <TextField
                  sx={{ flex: 1, minWidth: 120 }}
                  label="Edad"
                  type="number"
                  value={getValue("Informacion", "edad")}
                  onChange={(e) =>
                    handleChange("Informacion", "edad", e.target.value)
                  }
                  variant="outlined"
                />
                <TextField
                  sx={{ flex: 1, minWidth: 180 }}
                  label="Número de afiliado"
                  value={getValue("Informacion", "afiliadoNumero")}
                  onChange={(e) =>
                    handleChange(
                      "Informacion",
                      "afiliadoNumero",
                      e.target.value,
                    )
                  }
                  variant="outlined"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <DatePicker
                  label="Fecha de Ingreso"
                  value={getDateValue("fechaIngreso")}
                  onChange={(newValue) =>
                    handleChange("Informacion", "fechaIngreso", newValue)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      placeholder: "Fecha de ingreso",
                    },
                  }}
                />
              </Box>
            </Box>
          )}

          {currentSection === "antecedentes" && (
            <Box>
              <GridContainer>
                <GridItem>
                  <TextField
                    label="Cardiovascular"
                    value={getValue("antecedentes", "cardiovascular")}
                    onChange={(e) =>
                      handleChange(
                        "antecedentes",
                        "cardiovascular",
                        e.target.value,
                      )
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Digestivo"
                    value={getValue("antecedentes", "digestivo")}
                    onChange={(e) =>
                      handleChange("antecedentes", "digestivo", e.target.value)
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Metabólico"
                    value={getValue("antecedentes", "metabolico")}
                    onChange={(e) =>
                      handleChange("antecedentes", "metabolico", e.target.value)
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Neurológico"
                    value={getValue("antecedentes", "neurologico")}
                    onChange={(e) =>
                      handleChange(
                        "antecedentes",
                        "neurologico",
                        e.target.value,
                      )
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Urológico"
                    value={getValue("antecedentes", "urologico")}
                    onChange={(e) =>
                      handleChange("antecedentes", "urologico", e.target.value)
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Psiquiátrico"
                    value={getValue("antecedentes", "psiquiatrico")}
                    onChange={(e) =>
                      handleChange(
                        "antecedentes",
                        "psiquiatrico",
                        e.target.value,
                      )
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItemFull>
                  <TextField
                    label="Otros"
                    value={getValue("antecedentes", "otros")}
                    onChange={(e) =>
                      handleChange("antecedentes", "otros", e.target.value)
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItemFull>
              </GridContainer>
            </Box>
          )}

          {currentSection === "examenFisico" && (
            <Box>
              <GridContainer>
                <GridItem>
                  <TextField
                    label="Orientación"
                    value={getValue("examenFisico", "orientacion")}
                    onChange={(e) =>
                      handleChange(
                        "examenFisico",
                        "orientacion",
                        e.target.value,
                      )
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="AP. Cardiovascular"
                    value={getValue("examenFisico", "cardiovascular")}
                    onChange={(e) =>
                      handleChange(
                        "examenFisico",
                        "cardiovascular",
                        e.target.value,
                      )
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Respiratorio"
                    value={getValue("examenFisico", "respiratorio")}
                    onChange={(e) =>
                      handleChange(
                        "examenFisico",
                        "respiratorio",
                        e.target.value,
                      )
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Digestivo"
                    value={getValue("examenFisico", "digestivo")}
                    onChange={(e) =>
                      handleChange("examenFisico", "digestivo", e.target.value)
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Genitourinario"
                    value={getValue("examenFisico", "genitourinario")}
                    onChange={(e) =>
                      handleChange(
                        "examenFisico",
                        "genitourinario",
                        e.target.value,
                      )
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItem>
                  <TextField
                    label="Neurológico / Psiquis"
                    value={getValue("examenFisico", "neurologico")}
                    onChange={(e) =>
                      handleChange(
                        "examenFisico",
                        "neurologico",
                        e.target.value,
                      )
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItem>
                <GridItemFull>
                  <TextField
                    label="Otros"
                    value={getValue("examenFisico", "otros")}
                    onChange={(e) =>
                      handleChange("examenFisico", "otros", e.target.value)
                    }
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                </GridItemFull>
              </GridContainer>
            </Box>
          )}

          {currentSection === "tratamientoActual" && (
            <Box>
              <TextField
                label="Descripción del Tratamiento Actual"
                value={formValues.tratamientoActual || ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    tratamientoActual: e.target.value,
                  }))
                }
                multiline
                rows={10}
                fullWidth
                variant="outlined"
                placeholder="Detalle medicamentos, dosis, frecuencia y observaciones..."
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

const GridContainer = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 2,
      mb: 2,
    }}
  >
    {children}
  </Box>
);

const GridItem = ({ children }) => <Box>{children}</Box>;
const GridItemFull = ({ children }) => (
  <Box sx={{ gridColumn: "span 2" }}>{children}</Box>
);

export default ModalEdicionAntecedentes;
