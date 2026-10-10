"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Divider, Paper, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "sonner";
import { formatearFecha, formatearFechaHora, hoyISO } from "@/lib/paciente/logica";
import { api } from "@/lib/cliente/api";
import { enfocarPrimerError, useCambiosSinGuardar } from "@/lib/cliente/formularios";
import { useSesion } from "../auth/Sesion";

/**
 * Evoluciones del paciente: se agregan, nunca se editan ni se borran.
 * Para corregir un error se agrega una nueva evolución aclarándolo.
 * `senalAbrir` abre el formulario cada vez que cambia (botón "Nueva evolución" del encabezado).
 */
export default function Evoluciones({ pacienteId, onCambio, senalAbrir = 0 }) {
  const { usuario } = useSesion() || {};
  const [lista, setLista] = useState(null);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState({ texto: "", fecha: hoyISO() });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const raiz = useRef(null);
  const texto = useRef(null);

  const pedirCierre = useCambiosSinGuardar(abierto && form.texto.trim() !== "" && !guardando);

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

  const abiertoRef = useRef(false);
  useEffect(() => {
    abiertoRef.current = abierto;
  }, [abierto]);

  const abrir = useCallback(() => {
    // si ya estaba abierto, se conserva lo escrito
    if (!abiertoRef.current) {
      setForm({ texto: "", fecha: hoyISO() });
      setErrores({});
    }
    setAbierto(true);
    requestAnimationFrame(() => {
      raiz.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      texto.current?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (senalAbrir) abrir();
  }, [senalAbrir, abrir]);

  const guardar = async () => {
    setGuardando(true);
    setErrores({});
    try {
      await api.agregarEvolucion(pacienteId, form);
      setAbierto(false);
      await cargar();
      onCambio?.();
      toast.success("Evolución registrada");
    } catch (e) {
      const detalles = e.detalles || { texto: e.message };
      setErrores(detalles);
      enfocarPrimerError(detalles, raiz.current);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Paper ref={raiz} variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, scrollMarginTop: 120 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5} gap={1}>
        <Typography variant="h6" component="h2">
          Evolución
        </Typography>
        {!abierto && (
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={abrir}>
            Nueva evolución
          </Button>
        )}
      </Box>

      {abierto && (
        <Box sx={{ mb: 3, p: 2, bgcolor: "background.default", border: 1, borderColor: "divider", borderRadius: 1 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap", mb: 1 }}>
            <Box data-campo="fecha">
              <TextField
                label="Fecha"
                type="date"
                size="small"
                name="fecha"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                error={Boolean(errores.fecha)}
                helperText={errores.fecha || " "}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
              Se registra como <strong>{usuario?.profesional || "—"}</strong>
            </Typography>
          </Box>
          <Box data-campo="texto">
            <TextField
              label="Evolución *"
              name="texto"
              multiline
              minRows={4}
              fullWidth
              inputRef={texto}
              value={form.texto}
              onChange={(e) => setForm({ ...form, texto: e.target.value })}
              error={Boolean(errores.texto)}
              helperText={
                errores.texto || "Una vez guardada no se puede modificar. Para corregir, agregá una nueva evolución."
              }
            />
          </Box>
          <Box sx={{ mt: 1.5, display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button onClick={() => pedirCierre(() => setAbierto(false))} disabled={guardando}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={guardar}
              disabled={guardando}
              startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {guardando ? "Guardando…" : "Guardar evolución"}
            </Button>
          </Box>
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={cargar}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {!lista && !error && <CircularProgress size={24} aria-label="Cargando evoluciones" />}
      {lista?.length === 0 && <Typography color="text.secondary">Todavía no hay evoluciones registradas.</Typography>}
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
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mt: 0.5, overflowWrap: "anywhere" }}>
            {e.texto}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}
