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
import { MOTIVO_BAJA_MAX, TIPOS_BAJA, etiquetaFallecido, hoyISO, validarBaja } from "@/lib/paciente/logica";

/** Apoderado de la ficha, para precargar a quién se notificó. */
function apoderadoDe(paciente) {
  const f = paciente.familia || {};
  if (!f.apoderadoNombre) return "";
  return f.apoderadoParentesco ? `${f.apoderadoNombre} (${f.apoderadoParentesco})` : f.apoderadoNombre;
}

/**
 * Baja del paciente. Fallecimiento va primero (la mayoría de las bajas en gerontología):
 * pide fecha (obligatoria), hora, lugar, causa y notificación (opcionales, texto libre).
 * Los demás tipos piden el motivo (texto libre, obligatorio). La historia clínica se conserva.
 */
export default function ModalBajaPaciente({ paciente, onClose, onHecho }) {
  const nombre = paciente.datosPersonales?.nombreCompleto || "el paciente";
  const apoderado = apoderadoDe(paciente);
  const inicial = {
    tipo: "fallecimiento",
    fecha: "", // vacía a propósito: se carga a conciencia (no se asume "hoy")
    hora: "",
    lugar: "",
    causa: "",
    notificadoA: apoderado,
    notificadoEn: "",
    institucion: "",
    motivo: "",
  };
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const esFallecimiento = valores.tipo === "fallecimiento";
  const hayCambios = Object.keys(inicial).some((k) => valores[k] !== inicial[k]);
  const pedirCierre = useCambiosSinGuardar(hayCambios && !guardando);

  const cambiar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }));
    if (errores[campo]) setErrores((x) => ({ ...x, [campo]: undefined }));
  };

  const confirmar = async () => {
    setError("");
    const local = validarBaja(valores, paciente);
    if (Object.keys(local.errores).length) {
      setErrores(local.errores);
      enfocarPrimerError(local.errores);
      return;
    }
    setGuardando(true);
    try {
      await api.darDeBaja(paciente.id, valores);
      toast.success(
        esFallecimiento ? `Se registró el fallecimiento de ${nombre}` : `${nombre} quedó dado de baja`,
      );
      onHecho();
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

  const props = (campo, extra = {}) => ({
    name: campo,
    fullWidth: true,
    value: valores[campo],
    onChange: cambiar(campo),
    disabled: guardando,
    error: Boolean(errores[campo]),
    autoComplete: "off",
    ...extra,
    helperText: errores[campo] || extra.helperText || " ",
  });

  return (
    <Dialog open onClose={guardando ? undefined : () => pedirCierre(onClose)} maxWidth="sm" fullWidth>
      <DialogTitle>Dar de baja a {nombre}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            {error}
          </Alert>
        )}

        <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <Box data-campo="tipo" sx={{ gridColumn: "1 / -1" }}>
            <TextField select label="Tipo de baja *" {...props("tipo")}>
              {Object.entries(TIPOS_BAJA).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {esFallecimiento ? (
            <>
              <Box data-campo="fecha">
                <TextField
                  type="date"
                  label="Fecha del fallecimiento *"
                  {...props("fecha")}
                  slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: hoyISO() } }}
                />
              </Box>
              <Box data-campo="hora">
                <TextField
                  type="time"
                  label="Hora (opcional)"
                  {...props("hora")}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <Box data-campo="lugar" sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  label="Lugar (opcional)"
                  {...props("lugar", { helperText: "Por ejemplo: en la residencia, Hospital X, domicilio" })}
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                />
              </Box>
              <Box data-campo="causa" sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  label="Causa (opcional)"
                  multiline
                  minRows={2}
                  {...props("causa", { helperText: "Según el certificado de defunción, si se conoce" })}
                  slotProps={{ htmlInput: { maxLength: MOTIVO_BAJA_MAX } }}
                />
              </Box>
              <Box data-campo="notificadoA">
                <TextField
                  label="Notificado a (opcional)"
                  {...props("notificadoA", { helperText: apoderado ? "Precargado con el apoderado" : "Familiar o apoderado" })}
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                />
              </Box>
              <Box data-campo="notificadoEn">
                <TextField
                  type="date"
                  label="Fecha de la notificación"
                  {...props("notificadoEn")}
                  slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: hoyISO() } }}
                />
              </Box>
              <Box data-campo="motivo" sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  label="Observaciones (opcional)"
                  multiline
                  minRows={2}
                  {...props("motivo")}
                  slotProps={{ htmlInput: { maxLength: MOTIVO_BAJA_MAX } }}
                />
              </Box>
            </>
          ) : (
            <>
              {valores.tipo === "traslado" && (
                <Box data-campo="institucion" sx={{ gridColumn: "1 / -1" }}>
                  <TextField
                    label="Institución de destino (opcional)"
                    {...props("institucion")}
                    slotProps={{ htmlInput: { maxLength: 200 } }}
                  />
                </Box>
              )}
              <Box data-campo="motivo" sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  label="Motivo *"
                  multiline
                  minRows={3}
                  {...props("motivo", { helperText: `Texto libre · ${valores.motivo.length} / ${MOTIVO_BAJA_MAX}` })}
                  slotProps={{ htmlInput: { maxLength: MOTIVO_BAJA_MAX } }}
                />
              </Box>
            </>
          )}
        </Box>

        <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
          La historia clínica no se borra: queda guardada y se puede ver e imprimir, pero no modificar.
          {esFallecimiento
            ? " Si se cargó por error, solo un administrador puede anularla."
            : " Se puede reactivar si el paciente reingresa."}
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={() => pedirCierre(onClose)} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color={esFallecimiento ? "secondary" : "error"}
          onClick={confirmar}
          disabled={guardando}
          startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {guardando
            ? "Guardando…"
            : esFallecimiento
              ? `Registrar como ${etiquetaFallecido(paciente.datosPersonales?.genero).toLowerCase()}`
              : "Dar de baja"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
