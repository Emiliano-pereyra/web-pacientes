"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { auth } from "@/lib/firebase";
import { estadoCierreDiario } from "@/lib/cliente/cierreDiario";
import { useSesion } from "./Sesion";

const REVISAR_CADA_MS = 30_000;

/** Cuándo se inició la sesión: el último ingreso real (Firebase lo comparte entre pestañas). */
function inicioDeSesion() {
  return Date.parse(auth.currentUser?.metadata?.lastSignInTime ?? "") || Date.now();
}

/**
 * Cierra las sesiones al terminar el día (medianoche del dispositivo). Unos minutos antes
 * avisa para que se guarde lo pendiente; el aviso se puede cerrar pero el cierre no se evita.
 * Una sesión que quedó abierta de un día para otro se cierra apenas se vuelve a la app.
 */
export default function ControlCierreDiario() {
  const { estado, salir } = useSesion();
  // Se monta de nuevo en cada sesión: el aviso descartado no pasa a la siguiente
  return estado === "lista" ? <Vigilante salir={salir} /> : null;
}

function Vigilante({ salir }) {
  const [aviso, setAviso] = useState(null); // minutos restantes, o null
  const [descartado, setDescartado] = useState(false);

  useEffect(() => {
    const inicio = inicioDeSesion();
    let cerrando = false;

    const revisar = () => {
      if (cerrando) return;
      const { fase, minutosRestantes } = estadoCierreDiario(inicio, Date.now());
      if (fase === "expirado") {
        cerrando = true;
        setAviso(null);
        salir("Tu sesión se cerró al terminar el día. Volvé a ingresar para continuar.");
      } else {
        setAviso(fase === "aviso" ? minutosRestantes : null);
      }
    };

    const primera = setTimeout(revisar, 0); // una sesión de ayer se cierra apenas se abre la app
    document.addEventListener("visibilitychange", revisar);
    const intervalo = setInterval(revisar, REVISAR_CADA_MS);
    return () => {
      clearTimeout(primera);
      document.removeEventListener("visibilitychange", revisar);
      clearInterval(intervalo);
    };
  }, [salir]);

  if (aviso === null || descartado) return null;

  return (
    <Dialog open maxWidth="xs" fullWidth aria-labelledby="titulo-cierre-diario">
      <DialogTitle id="titulo-cierre-diario">La sesión se cierra a la medianoche</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Para proteger las historias clínicas, las sesiones se cierran al terminar el día. Faltan{" "}
          <strong>
            {aviso} {aviso === 1 ? "minuto" : "minutos"}
          </strong>
          : guardá lo que estés haciendo. Después vas a tener que volver a ingresar.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={() => setDescartado(true)} autoFocus>
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
}
