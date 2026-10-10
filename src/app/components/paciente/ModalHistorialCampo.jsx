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

function Valor({ titulo, valor, tono }) {
  const vacio = valor === null || valor === undefined || valor === "";
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: 1,
        borderColor: tono === "nuevo" ? "primary.main" : "divider",
        bgcolor: tono === "nuevo" ? "primary.light" : "background.default",
        minWidth: 0,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {titulo}
      </Typography>
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: vacio ? "text.disabled" : "text.primary" }}
      >
        {vacio ? "(vacío)" : String(valor)}
      </Typography>
    </Box>
  );
}

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
              <Box
                key={j}
                sx={{ mt: 1, display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}
              >
                <Valor titulo="Antes" valor={c.anterior} tono="anterior" />
                <Valor titulo="Después" valor={c.nuevo} tono="nuevo" />
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
