"use client";

import { useState } from "react";
import { Avatar, Box, Button, ButtonBase, Paper, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { fallecio, formatearFecha, mostrar } from "@/lib/paciente/logica";

function iniciales(nombre) {
  if (!nombre) return "?";
  const p = nombre.trim().split(/\s+/);
  return (p.length >= 2 ? p[0][0] + p[p.length - 1][0] : nombre.slice(0, 2)).toUpperCase();
}

/**
 * Datos personales y acciones del paciente (iguales en todas las pestañas).
 * Es la única vista de los datos personales: se editan con "Editar datos".
 * Tocar la foto abre la galería.
 */
export default function EncabezadoPaciente({ paciente, acciones, onAbrirGaleria, onEditarDatos }) {
  const [fotoError, setFotoError] = useState(false);
  const dp = paciente.datosPersonales || {};
  const conFoto = paciente.urlFoto && !fotoError;
  const nombre = mostrar(dp.nombreCompleto, "Sin nombre");
  const edad = paciente.derivados?.edad;

  const datos = [
    ["DNI", mostrar(dp.dni)],
    [fallecio(paciente) ? "Edad al fallecer" : "Edad", /^\d+$/.test(edad || "") ? `${edad} años` : mostrar(edad)],
    ["Nacimiento", mostrar(formatearFecha(dp.fechaNacimiento))],
    ["Género", mostrar(dp.genero)],
    ["Obra social", mostrar(dp.obraSocial)],
    ["N.º de afiliado", mostrar(dp.afiliadoNumero)],
    ["Ingreso", mostrar(formatearFecha(dp.fechaIngreso))],
  ];

  const avatar = (
    <Avatar
      src={conFoto ? paciente.urlFoto : undefined}
      alt={dp.nombreCompleto || "Paciente"}
      onError={() => setFotoError(true)}
      sx={{
        width: { xs: 52, sm: 64 },
        height: { xs: 52, sm: 64 },
        fontSize: { xs: 20, sm: 24 },
        bgcolor: conFoto ? undefined : "primary.main",
      }}
    >
      {!conFoto && iniciales(dp.nombreCompleto)}
    </Avatar>
  );

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, mb: 2 }}>
      {/* Foto + nombre (+ editar) */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        {onAbrirGaleria ? (
          <Tooltip title="Ver fotos y archivos">
            <ButtonBase
              onClick={onAbrirGaleria}
              aria-label={`Ver fotos y archivos de ${nombre}`}
              sx={{
                borderRadius: "50%",
                flexShrink: 0,
                "&:focus-visible": { outline: 2, outlineColor: "primary.main", outlineOffset: 2 },
              }}
            >
              {avatar}
            </ButtonBase>
          </Tooltip>
        ) : (
          avatar
        )}
        <Typography variant="h5" component="h1" sx={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>
          {nombre}
        </Typography>
        {onEditarDatos && (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={onEditarDatos}
            aria-label="Editar datos personales"
            sx={{ flexShrink: 0, minWidth: { xs: 44, sm: 0 }, "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1 } } }}
          >
            {/* En el celular queda solo el ícono para dejarle lugar al nombre */}
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Editar datos
            </Box>
          </Button>
        )}
      </Box>

      {/* Datos personales: usan todo el ancho, también en el celular */}
      <Box
        component="dl"
        sx={{
          m: 0,
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" },
          columnGap: 3,
          rowGap: 1.25,
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

      {acciones && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            "& > .MuiButton-root": { flex: { xs: "1 1 auto", sm: "0 0 auto" } },
          }}
        >
          {acciones}
        </Box>
      )}
    </Paper>
  );
}
