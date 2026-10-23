"use client";

import { useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Collapse,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
 * Resumen bajo el título de una sección plegable: cuánto tiene cargado (o el resultado
 * del MMSE). Las secciones con varios grupos cuentan grupos ("3 de 11 sistemas").
 */
function resumenSeccion(paciente, seccion, cargados, totalCampos, gruposConDatos) {
  if (seccion.esMMSE) {
    const r = paciente.derivados?.mmse;
    if (!r || r.completados === 0) return "Sin puntajes cargados";
    return r.completo ? `${r.total} / ${r.max} · ${r.interpretacion}` : `${r.total} / ${r.max} · incompleto`;
  }
  if (cargados === 0) return "Sin datos cargados";
  if (seccion.grupos.length > 1) {
    return `${gruposConDatos} de ${seccion.grupos.length} ${seccion.nombreGrupos || "apartados"} con datos`;
  }
  return `${cargados} de ${totalCampos} campos con datos`;
}

const normalizarEtiqueta = (t) =>
  String(t || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s*\(.*\)\s*$/, "")
    .trim();

/** "Digestivos" dentro de "Digestivos": la etiqueta del campo repite el grupo y sobra. */
function repiteGrupo(campo, grupo) {
  const a = normalizarEtiqueta(campo.label);
  const b = normalizarEtiqueta(grupo.titulo);
  return a === b || a.slice(0, 6) === b.slice(0, 6); // "Ginecológicas" en "Ginecológicos"
}

function BotonHistorial({ paciente, campo, onVerHistorial, nombre }) {
  const mod = paciente.ultimaModificacion?.[claveModificacion(campo.path)];
  const ayuda = mod ? `Ver historial · última modificación ${formatearFechaHora(mod)}` : "Ver historial";
  return (
    <Tooltip title={ayuda}>
      <IconButton
        size="small"
        aria-label={`${ayuda} de ${nombre || campo.label}`}
        onClick={() => onVerHistorial(campo.path)}
        sx={{ color: mod ? "primary.main" : "text.disabled", my: -0.5 }}
      >
        <HistoryIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
}

/**
 * Un grupo (sistema) como fila: el nombre a la izquierda y sus datos a la derecha
 * ("Atención · Conservada"). Los textos largos van debajo; las observaciones, en un
 * recuadro aparte. En el celular el nombre queda arriba.
 */
function FilaGrupo({ paciente, grupo, onVerHistorial }) {
  const cortos = grupo.visibles.filter((c) => c.tipo !== "textarea");
  const largos = grupo.visibles.filter((c) => c.tipo === "textarea");
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "180px minmax(0, 1fr)" },
        columnGap: 2,
        rowGap: 0.5,
        py: 1.5,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Typography component="h3" variant="subtitle2" color="primary" sx={{ fontWeight: 600, lineHeight: 1.5 }}>
        {grupo.titulo}
      </Typography>
      <Box sx={{ minWidth: 0 }}>
        {cortos.length > 0 && (
          <Box
            component="dl"
            sx={{ m: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", columnGap: 2, rowGap: 0.5 }}
          >
            {cortos.map((c) => (
              <Box key={c.path} sx={{ minWidth: 0, display: "flex", flexWrap: "wrap", columnGap: 0.75 }}>
                <Typography component="dt" variant="body2" color="text.secondary">
                  {c.label}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0, fontWeight: 500, overflowWrap: "anywhere" }}>
                  {valorVisible(paciente, c)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        {largos.map((c, i) => {
          const esNota = c.path.endsWith(".observaciones");
          const sinEtiqueta = esNota || repiteGrupo(c, grupo);
          return (
            <Box
              key={c.path}
              sx={{
                mt: i > 0 || cortos.length > 0 ? 1 : 0,
                ...(esNota && { px: 1.5, py: 1, bgcolor: "action.hover", borderLeft: 3, borderColor: "grey.400" }),
              }}
            >
              {(!sinEtiqueta || c.conHistorial) && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {!sinEtiqueta && (
                    <Typography variant="body2" color="text.secondary">
                      {c.label}
                    </Typography>
                  )}
                  {c.conHistorial && <BotonHistorial paciente={paciente} campo={c} onVerHistorial={onVerHistorial} />}
                </Box>
              )}
              {esNota && (
                <Typography variant="caption" color="text.secondary" component="div">
                  Observaciones
                </Typography>
              )}
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                {valorVisible(paciente, c)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/**
 * Una sección del paciente. Por defecto oculta los campos vacíos para que se vea
 * lo que está cargado; "Mostrar campos vacíos" los muestra todos.
 * Con `plegable`, el título despliega o pliega el contenido (`abierta` / `onAlternar`)
 * y plegada muestra un resumen.
 */
export default function SeccionVista({ paciente, seccionKey, onEditar, onVerHistorial, plegable = false, abierta = true, onAlternar }) {
  const [verVacios, setVerVacios] = useState(false);
  const seccion = SECCIONES[seccionKey];
  const variosGrupos = seccion.grupos.length > 1;
  const idContenido = `seccion-${seccionKey}`;

  const grupos = seccion.grupos
    .map((g) => ({ ...g, visibles: verVacios ? g.campos : g.campos.filter((c) => tieneContenido(paciente, c)) }))
    .filter((g) => g.visibles.length > 0);
  const totalCampos = seccion.grupos.reduce((n, g) => n + g.campos.length, 0);
  const cargados = seccion.grupos.reduce((n, g) => n + g.campos.filter((c) => tieneContenido(paciente, c)).length, 0);
  const hayVacios = cargados < totalCampos;
  const visible = !plegable || abierta;
  const gruposVacios = seccion.grupos.filter((g) => !g.campos.some((c) => tieneContenido(paciente, c)));
  const resumen = resumenSeccion(paciente, seccion, cargados, totalCampos, seccion.grupos.length - gruposVacios.length);

  const titulo = (
    <Typography variant="h6" component="h2" sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
      {seccion.titulo}
    </Typography>
  );

  return (
    <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={visible ? 1.5 : 0} gap={1}>
        {plegable ? (
          <ButtonBase
            onClick={() => onAlternar(seccionKey)}
            aria-expanded={abierta}
            aria-controls={idContenido}
            sx={{
              flex: 1,
              minWidth: 0,
              justifyContent: "flex-start",
              textAlign: "left",
              gap: 1,
              borderRadius: 1,
              py: 0.5,
              mr: 1,
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
            }}
          >
            <ExpandMoreIcon
              aria-hidden
              sx={{
                color: "text.secondary",
                transition: "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)",
                transform: abierta ? "rotate(0deg)" : "rotate(-90deg)",
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              {titulo}
              {/* El resumen se ve siempre: abierta también ubica cuánto falta cargar */}
              <Typography variant="body2" color="text.secondary">
                {resumen}
              </Typography>
            </Box>
          </ButtonBase>
        ) : (
          titulo
        )}
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

      <Collapse in={visible} timeout={200} id={idContenido}>
      {seccion.esMMSE ? (
        <VistaMMSE paciente={paciente} />
      ) : (
        <>
          {cargados === 0 && !verVacios && (
            <Typography variant="body2" color="text.secondary">
              Sin datos cargados.
            </Typography>
          )}
          {variosGrupos ? (
            <>
              {grupos.map((g) => (
                <FilaGrupo key={g.id} paciente={paciente} grupo={g} onVerHistorial={onVerHistorial} />
              ))}
              {!verVacios && cargados > 0 && gruposVacios.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ pt: 1.25, borderTop: 1, borderColor: "divider" }}>
                  Sin datos: {gruposVacios.map((g) => g.titulo.toLowerCase()).join(", ")}
                </Typography>
              )}
            </>
          ) : grupos.map((g) => (
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
      </Collapse>
    </Paper>
  );
}
