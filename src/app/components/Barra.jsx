"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ProfesionalActual from "./ProfesionalActual";
import { useSesion } from "./auth/Sesion";

/** Barra superior común a todas las páginas. Los admins ven el acceso a "Usuarios". */
export default function Barra() {
  const { usuario } = useSesion() || {};
  const ruta = usePathname();
  const esAdmin = usuario?.rol === "admin";

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 60 } }}>
        <Box
          component={Link}
          href="/"
          sx={{ display: "flex", alignItems: "center", gap: 1, color: "inherit", textDecoration: "none" }}
        >
          <LocalHospitalIcon color="primary" aria-hidden />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            Pacientes
          </Typography>
        </Box>
        {esAdmin && (
          <Button
            component={Link}
            href="/usuarios"
            startIcon={<ManageAccountsIcon />}
            aria-current={ruta === "/usuarios" ? "page" : undefined}
            aria-label="Usuarios y registro de accesos"
            sx={{
              color: ruta === "/usuarios" ? "primary.main" : "text.secondary",
              minWidth: { xs: 44, sm: 0 },
              "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1 } },
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Usuarios
            </Box>
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <ProfesionalActual />
      </Toolbar>
    </AppBar>
  );
}
