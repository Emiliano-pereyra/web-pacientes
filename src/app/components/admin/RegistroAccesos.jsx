"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { api } from "@/lib/cliente/api";
import { ACCIONES, ACCIONES_LECTURA } from "@/lib/auditoria";
import { formatearFechaHora } from "@/lib/paciente/logica";

/**
 * Registro de accesos (solo admins).
 *  - con `pacienteId`: todo lo que se hizo con ese paciente;
 *  - sin él: actividad de todos, con filtro por usuario.
 */
export default function RegistroAccesos({ pacienteId, usuarios = [] }) {
  const [uid, setUid] = useState("");
  const [eventos, setEventos] = useState(null);
  const [hayMas, setHayMas] = useState(false);
  const [error, setError] = useState("");
  const [cargandoMas, setCargandoMas] = useState(false);

  // Carga inicial y al cambiar el filtro
  useEffect(() => {
    let vigente = true;
    api
      .auditoria({ pacienteId, uid: uid || undefined })
      .then((r) => {
        if (!vigente) return;
        setEventos(r.eventos);
        setHayMas(r.hayMas);
        setError("");
      })
      .catch((e) => vigente && setError(e.message));
    return () => {
      vigente = false;
    };
  }, [pacienteId, uid]);

  const cambiarUsuario = (nuevo) => {
    setEventos(null);
    setUid(nuevo);
  };

  const cargarMas = async () => {
    setCargandoMas(true);
    try {
      const r = await api.auditoria({ pacienteId, uid: uid || undefined, antesDe: eventos.at(-1)?.fecha });
      setEventos((prev) => [...prev, ...r.eventos]);
      setHayMas(r.hayMas);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargandoMas(false);
    }
  };

  return (
    <Box>
      {!pacienteId && (
        <TextField
          select
          size="small"
          label="Usuario"
          value={uid}
          onChange={(e) => cambiarUsuario(e.target.value)}
          sx={{ mb: 2, minWidth: 260 }}
        >
          <MenuItem value="">Todos los usuarios</MenuItem>
          {usuarios.map((u) => (
            <MenuItem key={u.uid} value={u.uid}>
              {u.nombre}
            </MenuItem>
          ))}
        </TextField>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      {!eventos && !error && Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height={52} />)}
      {eventos?.length === 0 && <Typography color="text.secondary">Todavía no hay registros.</Typography>}

      {eventos?.map((e, i) => (
        <Box key={e.id}>
          {i > 0 && <Divider />}
          <Box
            sx={{
              py: 1.25,
              display: "grid",
              gap: { xs: 0.25, sm: 2 },
              gridTemplateColumns: { xs: "1fr", sm: "200px 1fr" },
              alignItems: "start",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}
              >
                {formatearFechaHora(e.fecha)}
              </Typography>
              {e.veces > 1 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  {e.veces} veces, hasta {formatearFechaHora(e.ultimaVez).split(", ")[1]}
                </Typography>
              )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  label={ACCIONES[e.accion] || e.accion}
                  color={ACCIONES_LECTURA.includes(e.accion) ? "default" : "primary"}
                  variant={ACCIONES_LECTURA.includes(e.accion) ? "outlined" : "filled"}
                />
                {!pacienteId && e.pacienteId && (
                  <Typography
                    component={Link}
                    href={`/?paciente=${encodeURIComponent(e.pacienteId)}`}
                    variant="body2"
                    sx={{ fontWeight: 500, color: "primary.main", overflowWrap: "anywhere" }}
                  >
                    {e.pacienteNombre || e.pacienteId}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ mt: 0.5, overflowWrap: "anywhere" }}>
                {e.usuario}
                {e.detalle && (
                  <Box component="span" sx={{ color: "text.secondary" }}>
                    {" "}
                    · {e.detalle}
                  </Box>
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {[e.navegador, e.ip].filter(Boolean).join(" · ")}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}

      {hayMas && (
        <Button
          onClick={cargarMas}
          disabled={cargandoMas}
          startIcon={cargandoMas ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ mt: 1 }}
        >
          {cargandoMas ? "Cargando…" : "Ver más"}
        </Button>
      )}
    </Box>
  );
}
