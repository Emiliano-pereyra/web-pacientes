import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Checkbox,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { api } from "@/lib/cliente/api";
import Swal from "sweetalert2";

const TIPOS_LABELS = {
  perfil: "Perfil",
  evolucion: "Evolución",
  tratamiento: "Tratamiento",
  documento: "Documento",
  general: "General",
  otros: "Otros",
};

export default function ModalGaleriaFotosPaciente({
  open,
  onClose,
  pacienteId,
  patientName,
  onDeleted,
}) {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const fetchFotos = useCallback(async () => {
    if (!pacienteId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.listarFotos(pacienteId);

      if (data.success) {
        setFotos(data.fotos);
      } else {
        setError("No se pudieron cargar las fotos");
      }
    } catch (err) {
      console.error("Error cargando galería:", err);
      setError("Error al cargar la galería");
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    if (open && pacienteId) {
      fetchFotos();
    }
  }, [open, pacienteId, fetchFotos]);

  const handleToggleSelect = (fotoId) => {
    setSelectedIds((prev) =>
      prev.includes(fotoId)
        ? prev.filter((id) => id !== fotoId)
        : [...prev, fotoId],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === fotos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(fotos.map((f) => f.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire(
        "Atención",
        "Seleccioná al menos una foto para eliminar",
        "warning",
      );
      return;
    }

    const fotosAEliminar = fotos.filter((f) => selectedIds.includes(f.id));

    const result = await Swal.fire({
      title: "¿Eliminar fotos?",
      html: `
        <p>Estás por eliminar <strong>${selectedIds.length} foto(s)</strong>:</p>
        <ul style="text-align: left; max-height: 200px; overflow-y: auto;">
          ${fotosAEliminar
            .slice(0, 5)
            .map((f) => `<li>${f.nombreOriginal || f.tipo}</li>`)
            .join("")}
          ${fotosAEliminar.length > 5 ? `<li>... y ${fotosAEliminar.length - 5} más</li>` : ""}
        </ul>
        <p style="color: #f44336; font-size: 0.9rem;">Esta acción no se puede deshacer</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeleting(true);

      const data = await api.eliminarFotos(pacienteId, selectedIds);

      if (data.success) {
        await fetchFotos();
        setSelectedIds([]);
        Swal.fire("Eliminado", data.message, "success");
        onDeleted?.(data.eliminated);
      }
    } catch (err) {
      console.error("Error eliminando:", err);
      Swal.fire(
        "Error",
        err.message || "No se pudieron eliminar las fotos",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleViewPhoto = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFotoCard = (foto) => {
    const isSelected = selectedIds.includes(foto.id);
    const isImage = foto.mimeType?.startsWith("image/");
    const tipoLabel = TIPOS_LABELS[foto.tipo] || foto.tipo;

    return (
      <Card
        key={foto.id}
        sx={{
          position: "relative",
          transition: "all 0.2s",
          border: isSelected ? "2px solid #1976d2" : "1px solid #e0e0e0",
          borderRadius: 2,
          "&:hover": { boxShadow: 3, transform: "translateY(-2px)" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
            bgcolor: "rgba(255,255,255,0.9)",
            borderRadius: "50%",
          }}
        >
          <Checkbox
            checked={isSelected}
            onChange={() => handleToggleSelect(foto.id)}
            size="small"
            sx={{ padding: 0.5 }}
          />
        </Box>

        <Box
          sx={{ position: "relative", paddingTop: "75%", bgcolor: "#f5f5f5" }}
        >
          {isImage ? (
            <CardMedia
              component="img"
              image={foto.url}
              alt={foto.nombreOriginal}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "text.secondary",
              }}
            >
              <PhotoLibraryIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="caption">
                {foto.mimeType?.split("/")[1]?.toUpperCase() || "ARCHIVO"}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              p: 0.5,
              display: "flex",
              justifyContent: "center",
              gap: 0.5,
              opacity: 0,
              transition: "opacity 0.2s",
              "&:hover": { opacity: 1 },
            }}
          >
            <Tooltip title="Ver">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPhoto(foto.url);
                }}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <CardContent sx={{ p: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 0.5,
            }}
          >
            <Chip
              label={tipoLabel}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 20,
                bgcolor: "#e3f2fd",
                color: "#1976d2",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {(foto.size / 1024 / 1024).toFixed(1)} MB
            </Typography>
          </Box>

          {foto.descripcion && (
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.5,
              }}
            >
              {foto.descripcion}
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary" display="block">
            {formatDate(foto.uploadedAt)}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        <Box>
          <Typography variant="h6">📸 Galería de {patientName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {fotos.length} archivo(s) • Seleccioná para eliminar
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            bgcolor: "rgba(0,0,0,0.04)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && fotos.length === 0 && (
          <Box textAlign="center" py={6} color="text.secondary">
            <PhotoLibraryIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography>No hay fotos subidas para este paciente</Typography>
            <Typography variant="caption">
              Usá el botón Subir Foto para agregar contenido
            </Typography>
          </Box>
        )}

        {!loading && !error && fotos.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Checkbox
                  checked={
                    selectedIds.length === fotos.length && fotos.length > 0
                  }
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < fotos.length
                  }
                  onChange={handleSelectAll}
                  size="small"
                />
                <Typography
                  variant="body2"
                  onClick={handleSelectAll}
                  sx={{ cursor: "pointer" }}
                >
                  {selectedIds.length === fotos.length
                    ? "Deseleccionar todo"
                    : "Seleccionar todo"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography variant="body2" sx={{ alignSelf: "center" }}>
                  {selectedIds.length > 0 && (
                    <Chip
                      label={`${selectedIds.length} seleccionada(s)`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Typography>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0 || deleting}
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {fotos.map(renderFotoCard)}
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
