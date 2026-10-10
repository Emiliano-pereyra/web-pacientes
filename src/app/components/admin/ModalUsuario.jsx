"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { toast } from "sonner";
import { api } from "@/lib/cliente/api";
import { enfocarPrimerError, useCambiosSinGuardar } from "@/lib/cliente/formularios";
import { ROLES, admiteMatricula, etiquetaProfesional, requiereMatricula, requiereProfesional } from "@/lib/usuarios";

const AYUDA_ROL = {
  admin: "Todo, incluida la gestión de usuarios. Matrícula opcional.",
  profesional: "Ve y edita pacientes, evoluciones, fotos e imprime. Matrícula obligatoria.",
  secretaria: "Los mismos permisos que un profesional. Lo que imprime sale a nombre de su profesional.",
};

/** Alta (sin `usuario`) o edición de un usuario. */
export default function ModalUsuario({ usuario, profesionales, onClose, onGuardado }) {
  const esAlta = !usuario;
  const inicial = {
    email: usuario?.email || "",
    nombre: usuario?.nombre || "",
    rol: usuario?.rol || "profesional",
    matricula: usuario?.matricula || "",
    profesionalUid: usuario?.profesionalUid || "",
  };
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const hayCambios = Object.keys(inicial).some((k) => valores[k] !== inicial[k]);
  const pedirCierre = useCambiosSinGuardar(hayCambios && !guardando);

  const cambiar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }));
    if (errores[campo]) setErrores((x) => ({ ...x, [campo]: undefined }));
  };

  const guardar = async () => {
    setGuardando(true);
    setError("");
    const datos = {
      nombre: valores.nombre,
      rol: valores.rol,
      matricula: admiteMatricula(valores.rol) ? valores.matricula : "",
      profesionalUid: requiereProfesional(valores.rol) ? valores.profesionalUid : "",
    };
    try {
      if (esAlta) {
        await api.crearUsuario({ ...datos, email: valores.email });
        toast.success("Usuario creado", {
          description: "Entra con Google o eligiendo su contraseña con «Crear o recuperar mi contraseña».",
        });
      } else {
        await api.actualizarUsuario(usuario.uid, datos);
        toast.success("Usuario actualizado");
      }
      onGuardado();
    } catch (e) {
      setError(e.detalles ? "Revisá los campos marcados en rojo." : e.message);
      if (e.detalles) {
        setErrores(e.detalles);
        enfocarPrimerError(e.detalles);
      }
    } finally {
      setGuardando(false);
    }
  };

  const opcionesProfesional = profesionales.filter((p) => p.activo || p.uid === valores.profesionalUid);

  return (
    <Dialog open onClose={guardando ? undefined : () => pedirCierre(onClose)} maxWidth="sm" fullWidth>
      <DialogTitle>{esAlta ? "Nuevo usuario" : `Editar · ${usuario.nombre}`}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            {error}
          </Alert>
        )}
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box data-campo="email">
            <TextField
              label="Email *"
              type="email"
              name="email"
              fullWidth
              value={valores.email}
              onChange={cambiar("email")}
              disabled={!esAlta || guardando}
              error={Boolean(errores.email)}
              helperText={errores.email || (esAlta ? "Con este email inicia sesión" : "El email no se puede cambiar")}
              slotProps={{ htmlInput: { spellCheck: false, autoCapitalize: "none", autoComplete: "off" } }}
            />
          </Box>
          <Box data-campo="nombre">
            <TextField
              label="Nombre y apellido *"
              name="nombre"
              fullWidth
              value={valores.nombre}
              onChange={cambiar("nombre")}
              disabled={guardando}
              error={Boolean(errores.nombre)}
              helperText={errores.nombre || " "}
              autoComplete="off"
            />
          </Box>
          <Box data-campo="rol">
            <TextField
              select
              label="Rol *"
              name="rol"
              fullWidth
              value={valores.rol}
              onChange={cambiar("rol")}
              disabled={guardando}
              error={Boolean(errores.rol)}
              helperText={errores.rol || AYUDA_ROL[valores.rol]}
            >
              {Object.entries(ROLES).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {admiteMatricula(valores.rol) && (
            <Box data-campo="matricula">
              <TextField
                label={`Matrícula${requiereMatricula(valores.rol) ? " *" : " (opcional)"}`}
                name="matricula"
                fullWidth
                value={valores.matricula}
                onChange={cambiar("matricula")}
                disabled={guardando}
                error={Boolean(errores.matricula)}
                helperText={errores.matricula || "Tal como debe salir impresa, por ejemplo: MN 12345 MP 6789"}
                autoComplete="off"
              />
            </Box>
          )}
          {requiereProfesional(valores.rol) && (
            <Box data-campo="profesionalUid">
              <TextField
                select
                label="Profesional *"
                name="profesionalUid"
                fullWidth
                value={valores.profesionalUid}
                onChange={cambiar("profesionalUid")}
                disabled={guardando}
                error={Boolean(errores.profesionalUid)}
                helperText={
                  errores.profesionalUid ||
                  (opcionesProfesional.length
                    ? "Los documentos que imprima saldrán a nombre de este profesional"
                    : "Primero hay que dar de alta un profesional")
                }
              >
                {opcionesProfesional.map((p) => (
                  <MenuItem key={p.uid} value={p.uid} disabled={!p.activo}>
                    {etiquetaProfesional(p)}
                    {!p.activo ? " (desactivado)" : ""}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={() => pedirCierre(onClose)} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={guardar}
          disabled={guardando}
          startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {guardando ? "Guardando…" : esAlta ? "Crear usuario" : "Guardar cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
