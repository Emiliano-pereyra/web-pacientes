"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import FormularioSeccion from "./FormularioSeccion";
import { SECCIONES, setPath } from "@/lib/paciente/schema";
import { resultadoMMSE, valoresDeSeccion } from "@/lib/paciente/logica";
import { api } from "@/lib/cliente/api";
import { enfocarPrimerError, useCambiosSinGuardar } from "@/lib/cliente/formularios";

/** Puntaje total del MMSE calculado con lo que se está cargando (antes de guardar). */
function TotalMMSE({ valores }) {
  const borrador = {};
  Object.entries(valores).forEach(([path, v]) => {
    if (path.endsWith(".puntaje") && v !== "" && v !== null && v !== undefined) setPath(borrador, path, Number(v));
  });
  const r = resultadoMMSE(borrador);
  return (
    <Typography variant="body2" sx={{ mr: "auto", fontVariantNumeric: "tabular-nums" }} aria-live="polite">
      <strong>
        Total: {r.total} / {r.max}
      </strong>{" "}
      <Box component="span" sx={{ color: "text.secondary" }}>
        · {r.completo ? r.interpretacion : `${r.completados} de ${r.itemsTotales} ítems`}
      </Box>
    </Typography>
  );
}

/**
 * Edita una sección del paciente. Se monta con los datos actuales del paciente
 * (el padre lo renderiza solo cuando está abierto, así siempre arranca precargado).
 * Si hay cambios sin guardar, pregunta antes de cerrar.
 */
export default function ModalEditarSeccion({ paciente, seccionKey, onClose, onSaved }) {
  const seccion = SECCIONES[seccionKey];
  const iniciales = useMemo(() => valoresDeSeccion(paciente, seccionKey), [paciente, seccionKey]);
  const [valores, setValores] = useState(iniciales);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const hayCambios = Object.keys(valores).some((k) => (valores[k] ?? "") !== (iniciales[k] ?? ""));
  const pedirCierre = useCambiosSinGuardar(hayCambios && !guardando);

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
      if (cambios) toast.success(`${seccion.titulo}: cambios guardados`);
      else toast.info("No había cambios para guardar");
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

  return (
    <Dialog open onClose={guardando ? undefined : () => pedirCierre(onClose)} maxWidth="md" fullWidth>
      <DialogTitle>Editar · {seccion.titulo}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
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
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        {seccion.esMMSE && <TotalMMSE valores={valores} />}
        <Button onClick={() => pedirCierre(onClose)} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={guardar}
          disabled={guardando}
          startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
