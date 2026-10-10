"use client";

import { useState } from "react";
import { Avatar, Box, ButtonBase, Paper, Tooltip, Typography } from "@mui/material";
import { formatearFecha, mostrar } from "@/lib/paciente/logica";

function iniciales(nombre) {
  if (!nombre) return "?";
  const p = nombre.trim().split(/\s+/);
  return (p.length >= 2 ? p[0][0] + p[p.length - 1][0] : nombre.slice(0, 2)).toUpperCase();
}

/**
 * Datos personales resumidos y acciones del paciente (iguales en todas las pestañas).
 * Tocar la foto abre la galería.
 */
export default function EncabezadoPaciente({ paciente, acciones, onAbrirGaleria }) {
  const [fotoError, setFotoError] = useState(false);
  const dp = paciente.datosPersonales || {};
  const conFoto = paciente.urlFoto && !fotoError;
  const nombre = mostrar(dp.nombreCompleto, "Sin nombre");

  const edad = paciente.derivados?.edad;
  const datos = [
    ["DNI", mostrar(dp.dni)],
    ["Edad", /^\d+$/.test(edad || "") ? `${edad} años` : mostrar(edad)],
    ["Nacimiento", mostrar(formatearFecha(dp.fechaNacimiento))],
    ["Género", mostrar(dp.genero)],
    ["Obra social", mostrar(dp.obraSocial)],
    ["N.º afiliado", mostrar(dp.afiliadoNumero)],
    ["Ingreso", mostrar(formatearFecha(dp.fechaIngreso))],
  ];

  const avatar = (
    <Avatar
      src={conFoto ? paciente.urlFoto : undefined}
      alt={dp.nombreCompleto || "Paciente"}
      onError={() => setFotoError(true)}
      sx={{ width: 64, height: 64, fontSize: 24, bgcolor: conFoto ? undefined : "primary.main" }}
    >
      {!conFoto && iniciales(dp.nombreCompleto)}
    </Avatar>
  );

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, mb: 2 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: { xs: "wrap", md: "nowrap" } }}>
        {onAbrirGaleria ? (
          <Tooltip title="Ver galería de fotos">
            <ButtonBase
              onClick={onAbrirGaleria}
              aria-label={`Ver galería de fotos de ${nombre}`}
              sx={{ borderRadius: "50%", flexShrink: 0, "&:focus-visible": { outline: 2, outlineColor: "primary.main", outlineOffset: 2 } }}
            >
              {avatar}
            </ButtonBase>
          </Tooltip>
        ) : (
          avatar
        )}

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h5" component="h1" sx={{ mb: 1, overflowWrap: "anywhere" }}>
            {nombre}
          </Typography>
          <Box
            component="dl"
            sx={{
              m: 0,
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" },
              columnGap: 3,
              rowGap: 1,
            }}
          >
            {datos.map(([k, v]) => (
              <Box key={k} sx={{ minWidth: 0 }}>
                <Typography component="dt" variant="caption" color="text.secondary">
                  {k}
                </Typography>
                <Typography
                  component="dd"
                  variant="body2"
                  sx={{ m: 0, fontWeight: 500, fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}
                >
                  {v}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {acciones && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" },
              flexShrink: 0,
            }}
          >
            {acciones}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
