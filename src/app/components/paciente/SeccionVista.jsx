"use client";

import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import { MMSE_ITEMS, SECCIONES, claveModificacion, getPath } from "@/lib/paciente/schema";
import { formatearFecha, formatearFechaHora, mostrar } from "@/lib/paciente/logica";

function valorVisible(paciente, c) {
  const v = getPath(paciente, c.path);
  if (c.tipo === "date") return mostrar(formatearFecha(v));
  if (c.tipo === "puntaje") return typeof v === "number" ? `${v} / ${c.max}` : "—";
  return mostrar(v);
}

function Campo({ paciente, campo, onVerHistorial }) {
  const largo = campo.tipo === "textarea";
  const mod = campo.conHistorial ? paciente.ultimaModificacion?.[claveModificacion(campo.path)] : null;
  return (
    <Box sx={{ gridColumn: largo ? "1 / -1" : "auto", minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" component="div">
        {campo.label}
        {mod && ` · últ. modificación ${formatearFechaHora(mod)}`}
        {campo.conHistorial && (
          <Button
            size="small"
            startIcon={<HistoryIcon fontSize="inherit" />}
            onClick={() => onVerHistorial(campo.path)}
            sx={{ ml: 1, py: 0, minWidth: 0, fontSize: 12 }}
          >
            historial
          </Button>
        )}
      </Typography>
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

export default function SeccionVista({ paciente, seccionKey, onEditar, onVerHistorial }) {
  const seccion = SECCIONES[seccionKey];
  const variosGrupos = seccion.grupos.length > 1;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="h6">{seccion.titulo}</Typography>
        <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => onEditar(seccionKey)}>
          Editar
        </Button>
      </Box>

      {seccion.esMMSE ? (
        <VistaMMSE paciente={paciente} />
      ) : (
        seccion.grupos.map((g) => (
          <Box key={g.id} sx={{ mb: variosGrupos ? 2 : 0 }}>
            {g.titulo && variosGrupos && g.campos.length > 1 && (
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {g.titulo}
              </Typography>
            )}
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              }}
            >
              {g.campos.map((c) => (
                <Campo key={c.path} paciente={paciente} campo={c} onVerHistorial={onVerHistorial} />
              ))}
            </Box>
          </Box>
        ))
      )}
    </Paper>
  );
}
