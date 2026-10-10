"use client";

import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toast } from "sonner";
import { api } from "@/lib/cliente/api";
import { ROLES, requiereMatricula } from "@/lib/usuarios";
import { useConfirmar } from "../ui/Confirmacion";
import { useSesion } from "../auth/Sesion";
import ModalUsuario from "./ModalUsuario";

const COLOR_ROL = { admin: "secondary", profesional: "primary", secretaria: "default" };

function iniciales(nombre) {
  const p = String(nombre || "?").trim().split(/\s+/);
  return (p.length >= 2 ? p[0][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase();
}

/** Lista de usuarios con alta, edición y activación (solo admins). */
export default function GestionUsuarios({ usuarios, cargando, error, onRecargar }) {
  const { usuario: yo } = useSesion();
  const confirmar = useConfirmar();
  const [editando, setEditando] = useState(null); // null | "nuevo" | usuario
  const [cambiando, setCambiando] = useState(null);

  const profesionales = (usuarios || []).filter((u) => requiereMatricula(u.rol));

  const cambiarActivo = async (u) => {
    const activar = !u.activo;
    if (
      !activar &&
      !(await confirmar({
        titulo: `¿Desactivar a ${u.nombre}?`,
        mensaje: "No va a poder entrar al sistema. No se borra nada: se puede volver a activar cuando quieras.",
        confirmar: "Desactivar",
        peligro: true,
      }))
    ) {
      return;
    }
    setCambiando(u.uid);
    try {
      await api.actualizarUsuario(u.uid, { activo: activar });
      toast.success(`${u.nombre} ${activar ? "activado" : "desactivado"}`);
      onRecargar();
    } catch (e) {
      toast.error("No se pudo cambiar el estado", { description: e.message });
    } finally {
      setCambiando(null);
    }
  };

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: 160 }}>
          <Typography variant="h6" component="h2">
            Usuarios
          </Typography>
          {usuarios && (
            <Typography variant="body2" color="text.secondary">
              {usuarios.filter((u) => u.activo).length} activos de {usuarios.length}
            </Typography>
          )}
        </Box>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setEditando("nuevo")}>
          Nuevo usuario
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mx: 2.5, mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onRecargar}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {cargando && !usuarios && (
        <Box sx={{ px: 2.5, pb: 2 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} height={64} />
          ))}
        </Box>
      )}

      {usuarios && (
        <List disablePadding sx={{ borderTop: 1, borderColor: "divider" }}>
          {usuarios.map((u) => {
            const soyYo = u.uid === yo?.uid;
            const detalle =
              u.rol === "secretaria"
                ? u.profesionalNombre
                  ? `de ${u.profesionalNombre}`
                  : "Sin profesional asignado"
                : u.matricula
                  ? `Mat. ${u.matricula}`
                  : "";
            return (
              <ListItem
                key={u.uid}
                divider
                sx={{ px: { xs: 2, sm: 2.5 }, opacity: u.activo ? 1 : 0.6, gap: 1 }}
                secondaryAction={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Tooltip title={soyYo ? "No podés desactivar tu propio usuario" : u.activo ? "Desactivar" : "Activar"}>
                      <span>
                        <Switch
                          checked={u.activo}
                          onChange={() => cambiarActivo(u)}
                          disabled={soyYo || cambiando === u.uid}
                          slotProps={{ input: { "aria-label": `${u.activo ? "Desactivar" : "Activar"} a ${u.nombre}` } }}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => setEditando(u)} aria-label={`Editar a ${u.nombre}`}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.light", color: "primary.dark", fontSize: 15, fontWeight: 600 }}>
                    {iniciales(u.nombre)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ pr: 12 }}
                  primary={
                    <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Box component="span" sx={{ fontWeight: 500, overflowWrap: "anywhere" }}>
                        {u.nombre}
                        {soyYo ? " (vos)" : ""}
                      </Box>
                      <Chip size="small" label={ROLES[u.rol] || u.rol} color={COLOR_ROL[u.rol] || "default"} />
                      {!u.activo && <Chip size="small" variant="outlined" label="Inactivo" />}
                    </Box>
                  }
                  secondary={
                    <>
                      <Box component="span" sx={{ display: "block", overflowWrap: "anywhere" }}>
                        {u.email}
                      </Box>
                      {detalle && (
                        <Box
                          component="span"
                          sx={{ display: "block", color: u.rol === "secretaria" && !u.profesionalNombre ? "error.main" : undefined }}
                        >
                          {detalle}
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}

      {editando && (
        <ModalUsuario
          usuario={editando === "nuevo" ? null : editando}
          profesionales={profesionales}
          onClose={() => setEditando(null)}
          onGuardado={() => {
            setEditando(null);
            onRecargar();
          }}
        />
      )}
    </Paper>
  );
}
