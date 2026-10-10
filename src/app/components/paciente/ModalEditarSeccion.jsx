"use client";

import { useState } from "react";
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import FormularioSeccion from "./FormularioSeccion";
import { SECCIONES } from "@/lib/paciente/schema";
import { valoresDeSeccion } from "@/lib/paciente/logica";
import { api } from "@/lib/cliente/api";

/**
 * Edita una sección del paciente. Se monta con los datos actuales del paciente
 * (el padre lo renderiza solo cuando está abierto, así siempre arranca precargado).
 */
export default function ModalEditarSeccion({ paciente, seccionKey, onClose, onSaved }) {
  const seccion = SECCIONES[seccionKey];
  const [valores, setValores] = useState(() => valoresDeSeccion(paciente, seccionKey));
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const onChange = (path, valor) => {
    setValores((prev) => ({ ...prev, [path]: valor }));
    if (errores[path]) setErrores((prev) => ({ ...prev, [path]: undefined }));
  };

  const guardar = async () => {
    setGuardando(true);
    setError("");
    try {
      const { cambios, paciente: actualizado } = await api.actualizarSeccion(paciente.id, seccionKey, valores);
      onSaved?.(actualizado);
      onClose();
      Swal.fire({
        icon: "success",
        title: cambios ? "Cambios guardados" : "Sin cambios",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (e) {
      setError(e.message);
      if (e.detalles) setErrores(e.detalles);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open onClose={guardando ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar {seccion.titulo.toLowerCase()}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <FormularioSeccion
          seccionKey={seccionKey}
          valores={valores}
          errores={errores}
          onChange={onChange}
          disabled={guardando}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={guardando}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={guardar} disabled={guardando}>
          {guardando ? <CircularProgress size={22} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
