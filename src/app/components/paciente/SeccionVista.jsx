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
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HistoryIcon from "@mui/icons-material/History";
import { MMSE_ITEMS, SECCIONES, claveModificacion, getPath } from "@/lib/paciente/schema";
import { esVacio, formatearFecha, formatearFechaHora, mostrar } from "@/lib/paciente/logica";

// Oculto a la vista pero leído por lectores de pantalla
const visuallyHidden = {
  position: "absolute",
  width: "1px", // en sx, 1 sería 100%
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

function valorVisible(paciente, c) {
  const v = getPath(paciente, c.path);
  if (c.tipo === "date") return mostrar(formatearFecha(v));
  if (c.tipo === "puntaje") return typeof v === "number" ? `${v} / ${c.max}` : "—";
  return mostrar(v);
}

/** Fila de una sección de un solo grupo: el dato a la izquierda y el valor a la derecha. */
function FilaCampo({ paciente, campo, onVerHistorial }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "220px minmax(0, 1fr)" },
        columnGap: 2,
        rowGap: 0.25,
        py: 1,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {campo.label}
        </Typography>
        {campo.conHistorial && <BotonHistorial paciente={paciente} campo={campo} onVerHistorial={onVerHistorial} />}
      </Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, whiteSpace: campo.tipo === "textarea" ? "pre-wrap" : "normal", overflowWrap: "anywhere" }}
      >
        {valorVisible(paciente, campo)}
      </Typography>
    </Box>
  );
}

/** Nota destacada (observaciones): fondo suave y barra a la izquierda. */
function Nota({ children, titulo = "Observaciones", sx }) {
  return (
    <Box sx={{ px: 1.5, py: 1, bgcolor: "action.hover", borderLeft: 3, borderColor: "grey.400", ...sx }}>
      <Typography variant="caption" color="text.secondary" component="div">
        {titulo}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
        {children}
      </Typography>
    </Box>
  );
}

/** MMSE: el resultado arriba, bien visible, y debajo cada ítem con su respuesta y puntaje. */
function VistaMMSE({ paciente }) {
  const r = paciente.derivados?.mmse;
  const observaciones = getPath(paciente, "valoracionMental.observaciones");
  return (
    <>
      {r && r.completados > 0 && (
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap", mb: 1.5 }}>
          <Typography component="p" sx={{ fontSize: "1.5rem", fontWeight: 600, fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>
            {r.total}
            <Typography component="span" color="text.secondary" sx={{ fontSize: "1rem", fontWeight: 400 }}>
              {" "}
              / {r.max}
            </Typography>
          </Typography>
          {r.completo ? (
            <Chip color="primary" label={r.interpretacion} />
          ) : (
            <Chip variant="outlined" label={`Incompleto: ${r.completados} de ${r.itemsTotales} ítems`} />
          )}
        </Box>
      )}
      <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none" }}>
        {MMSE_ITEMS.map((item) => {
          const p = getPath(paciente, `valoracionMental.${item.id}.puntaje`);
          const respuesta = getPath(paciente, `valoracionMental.${item.id}.respuesta`);
          return (
            <Box
              component="li"
              key={item.id}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "minmax(0, 1fr) auto", sm: "minmax(0, 1.4fr) minmax(0, 1fr) auto" },
                columnGap: 2,
                py: 1,
                borderTop: 1,
                borderColor: "divider",
                alignItems: "baseline",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, overflowWrap: "anywhere", gridRow: { xs: 2, sm: "auto" }, gridColumn: { xs: "1 / -1", sm: "auto" } }}
              >
                {respuesta ? respuesta : ""}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", textAlign: "right", color: typeof p === "number" ? "text.primary" : "text.disabled" }}
              >
                {typeof p === "number" ? p : "—"}
                <Typography component="span" variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
                  {" "}
                  / {item.max}
                </Typography>
              </Typography>
            </Box>
          );
        })}
      </Box>
      {observaciones && <Nota sx={{ mt: 1.5 }}>{observaciones}</Nota>}
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
                {/* Un único dato que repite el nombre del grupo ("Ginecológicas") va sin etiqueta */}
                <Typography
                  component="dt"
                  variant="body2"
                  color="text.secondary"
                  sx={grupo.campos.length === 1 && repiteGrupo(c, grupo) ? visuallyHidden : undefined}
                >
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
  const camposVacios = seccion.grupos.flatMap((g) => g.campos).filter((c) => !tieneContenido(paciente, c));
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
                  Sin datos: {gruposVacios.map((g) => g.titulo).join(", ")}
                </Typography>
              )}
            </>
          ) : (
            <>
              {grupos.flatMap((g) => g.visibles).map((c) => (
                <FilaCampo key={c.path} paciente={paciente} campo={c} onVerHistorial={onVerHistorial} />
              ))}
              {!verVacios && cargados > 0 && camposVacios.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ pt: 1.25, borderTop: 1, borderColor: "divider" }}>
                  Sin datos: {camposVacios.map((c) => c.label.replace(/^¿|\?$/g, "")).join(", ")}
                </Typography>
              )}
            </>
          )}
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
