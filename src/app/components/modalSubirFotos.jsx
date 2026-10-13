"use client";

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { toast } from "sonner";
import { api } from "@/lib/cliente/api";
import { formatearTamano } from "@/lib/cliente/formato";
import { useCambiosSinGuardar } from "@/lib/cliente/formularios";
import { optimizarImagen } from "@/lib/cliente/imagenes";

const TIPOS_FOTO = [
  { value: "adicional", label: "Archivo adicional" },
  { value: "perfil", label: "Foto de perfil" },
];

const MAX_ARCHIVO = 50 * 1024 * 1024;

export default function ModalSubirFotoPaciente({ open, onClose, pacienteId, patientName, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [tipo, setTipo] = useState("adicional");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [preparando, setPreparando] = useState(false); // optimizando la foto elegida
  const [original, setOriginal] = useState(null); // { nombre, tamano } si se optimizó
  const fileInputRef = useRef(null);

  const pedirCierre = useCambiosSinGuardar(Boolean(file) && !loading);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const handleFileChange = async (e) => {
    const elegido = e.target.files?.[0];
    if (!elegido) return;
    setError("");
    setPreparando(true);
    const { archivo: selected, optimizada, tamanoOriginal } = await optimizarImagen(elegido);
    setPreparando(false);
    if (selected.size > MAX_ARCHIVO) {
      setError(`El archivo pesa ${formatearTamano(selected.size)}; el máximo es 50 MB.`);
      return;
    }
    if (tipo === "perfil" && !selected.type.startsWith("image/")) setTipo("adicional");
    setFile(selected);
    setOriginal(optimizada ? { nombre: elegido.name, tamano: tamanoOriginal } : null);
    setPreview(selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null);
  };

  const cerrar = () => {
    setFile(null);
    setOriginal(null);
    setTipo("adicional");
    setDescripcion("");
    setPreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipo", tipo);
    formData.append("descripcion", descripcion.trim());

    try {
      const data = await api.subirFoto(pacienteId, formData);
      toast.success(tipo === "perfil" ? "Foto de perfil actualizada" : "Archivo subido");
      onUploadSuccess?.(data.metadata);
      cerrar();
    } catch (e) {
      setError(e.message || "No se pudo subir el archivo. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const esImagen = file?.type.startsWith("image/");

  return (
    <Dialog open={open} onClose={loading ? undefined : () => pedirCierre(cerrar)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ overflowWrap: "anywhere" }}>Subir archivo · {patientName}</DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            {error}
          </Alert>
        )}

        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<UploadFileIcon />}
          disabled={loading || preparando}
          sx={{ py: 2.5, borderStyle: "dashed", mb: 0.5, overflowWrap: "anywhere" }}
        >
          {preparando ? "Preparando la foto…" : file ? (original?.nombre ?? file.name) : "Elegir foto, video o PDF"}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,video/mp4,application/pdf"
          />
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          {!file
            ? "JPG, PNG, WebP, MP4 o PDF · hasta 50 MB"
            : original
              ? `Optimizada para subir: ${formatearTamano(original.tamano)} → ${formatearTamano(file.size)}`
              : `${formatearTamano(file.size)} · ${file.type || "tipo desconocido"}`}
        </Typography>

        {preview && (
          <Box sx={{ mb: 2, borderRadius: 1, overflow: "hidden", bgcolor: "background.default", textAlign: "center" }}>
            <Box
              component="img"
              src={preview}
              alt="Vista previa del archivo elegido"
              sx={{ maxWidth: "100%", maxHeight: 220, objectFit: "contain", display: "block", mx: "auto" }}
            />
          </Box>
        )}

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <TextField
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            disabled={loading}
          >
            {TIPOS_FOTO.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} disabled={opt.value === "perfil" && file && !esImagen}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
        </Box>

        {tipo === "perfil" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Va a reemplazar la foto de perfil actual. La anterior queda guardada en la galería.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={() => pedirCierre(cerrar)} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!file || loading || preparando}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? "Subiendo…" : "Subir archivo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
