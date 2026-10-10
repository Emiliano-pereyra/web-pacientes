"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { campoPorPath } from "@/lib/paciente/schema";
import { formatearFechaHora } from "@/lib/paciente/logica";
import { api } from "@/lib/cliente/api";

/** Muestra todas las versiones anteriores de un campo (historial de solo lectura). */
export default function ModalHistorialCampo({ pacienteId, campo, onClose }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const def = campoPorPath(campo);

  useEffect(() => {
    let vigente = true;
    api
      .historial(pacienteId, campo)
      .then((data) => vigente && setItems(data))
      .catch((e) => vigente && setError(e.message));
    return () => {
      vigente = false;
    };
  }, [pacienteId, campo]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Historial — {def?.label ?? campo}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error">{error}</Alert>}
        {!items && !error && (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        )}
        {items?.length === 0 && <Typography color="text.secondary">Sin cambios registrados.</Typography>}
        {items?.map((h, i) => (
          <Box key={h.id} sx={{ mb: 2 }}>
            {i > 0 && <Divider sx={{ mb: 2 }} />}
            <Typography variant="caption" color="text.secondary">
              {formatearFechaHora(h.creadoEn)} · {h.profesional}
              {h.fechaReferencia ? ` · fecha original: ${formatearFechaHora(h.fechaReferencia)}` : ""}
            </Typography>
            {h.cambios.map((c, j) => (
              <Box key={j} sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Valor anterior
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}>
                  {c.anterior ?? "(vacío)"}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                  Valor nuevo
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {c.nuevo ?? "(vacío)"}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
