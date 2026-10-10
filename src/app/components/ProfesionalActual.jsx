"use client";

import { Box, Button, Chip, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { ROLES, etiquetaProfesional } from "@/lib/usuarios";
import { useSesion } from "./auth/Sesion";

/**
 * Usuario que inició sesión. Es quien queda registrado en el historial de
 * cambios, las evoluciones y las fotos. Una secretaria/o muestra su profesional,
 * que es quien figura en los PDF.
 */
export default function ProfesionalActual() {
  const { usuario, salir } = useSesion() || {};
  if (!usuario) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {usuario.nombre}
        </Typography>
        {usuario.rol === "secretaria" ? (
          <Typography variant="caption" color="text.secondary">
            de {etiquetaProfesional(usuario.responsable)}
          </Typography>
        ) : (
          usuario.matricula && (
            <Typography variant="caption" color="text.secondary">
              Mat. {usuario.matricula}
            </Typography>
          )
        )}
      </Box>
      <Chip size="small" label={ROLES[usuario.rol] || usuario.rol} color={usuario.rol === "admin" ? "secondary" : "default"} />
      <Button size="small" startIcon={<LogoutIcon />} onClick={salir}>
        Salir
      </Button>
    </Box>
  );
}
