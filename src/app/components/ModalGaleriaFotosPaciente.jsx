"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Checkbox,
  CircularProgress,
  Alert,
  Box,
  Chip,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { toast } from "sonner";
import { api } from "@/lib/cliente/api";
import { formatearFechaHora } from "@/lib/paciente/logica";
import { formatearTamano, plural } from "@/lib/cliente/formato";
import { useConfirmar } from "./ui/Confirmacion";

const TIPOS_LABELS = {
  perfil: "Perfil",
  adicional: "Adicional",
  evolucion: "Evolución",
  tratamiento: "Tratamiento",
  documento: "Documento",
  general: "General",
  otros: "Otros",
};

export default function ModalGaleriaFotosPaciente({ open, onClose, pacienteId, patientName, onDeleted }) {
  const confirmar = useConfirmar();
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const mensajeError = (err) => err?.message || "No se pudo cargar la galería";

  /** Recarga desde una acción del usuario (reintentar, después de borrar). */
  const fetchFotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setFotos((await api.listarFotos(pacienteId)).fotos || []);
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  // Carga inicial (loading arranca en true)
  useEffect(() => {
    if (!open || !pacienteId) return;
    let vigente = true;
    api
      .listarFotos(pacienteId)
      .then((data) => vigente && setFotos(data.fotos || []))
      .catch((err) => vigente && setError(mensajeError(err)))
      .finally(() => vigente && setLoading(false));
    return () => {
      vigente = false;
    };
  }, [open, pacienteId]);

  const toggle = (fotoId) =>
    setSelectedIds((prev) => (prev.includes(fotoId) ? prev.filter((id) => id !== fotoId) : [...prev, fotoId]));

  const todasSeleccionadas = fotos.length > 0 && selectedIds.length === fotos.length;
  const toggleTodas = () => setSelectedIds(todasSeleccionadas ? [] : fotos.map((f) => f.id));

  const eliminarSeleccionadas = async () => {
    const aEliminar = fotos.filter((f) => selectedIds.includes(f.id));
    const nombres = aEliminar.slice(0, 5).map((f) => `• ${f.nombreOriginal || TIPOS_LABELS[f.tipo] || f.tipo}`);
    if (aEliminar.length > 5) nombres.push(`… y ${aEliminar.length - 5} más`);

    const ok = await confirmar({
      titulo: `¿Eliminar ${plural(aEliminar.length, "archivo")}?`,
      mensaje: `${nombres.join("\n")}\n\nEsta acción no se puede deshacer.`,
      confirmar: "Eliminar",
      peligro: true,
    });
    if (!ok) return;

    try {
      setDeleting(true);
      const data = await api.eliminarFotos(pacienteId, selectedIds);
      await fetchFotos();
      setSelectedIds([]);
      if (data.errors?.length) toast.warning(`Se eliminaron ${data.eliminated}; algunos archivos no se pudieron borrar`);
      else toast.success(`${plural(data.eliminated, "archivo")} ${data.eliminated === 1 ? "eliminado" : "eliminados"}`);
      onDeleted?.(data.eliminated);
    } catch (err) {
      toast.error("No se pudieron eliminar los archivos", { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const renderFotoCard = (foto) => {
    const isSelected = selectedIds.includes(foto.id);
    const isImage = foto.mimeType?.startsWith("image/");
    const tipoLabel = TIPOS_LABELS[foto.tipo] || foto.tipo;
    const nombre = foto.nombreOriginal || tipoLabel;

    return (
      <Grid key={foto.id} size={{ xs: 6, sm: 4, md: 3 }}>
        <Card
          variant="outlined"
          sx={{
            position: "relative",
            height: "100%",
            borderWidth: 2,
            borderColor: isSelected ? "primary.main" : "transparent",
            outline: isSelected ? "none" : "1px solid",
            outlineColor: "divider",
            transition: "border-color 150ms ease, box-shadow 150ms ease",
            "@media (hover: hover) and (pointer: fine)": { "&:hover": { boxShadow: 3 } },
          }}
        >
          <Checkbox
            checked={isSelected}
            onChange={() => toggle(foto.id)}
            size="small"
            slotProps={{ input: { "aria-label": `Seleccionar ${nombre}` } }}
            sx={{
              position: "absolute",
              top: 6,
              left: 6,
              zIndex: 2,
              p: 0.5,
              bgcolor: "rgba(255,255,255,0.92)",
              "&:hover": { bgcolor: "#fff" },
            }}
          />

          <CardActionArea
            component="a"
            href={foto.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${nombre} en una pestaña nueva`}
          >
            <Box sx={{ position: "relative", pt: "75%", bgcolor: "background.default" }}>
              {isImage ? (
                <CardMedia
                  component="img"
                  image={foto.url}
                  alt={foto.descripcion || nombre}
                  loading="lazy"
                  width={320}
                  height={240}
                  sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: "text.secondary",
                  }}
                >
                  <InsertDriveFileIcon sx={{ fontSize: 44, mb: 1 }} aria-hidden />
                  <Typography variant="caption">{foto.mimeType?.split("/")[1]?.toUpperCase() || "ARCHIVO"}</Typography>
                </Box>
              )}
            </Box>
          </CardActionArea>

          <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, gap: 1 }}>
              <Chip
                label={tipoLabel}
                size="small"
                sx={{ height: 20, fontSize: "0.7rem", bgcolor: "primary.light", color: "primary.dark" }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatearTamano(foto.size)}
              </Typography>
            </Box>
            {foto.descripcion && (
              <Typography variant="body2" noWrap title={foto.descripcion} sx={{ fontSize: "0.8rem", mb: 0.25 }}>
                {foto.descripcion}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block">
              {formatearFechaHora(foto.uploadedAt)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="paper">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, pr: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" component="span" sx={{ display: "block", overflowWrap: "anywhere" }}>
            Fotos y archivos de {patientName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? "Cargando…" : plural(fotos.length, "archivo")}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar galería">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overscrollBehavior: "contain" }}>
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress aria-label="Cargando galería" />
          </Box>
        )}

        {error && !loading && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={fetchFotos}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!loading && !error && fotos.length === 0 && (
          <Box textAlign="center" py={6} color="text.secondary">
            <PhotoLibraryIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} aria-hidden />
            <Typography>Este paciente todavía no tiene fotos ni archivos.</Typography>
            <Typography variant="caption">Usá “Subir archivo” para agregar el primero.</Typography>
          </Box>
        )}

        {!loading && !error && fotos.length > 0 && (
          <>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={todasSeleccionadas}
                    indeterminate={selectedIds.length > 0 && !todasSeleccionadas}
                    onChange={toggleTodas}
                    size="small"
                  />
                }
                label={todasSeleccionadas ? "Deseleccionar todo" : "Seleccionar todo"}
              />
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {selectedIds.length > 0 && (
                  <Typography variant="body2" color="text.secondary" aria-live="polite">
                    {plural(selectedIds.length, "seleccionado")}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                  onClick={eliminarSeleccionadas}
                  disabled={selectedIds.length === 0 || deleting}
                >
                  {deleting ? "Eliminando…" : "Eliminar"}
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {fotos.map(renderFotoCard)}
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
