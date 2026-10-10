"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Divider, Paper, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { formatearFecha, formatearFechaHora, hoyISO } from "@/lib/paciente/logica";
import { api } from "@/lib/cliente/api";
import { useSesion } from "../auth/Sesion";

/**
 * Evoluciones del paciente: se agregan, nunca se editan ni se borran.
 * Para corregir un error se agrega una nueva evolución aclarándolo.
 */
export default function Evoluciones({ pacienteId, onCambio }) {
  const [lista, setLista] = useState(null);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(false);
  const { usuario } = useSesion() || {};
  const [form, setForm] = useState({ texto: "", fecha: hoyISO() });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setError("");
    try {
      setLista(await api.listarEvoluciones(pacienteId));
    } catch (e) {
      setError(e.message);
    }
  }, [pacienteId]);

  useEffect(() => {
    setLista(null);
    cargar();
  }, [cargar]);

  const abrir = () => {
    setForm({ texto: "", fecha: hoyISO() });
    setErrores({});
    setAbierto(true);
  };

  const guardar = async () => {
    setGuardando(true);
    setErrores({});
    try {
      await api.agregarEvolucion(pacienteId, form);
      setAbierto(false);
      await cargar();
      onCambio?.();
    } catch (e) {
      setErrores(e.detalles || { texto: e.message });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="h6">Evolución</Typography>
        {!abierto && (
          <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={abrir}>
            Nueva evolución
          </Button>
        )}
      </Box>

      {abierto && (
        <Box sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" } }}>
            <TextField
              label="Fecha"
              type="date"
              size="small"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              error={Boolean(errores.fecha)}
              helperText={errores.fecha || " "}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Profesional"
              size="small"
              value={usuario?.profesional || ""}
              helperText="Se registra con tu usuario"
              disabled
            />
          </Box>
          <TextField
            label="Evolución *"
            multiline
            minRows={4}
            fullWidth
            value={form.texto}
            onChange={(e) => setForm({ ...form, texto: e.target.value })}
            error={Boolean(errores.texto)}
            helperText={errores.texto || "Una vez guardada no se puede modificar. Para corregir, agregá una nueva evolución."}
          />
          <Box sx={{ mt: 1.5, display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={guardar} disabled={guardando}>
              {guardando ? <CircularProgress size={22} /> : "Guardar evolución"}
            </Button>
          </Box>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      {!lista && !error && <CircularProgress size={24} />}
      {lista?.length === 0 && <Typography color="text.secondary">Sin evoluciones registradas.</Typography>}
      {lista?.map((e, i) => (
        <Box key={e.id} sx={{ mb: 2 }}>
          {i > 0 && <Divider sx={{ mb: 2 }} />}
          <Typography variant="subtitle2">
            {formatearFecha(e.fecha) || formatearFechaHora(e.creadoEn)} — {e.profesional}
          </Typography>
          {e.creadoEn && (
            <Typography variant="caption" color="text.secondary">
              Registrada el {formatearFechaHora(e.creadoEn)}
            </Typography>
          )}
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>
            {e.texto}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}
