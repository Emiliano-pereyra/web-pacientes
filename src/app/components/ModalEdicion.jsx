"use client"
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  Grid,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const CampoEditable = ({ config, value, onChange, allValues }) => {
  const {
    type = "text",
    label,
    options = [],
    required = false,
    multiline = false,
    rows = 4,
    ...otherProps
  } = config;

  const handleChange = (newValue) => {
    onChange(newValue);
  };

  switch (type) {
    case "date":
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={label}
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" required={required} {...otherProps} />}
          />
        </LocalizationProvider>
      );
    case "select":
      return (
        <FormControl fullWidth margin="normal" required={required} {...otherProps}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            label={label}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    case "autocomplete":
      return (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
          value={value}
          onChange={(event, newValue) => handleChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              margin="normal"
              required={required}
              {...otherProps}
            />
          )}
        />
      );
    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              onChange={(e) => handleChange(e.target.checked)}
              {...otherProps}
            />
          }
          label={label}
        />
      );
    case "text":
    case "number":
    default:
      return (
        <TextField
          fullWidth
          label={label}
          type={type}
          value={value ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          margin="normal"
          variant="outlined"
          required={required}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          {...otherProps}
        />
      );
  }
};

const ModalEdicion = ({ open, onClose, datos, pacienteId, camposConfig = {} }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formValues, setFormValues] = useState(datos || {});
  const [loading, setLoading] = useState(false);

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
      console.log("Datos a guardar:", formValues);

      const res = await fetch(`/api/pacientes/editar?id=${pacienteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Error al guardar los datos");
      }

      alert("Datos guardados correctamente");
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Usar las claves de la configuración o de los datos si no hay configuración
  const sections = Object.keys(camposConfig || datos || {});

  const currentSection = sections[tabIndex];
  const currentConfig = camposConfig[currentSection] || {};
  const currentData = datos[currentSection] || {};

  const renderFields = () => {
    if (!currentConfig || Object.keys(currentConfig).length === 0) {
      return (
        <Alert severity="info">
          No hay campos configurados para editar en esta sección.
        </Alert>
      );
    }

    const entries = Object.entries(currentConfig);
    const totalFields = entries.length;

    if (totalFields === 0) {
      return (
        <Alert severity="info">
          No hay campos disponibles para editar en esta sección.
        </Alert>
      );
    }
    
    const columns = [];
    for (let i = 0; i < totalFields; i += 8) {
      columns.push(entries.slice(i, i + 8));
    }

    return (
      <Grid container spacing={2}>
        {columns.map((column, colIndex) => (
          <Grid item xs={12} md={6} key={colIndex}>
            {column.map(([key, config]) => (
              <CampoEditable
                key={key}
                config={config}
                value={formValues[currentSection]?.[key] ?? currentData[key] ?? ""}
                onChange={(newValue) => handleChange(currentSection, key, newValue)}
                allValues={formValues[currentSection]}
              />
            ))}
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Contenido</DialogTitle>
      <DialogContent dividers>
        {sections.length > 0 ? (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs value={tabIndex} onChange={handleTabChange}>
                {sections.map((section, index) => (
                  <Tab
                    key={index}
                    label={section.charAt(0).toUpperCase() + section.slice(1)}
                  />
                ))}
              </Tabs>
            </Box>
            <Box>{renderFields()}</Box>
          </>
        ) : (
          <Alert severity="warning">
            No hay datos disponibles para editar.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Guardar cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdicion;
