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
  TextField,
} from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import RestoreIcon from "@mui/icons-material/Restore";
import { toast } from "sonner";
import { api } from "@/lib/cliente/api";
import { useConfirmar } from "../ui/Confirmacion";
import { MOTIVO_BAJA_MIN, formatearFecha, formatearFechaHora, resumenBaja } from "@/lib/paciente/logica";

/** Anulación de una baja por fallecimiento cargada por error (solo admins, con motivo). */
function ModalAnular({ paciente, onClose, onHecho }) {
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const anular = async () => {
    if (motivo.trim().length < MOTIVO_BAJA_MIN) {
      setError("Indicá por qué se anula la baja");
      return;
    }
    setGuardando(true);
    try {
      await api.reactivar(paciente.id, motivo);
      toast.success("Se anuló la baja por fallecimiento");
      onHecho();
    } catch (e) {
      setError(e.detalles?.motivo || e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open onClose={guardando ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Anular la baja por fallecimiento</DialogTitle>
      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Usalo solo si el fallecimiento se cargó por error. La anulación y su motivo quedan en el historial y en el
          registro de accesos.
        </Alert>
        <TextField
          label="Motivo de la anulación *"
          multiline
          minRows={3}
          fullWidth
          autoFocus
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value);
            if (error) setError("");
          }}
          disabled={guardando}
          error={Boolean(error)}
          helperText={error || "Por ejemplo: se cargó en el paciente equivocado"}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={anular}
          disabled={guardando}
          startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {guardando ? "Anulando…" : "Anular baja"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Aviso de paciente dado de baja en la ficha.
 * Fallecimiento: tono neutro, datos del fallecimiento; solo un admin puede anularlo.
 * Otros tipos: se puede reactivar (el paciente reingresa).
 */
export default function AvisoBaja({ paciente, esAdmin, onCambio }) {
  const confirmar = useConfirmar();
  const [anulando, setAnulando] = useState(false);
  const b = paciente.baja || {};
  const genero = paciente.datosPersonales?.genero;
  const nombre = paciente.datosPersonales?.nombreCompleto || "el paciente";
  const esFallecimiento = b.tipo === "fallecimiento";
  const f = b.fallecimiento || {};

  const reactivar = async () => {
    const ok = await confirmar({
      titulo: `¿Reactivar a ${nombre}?`,
      mensaje: "Vuelve a la lista de pacientes y se puede volver a editar. La baja anterior queda en el historial.",
      confirmar: "Reactivar",
    });
    if (!ok) return;
    try {
      await api.reactivar(paciente.id);
      toast.success(`${nombre} fue reactivado`);
      onCambio();
    } catch (e) {
      toast.error("No se pudo reactivar", { description: e.message });
    }
  };

  const accion = esFallecimiento ? (
    esAdmin && (
      <Button color="inherit" size="small" onClick={() => setAnulando(true)}>
        Anular (error de carga)
      </Button>
    )
  ) : (
    <Button color="inherit" size="small" startIcon={<RestoreIcon />} onClick={reactivar}>
      Reactivar
    </Button>
  );

  return (
    <>
      <Alert
        severity={esFallecimiento ? "info" : "warning"}
        icon={esFallecimiento ? false : <PersonOffIcon />}
        sx={{
          mb: 2,
          ...(esFallecimiento && { bgcolor: "grey.100", color: "text.primary", border: 1, borderColor: "divider" }),
        }}
        action={accion || undefined}
      >
        <Box component="span" sx={{ display: "block", fontWeight: 600 }}>
          {esFallecimiento ? resumenBaja(b, genero) : `Paciente dado de baja · ${resumenBaja(b, genero)}`}
        </Box>
        {esFallecimiento && (
          <Box component="span" sx={{ display: "block", mt: 0.5, overflowWrap: "anywhere" }}>
            {f.causa && <Box component="span" sx={{ display: "block" }}>Causa: {f.causa}</Box>}
            {f.notificadoA && (
              <Box component="span" sx={{ display: "block" }}>
                Notificado a {f.notificadoA}
                {f.notificadoEn ? ` el ${formatearFecha(f.notificadoEn)}` : ""}
              </Box>
            )}
            {b.motivo && <Box component="span" sx={{ display: "block", whiteSpace: "pre-wrap" }}>{b.motivo}</Box>}
          </Box>
        )}
        <Box component="span" sx={{ display: "block", mt: 0.5, color: "text.secondary", fontSize: "0.85em" }}>
          Registrado el {formatearFechaHora(b.fecha)}
          {b.profesional ? ` por ${b.profesional}` : ""}. La historia clínica se puede ver e imprimir, pero no
          modificar.
        </Box>
      </Alert>

      {anulando && (
        <ModalAnular
          paciente={paciente}
          onClose={() => setAnulando(false)}
          onHecho={() => {
            setAnulando(false);
            onCambio();
          }}
        />
      )}
    </>
  );
}

