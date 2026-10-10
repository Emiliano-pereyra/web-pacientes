"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import { MMSE_ITEMS, SECCIONES, claveModificacion, getPath } from "@/lib/paciente/schema";
import { esVacio, formatearFecha, formatearFechaHora, mostrar } from "@/lib/paciente/logica";

function valorVisible(paciente, c) {
  const v = getPath(paciente, c.path);
  if (c.tipo === "date") return mostrar(formatearFecha(v));
  if (c.tipo === "puntaje") return typeof v === "number" ? `${v} / ${c.max}` : "—";
  return mostrar(v);
}

function Campo({ paciente, campo, onVerHistorial }) {
  const largo = campo.tipo === "textarea";
  const mod = campo.conHistorial ? paciente.ultimaModificacion?.[claveModificacion(campo.path)] : null;
  const ayuda = mod ? `Ver historial · última modificación ${formatearFechaHora(mod)}` : "Ver historial";
  return (
    <Box sx={{ gridColumn: largo ? "1 / -1" : "auto", minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minHeight: 28 }}>
        <Typography variant="caption" color="text.secondary" component="div" sx={{ fontWeight: 500 }}>
          {campo.label}
        </Typography>
        {campo.conHistorial && (
          <Tooltip title={ayuda}>
            <IconButton
              size="small"
              aria-label={`${ayuda} de ${campo.label}`}
              onClick={() => onVerHistorial(campo.path)}
              sx={{ color: mod ? "primary.main" : "text.disabled" }}
            >
              <HistoryIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Typography variant="body2" sx={{ whiteSpace: largo ? "pre-wrap" : "normal", overflowWrap: "anywhere" }}>
        {valorVisible(paciente, campo)}
      </Typography>
    </Box>
  );
}

function VistaMMSE({ paciente }) {
  const r = paciente.derivados?.mmse;
  return (
    <>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ítem</TableCell>
              <TableCell>Respuesta</TableCell>
              <TableCell align="right">Puntaje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MMSE_ITEMS.map((item) => {
              const p = getPath(paciente, `valoracionMental.${item.id}.puntaje`);
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>{mostrar(getPath(paciente, `valoracionMental.${item.id}.respuesta`))}</TableCell>
                  <TableCell align="right">{typeof p === "number" ? `${p} / ${item.max}` : `— / ${item.max}`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {r && (
        <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Puntaje total: {r.total} / {r.max}
          </Typography>
          {r.completo ? (
            <Chip size="small" color="primary" label={r.interpretacion} />
          ) : (
            <Chip size="small" variant="outlined" label={`Incompleto: ${r.completados} de ${r.itemsTotales} ítems`} />
          )}
        </Box>
      )}
      {getPath(paciente, "valoracionMental.observaciones") && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Observaciones
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {getPath(paciente, "valoracionMental.observaciones")}
          </Typography>
        </Box>
      )}
    </>
  );
}

/** Un campo se muestra si tiene valor, o si tiene historial (aunque lo hayan vaciado). */
function tieneContenido(paciente, c) {
  if (c.tipo === "puntaje") return typeof getPath(paciente, c.path) === "number";
  if (!esVacio(getPath(paciente, c.path))) return true;
  return Boolean(c.conHistorial && paciente.ultimaModificacion?.[claveModificacion(c.path)]);
}

/**
 * Una sección del paciente. Por defecto oculta los campos vacíos para que se vea
 * lo que está cargado; "Mostrar campos vacíos" los muestra todos.
 */
export default function SeccionVista({ paciente, seccionKey, onEditar, onVerHistorial }) {
  const [verVacios, setVerVacios] = useState(false);
  const seccion = SECCIONES[seccionKey];
  const variosGrupos = seccion.grupos.length > 1;

  const grupos = seccion.grupos
    .map((g) => ({ ...g, visibles: verVacios ? g.campos : g.campos.filter((c) => tieneContenido(paciente, c)) }))
    .filter((g) => g.visibles.length > 0);
  const totalCampos = seccion.grupos.reduce((n, g) => n + g.campos.length, 0);
  const cargados = seccion.grupos.reduce((n, g) => n + g.campos.filter((c) => tieneContenido(paciente, c)).length, 0);
  const hayVacios = cargados < totalCampos;

  return (
    <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5} gap={1}>
        <Typography variant="h6" component="h2">
          {seccion.titulo}
        </Typography>
        {onEditar && (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEditar(seccionKey)}
            aria-label={`Editar ${seccion.titulo}`}
          >
            Editar
          </Button>
        )}
      </Box>

      {seccion.esMMSE ? (
        <VistaMMSE paciente={paciente} />
      ) : (
        <>
          {cargados === 0 && !verVacios && (
            <Typography variant="body2" color="text.secondary">
              Sin datos cargados.
            </Typography>
          )}
          {grupos.map((g) => (
            <Box key={g.id} sx={{ mb: variosGrupos ? 2 : 0, "&:last-of-type": { mb: 0 } }}>
              {g.titulo && variosGrupos && g.campos.length > 1 && (
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {g.titulo}
                </Typography>
              )}
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                }}
              >
                {g.visibles.map((c) => (
                  <Campo key={c.path} paciente={paciente} campo={c} onVerHistorial={onVerHistorial} />
                ))}
              </Box>
            </Box>
          ))}
          {hayVacios && (
            <Button
              size="small"
              color="inherit"
              onClick={() => setVerVacios((v) => !v)}
              aria-expanded={verVacios}
              sx={{ mt: 1, px: 0, minWidth: 0, color: "text.secondary", fontWeight: 500 }}
            >
              {verVacios
                ? "Ocultar campos vacíos"
                : `Mostrar campos vacíos (${totalCampos - cargados})`}
            </Button>
          )}
        </>
      )}
    </Paper>
  );
}
