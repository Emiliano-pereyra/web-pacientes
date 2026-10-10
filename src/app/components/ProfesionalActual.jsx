"use client";

import { useState, useSyncExternalStore } from "react";
import { InputAdornment, TextField } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import { getProfesional, setProfesional } from "@/lib/cliente/api";

/**
 * Nombre de quien está usando el sistema. Se guarda en el navegador y se
 * registra en el historial de cambios y en las evoluciones.
 * Provisorio: cuando haya login se toma del usuario autenticado.
 */
export default function ProfesionalActual() {
  // valor guardado en el navegador ("" durante el render del servidor)
  const guardado = useSyncExternalStore(
    () => () => {},
    getProfesional,
    () => "",
  );
  const [editando, setEditando] = useState(null);
  const valor = editando ?? guardado;

  return (
    <TextField
      size="small"
      placeholder="Profesional"
      value={valor}
      onChange={(e) => setEditando(e.target.value)}
      onBlur={() => {
        if (editando !== null) setProfesional(editando);
        setEditando(null);
      }}
      sx={{ width: 220, bgcolor: "background.paper" }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <BadgeIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
