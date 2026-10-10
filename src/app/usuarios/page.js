"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Container, Paper, Tab, Tabs, Typography } from "@mui/material";
import Barra from "../components/Barra";
import Protegido from "../components/Protegido";
import GestionUsuarios from "../components/admin/GestionUsuarios";
import RegistroAccesos from "../components/admin/RegistroAccesos";
import { api } from "@/lib/cliente/api";

function Administracion() {
  const [tab, setTab] = useState(0);
  const [usuarios, setUsuarios] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setUsuarios(await api.listarUsuarios());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial (cargando arranca en true)
  useEffect(() => {
    let vigente = true;
    api
      .listarUsuarios()
      .then((l) => vigente && setUsuarios(l))
      .catch((e) => vigente && setError(e.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Barra />
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Administración
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Usuarios" />
            <Tab label="Registro de accesos" />
          </Tabs>
        </Box>

        {tab === 0 && <GestionUsuarios usuarios={usuarios} cargando={cargando} error={error} onRecargar={recargar} />}

        {tab === 1 && (
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Quién abrió, imprimió o modificó historias clínicas, y los cambios de usuarios. Nadie puede editar ni
              borrar este registro desde la app.
            </Typography>
            <RegistroAccesos usuarios={usuarios || []} />
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default function PaginaUsuarios() {
  return (
    <Protegido rol="admin">
      <Administracion />
    </Protegido>
  );
}
