"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { plural } from "@/lib/cliente/formato";
import { etiquetaFallecido } from "@/lib/paciente/logica";

const normalizar = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

function iniciales(nombre) {
  const p = String(nombre || "?").trim().split(/\s+/);
  return (p.length >= 2 ? p[0][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase();
}

/** Pantalla de inicio: todos los pacientes, con búsqueda por nombre o DNI. */
export default function ListaPacientes({ pacientes, cargando, error, onReintentar, onElegir, onCrear }) {
  const [filtro, setFiltro] = useState("");
  const [verBajas, setVerBajas] = useState(false);
  const cantidadBajas = pacientes.filter((p) => p.deBaja).length;

  // Los dados de baja se ocultan salvo que se pidan; al buscar se muestran todos
  const visibles = useMemo(() => {
    const q = normalizar(filtro.trim());
    if (!q) return verBajas ? pacientes : pacientes.filter((p) => !p.deBaja);
    return pacientes.filter((p) => normalizar(p.nombreVisible).includes(q) || p.dni.includes(q));
  }, [pacientes, filtro, verBajas]);
  const activos = pacientes.length - cantidadBajas;

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 auto", minWidth: 120 }}>
          <Typography variant="h6" component="h1">
            Pacientes
          </Typography>
          {!cargando && !error && (
            <Typography variant="body2" color="text.secondary">
              {filtro.trim()
                ? `${plural(visibles.length, "resultado")} de ${pacientes.length}`
                : `${plural(activos, "paciente")}${cantidadBajas ? ` · ${cantidadBajas} de baja` : ""}`}
            </Typography>
          )}
        </Box>
        <TextField
          size="small"
          placeholder="Buscar por nombre o DNI…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          sx={{ flex: { xs: "1 1 100%", sm: "1 1 220px" }, maxWidth: { sm: 360 } }}
          slotProps={{
            htmlInput: { "aria-label": "Buscar paciente por nombre o DNI", spellCheck: false },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={onCrear}
          sx={{ flex: { xs: "1 1 100%", sm: "0 0 auto" } }}
        >
          Nuevo paciente
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mx: 2.5, mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onReintentar}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {cargando && (
        <Box sx={{ px: 2.5, pb: 2 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} height={56} />
          ))}
        </Box>
      )}

      {!cargando && !error && pacientes.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
          <Typography sx={{ mb: 2 }}>Todavía no hay pacientes cargados.</Typography>
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={onCrear}>
            Crear el primer paciente
          </Button>
        </Box>
      )}

      {!cargando && !error && pacientes.length > 0 && visibles.length === 0 && (
        <Typography color="text.secondary" sx={{ px: 2.5, pb: 3 }}>
          {filtro.trim() ? `Ningún paciente coincide con “${filtro.trim()}”.` : "No hay pacientes activos."}
        </Typography>
      )}

      {!cargando && visibles.length > 0 && (
        <List disablePadding sx={{ borderTop: 1, borderColor: "divider" }}>
          {visibles.map((p) => (
            <ListItemButton
              key={p.id}
              divider
              onClick={() => onElegir(p.id)}
              sx={{ px: { xs: 2, sm: 2.5 }, ...(p.deBaja && { color: "text.secondary" }) }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: p.deBaja ? "action.hover" : "primary.light",
                    color: p.deBaja ? "text.secondary" : "primary.dark",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {iniciales(p.nombreVisible)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Box component="span" sx={{ fontWeight: 500, overflowWrap: "anywhere" }}>
                      {p.nombreVisible || "Sin nombre"}
                    </Box>
                    {p.deBaja && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={p.tipoBaja === "fallecimiento" ? etiquetaFallecido(p.genero) : "De baja"}
                      />
                    )}
                  </Box>
                }
                secondary={p.dni ? `DNI ${p.dni}` : "Sin DNI"}
                slotProps={{ secondary: { sx: { fontVariantNumeric: "tabular-nums" } } }}
              />
            </ListItemButton>
          ))}
        </List>
      )}

      {!cargando && !error && cantidadBajas > 0 && !filtro.trim() && (
        <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 1 }}>
          <Button size="small" color="inherit" onClick={() => setVerBajas((v) => !v)} sx={{ color: "text.secondary" }}>
            {verBajas ? "Ocultar dados de baja" : `Mostrar dados de baja (${cantidadBajas})`}
          </Button>
        </Box>
      )}
    </Paper>
  );
}
