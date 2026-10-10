"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { enfocarPrimerError, useCambiosSinGuardar } from "@/lib/cliente/formularios";
import FormularioSeccion from "./paciente/FormularioSeccion";
import { SECCIONES, SECCIONES_ALTA, camposDeSeccion } from "@/lib/paciente/schema";
import { hoyISO } from "@/lib/paciente/logica";
import { api } from "@/lib/cliente/api";

const MAX_FOTO = 5 * 1024 * 1024;

export default function ModalCrearPaciente({ open, onClose, onCreateSuccess }) {
  const [tab, setTab] = useState(0);
  const [valores, setValores] = useState({ "datosPersonales.fechaIngreso": hoyISO() });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const onChange = (path, valor) => {
    setValores((prev) => ({ ...prev, [path]: valor }));
    if (errores[path]) setErrores((prev) => ({ ...prev, [path]: undefined }));
  };

  const elegirFoto = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setError("El archivo seleccionado no es una imagen.");
    if (f.size > MAX_FOTO) return setError("La imagen supera el límite de 5 MB.");
    setError("");
    setFoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const mostrarErrores = (detalles) => {
    setErrores(detalles);
    // ir a la primera pestaña con errores y enfocar el campo
    const idx = SECCIONES_ALTA.findIndex((key) => camposDeSeccion(key).some((c) => detalles[c.path]));
    if (idx >= 0) setTab(idx);
    enfocarPrimerError(detalles);
  };

  const guardar = async () => {
    setError("");
    if (!valores["datosPersonales.nombreCompleto"]?.trim()) {
      setError("Revisá los campos marcados en rojo.");
      mostrarErrores({ "datosPersonales.nombreCompleto": "El nombre completo es obligatorio" });
      return;
    }
    setGuardando(true);
    try {
      const fd = new FormData();
      fd.append("datos", JSON.stringify(valores));
      if (foto) fd.append("file", foto);
      const { id } = await api.crearPaciente(fd);
      await onCreateSuccess(id);
    } catch (e) {
      setError(e.detalles ? "Revisá los campos marcados en rojo." : e.message);
      if (e.detalles) mostrarErrores(e.detalles);
    } finally {
      setGuardando(false);
    }
  };

  const hayCambios =
    Boolean(foto) || Object.entries(valores).some(([k, v]) => k !== "datosPersonales.fechaIngreso" && (v ?? "") !== "");
  const pedirCierre = useCambiosSinGuardar(hayCambios && !guardando);

  const seccionActual = SECCIONES_ALTA[tab];
  const conError = (key) => camposDeSeccion(key).some((c) => errores[c.path]);

  return (
    <Dialog open={open} onClose={guardando ? undefined : () => pedirCierre(onClose)} maxWidth="md" fullWidth>
      <DialogTitle>Nuevo paciente</DialogTitle>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" sx={{ px: 2 }}>
        {SECCIONES_ALTA.map((key) => (
          <Tab
            key={key}
            label={SECCIONES[key].titulo}
            icon={conError(key) ? <ErrorOutlineIcon fontSize="small" aria-label="Tiene errores" /> : undefined}
            iconPosition="end"
            sx={conError(key) ? { color: "error.main" } : undefined}
          />
        ))}
      </Tabs>
      <DialogContent dividers sx={{ minHeight: 420 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            {error}
          </Alert>
        )}

        {seccionActual === "datosPersonales" ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar src={preview || undefined} alt="Foto del paciente" sx={{ width: 72, height: 72 }} />
            <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />} disabled={guardando}>
              {foto ? "Cambiar foto" : "Agregar foto"}
              <input hidden type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={elegirFoto} />
            </Button>
            {foto && (
              <Button
                color="error"
                onClick={() => {
                  setFoto(null);
                  setPreview(null);
                }}
                disabled={guardando}
              >
                Quitar
              </Button>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Opcional: se puede completar ahora o más tarde desde la ficha del paciente.
          </Typography>
        )}

        <FormularioSeccion
          seccionKey={seccionActual}
          valores={valores}
          errores={errores}
          onChange={onChange}
          disabled={guardando}
        />
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
          {guardando ? "Creando…" : "Crear paciente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
