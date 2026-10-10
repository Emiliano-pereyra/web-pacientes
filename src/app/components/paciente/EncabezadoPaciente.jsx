"use client";

import { useState } from "react";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import { formatearFecha, mostrar } from "@/lib/paciente/logica";

function iniciales(nombre) {
  if (!nombre) return "?";
  const p = nombre.trim().split(/\s+/);
  return (p.length >= 2 ? p[0][0] + p[p.length - 1][0] : nombre.slice(0, 2)).toUpperCase();
}

/** Datos personales resumidos, iguales en todas las pestañas. */
export default function EncabezadoPaciente({ paciente }) {
  const [fotoError, setFotoError] = useState(false);
  const dp = paciente.datosPersonales || {};
  const conFoto = paciente.urlFoto && !fotoError;

  const datos = [
    ["DNI", mostrar(dp.dni)],
    ["Edad", mostrar(paciente.derivados?.edad)],
    ["Nacimiento", mostrar(formatearFecha(dp.fechaNacimiento))],
    ["Género", mostrar(dp.genero)],
    ["Obra social", mostrar(dp.obraSocial)],
    ["N° afiliado", mostrar(dp.afiliadoNumero)],
    ["Ingreso", mostrar(formatearFecha(dp.fechaIngreso))],
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, display: "flex", gap: 2.5, alignItems: "center" }}>
      <Avatar
        src={conFoto ? paciente.urlFoto : undefined}
        alt={dp.nombreCompleto || "Paciente"}
        onError={() => setFotoError(true)}
        sx={{ width: 72, height: 72, fontSize: 28, bgcolor: conFoto ? undefined : "primary.main" }}
      >
        {!conFoto && iniciales(dp.nombreCompleto)}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {mostrar(dp.nombreCompleto, "Sin nombre")}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 3, rowGap: 0.5 }}>
          {datos.map(([k, v]) => (
            <Typography key={k} variant="body2">
              <Box component="span" sx={{ color: "text.secondary" }}>
                {k}:
              </Box>{" "}
              {v}
            </Typography>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
