"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import RegistroAccesos from "./RegistroAccesos";

/** Quién vio, imprimió o modificó la historia clínica de un paciente (solo admins). */
export default function ModalAccesosPaciente({ pacienteId, patientName, onClose }) {
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>
        Accesos · {patientName}
        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: "block" }}>
          Quién abrió, imprimió o modificó esta historia clínica.
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ overscrollBehavior: "contain" }}>
        <RegistroAccesos pacienteId={pacienteId} />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
