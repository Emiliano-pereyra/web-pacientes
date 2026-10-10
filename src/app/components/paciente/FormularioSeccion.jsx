"use client";

import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { SECCIONES } from "@/lib/paciente/schema";

export function CampoFormulario({ campo, valor, error, onChange, disabled }) {
  const comunes = {
    label: campo.label + (campo.requerido ? " *" : ""),
    name: campo.path,
    autoComplete: "off",
    value: valor ?? "",
    onChange: (e) => onChange(campo.path, e.target.value),
    error: Boolean(error),
    helperText: error || " ",
    fullWidth: true,
    size: "small",
    disabled,
  };

  switch (campo.tipo) {
    case "textarea":
      return <TextField {...comunes} multiline minRows={3} />;
    case "date":
      return <TextField {...comunes} type="date" slotProps={{ inputLabel: { shrink: true } }} />;
    case "dni":
      return <TextField {...comunes} slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 10 } }} />;
    case "select":
      return (
        <TextField {...comunes} select>
          <MenuItem value="">
            <em>Sin especificar</em>
          </MenuItem>
          {campo.opciones.map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </TextField>
      );
    case "puntaje":
      return (
        <TextField {...comunes} select>
          <MenuItem value="">
            <em>Sin puntuar</em>
          </MenuItem>
          {Array.from({ length: campo.max + 1 }, (_, n) => (
            <MenuItem key={n} value={n}>
              {n} / {campo.max}
            </MenuItem>
          ))}
        </TextField>
      );
    default:
      return <TextField {...comunes} />;
  }
}

/**
 * Formulario de una sección completa, armado desde el esquema.
 * valores: { path: valor } · errores: { path: mensaje }
 */
export default function FormularioSeccion({ seccionKey, valores, errores = {}, onChange, disabled }) {
  const seccion = SECCIONES[seccionKey];
  if (!seccion) return null;
  const variosGrupos = seccion.grupos.length > 1;

  return (
    <Box>
      {seccion.grupos.map((g) => {
        const esMMSE = seccion.esMMSE && g.id !== "observaciones";
        return (
          <Box key={g.id} sx={{ mb: variosGrupos ? 2 : 0 }}>
            {g.titulo && variosGrupos && (
              <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
                {g.titulo}
              </Typography>
            )}
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: esMMSE ? { xs: "1fr", sm: "3fr 1fr" } : { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              {g.campos.map((c) => (
                <Box key={c.path} data-campo={c.path} sx={{ gridColumn: c.tipo === "textarea" ? "1 / -1" : "auto" }}>
                  <CampoFormulario
                    campo={c}
                    valor={valores[c.path]}
                    error={errores[c.path]}
                    onChange={onChange}
                    disabled={disabled}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
