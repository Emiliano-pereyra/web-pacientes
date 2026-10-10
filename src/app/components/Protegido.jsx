"use client";

import { Alert, Box, Button, CircularProgress, Container } from "@mui/material";
import Link from "next/link";
import Barra from "./Barra";
import { useSesion } from "./auth/Sesion";
import { PantallaIngreso, PantallaSinAcceso } from "./auth/PantallaIngreso";

export function Cargando() {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Barra />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress aria-label="Cargando" />
      </Box>
    </Box>
  );
}

/**
 * Muestra el contenido solo a usuarios dados de alta (y con `rol`, solo a ese rol);
 * si no, la pantalla de ingreso o de acceso denegado.
 */
export default function Protegido({ rol, children }) {
  const { estado, usuario } = useSesion();
  if (estado === "cargando") return <Cargando />;
  if (estado === "sinSesion") return <PantallaIngreso />;
  if (estado === "sinAcceso") return <PantallaSinAcceso />;
  if (rol && usuario?.rol !== rol) {
    return (
      <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
        <Barra />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Alert
            severity="warning"
            action={
              <Button component={Link} href="/" color="inherit" size="small">
                Ir a pacientes
              </Button>
            }
          >
            Esta sección es solo para administradores.
          </Alert>
        </Container>
      </Box>
    );
  }
  return children;
}
