import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";

const TIPOS_FOTO = [
  { value: "perfil", label: "Foto de Perfil" },
  { value: "adicional", label: "Archivos adicionales" },
];

export default function ModalSubirFotoPaciente({
  open,
  onClose,
  pacienteId,
  patientName,
  onUploadSuccess,
}) {
  const [file, setFile] = useState(null);
  const [tipo, setTipo] = useState("adicional");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selected);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire("Atención", "Seleccioná un archivo para subir", "warning");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipo", tipo);
    formData.append("descripcion", descripcion.trim());

    try {
      const res = await axios.post(
        `/api/pacientes/${pacienteId}/fotos`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success) {
        Swal.fire("¡Listo!", "Foto subida correctamente", "success");
        onUploadSuccess?.(res.data.metadata);
        handleClose();
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error.response?.data?.error || "No se pudo subir el archivo",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setTipo("adicional");
    setDescripcion("");
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle> Subir foto/documento - {patientName}</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ py: 2, borderStyle: "dashed" }}
          >
            {file ? `${file.name}` : "Seleccionar archivo"}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*,video/*,application/pdf"
            />
          </Button>
          {file && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 0.5 }}
            >
              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
            </Typography>
          )}
        </Box>

        {preview && (
          <Box
            sx={{
              mb: 2,
              textAlign: "center",
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "#f5f5f5",
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="Vista previa"
              sx={{
                maxWidth: "100%",
                maxHeight: 200,
                objectFit: "contain",
                display: "block",
                mx: "auto",
              }}
            />
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            mb: 2,
            alignItems: "flex-start",
          }}
        >
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel shrink>Tipo de contenido</InputLabel>
            <Select
              value={tipo}
              label="Tipo de contenido"
              onChange={(e) => setTipo(e.target.value)}
              sx={{
                height: 56,
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  py: 1,
                },
              }}
            >
              {TIPOS_FOTO.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            sx={{ flex: 1 }}
          />
        </Box>

        {tipo === "perfil" && (
          <Alert severity="info" sx={{ mb: 1, fontSize: "0.85rem" }}>
            Esta imagen reemplazará la foto de perfil actual del paciente. La
            imagen anterior se conservará en la galería.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!file || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Subiendo..." : "Subir archivo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
