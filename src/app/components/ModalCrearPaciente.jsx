import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
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
    }));
    if (error) setError("");
  };

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
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
      </DialogActions>
    </Dialog>
  );
};

export default CrearPacienteModal;