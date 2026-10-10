"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { MINUTOS_INACTIVIDAD, estadoInactividad } from "@/lib/cliente/inactividad";
import { useSesion } from "./Sesion";

// Última actividad compartida entre pestañas: usar la app en una mantiene vivas las otras
const CLAVE = "webpacientes.ultimaActividad";
const ESCRIBIR_CADA_MS = 10_000;
const EVENTOS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll", "mousemove"];

function leerCompartida() {
  try {
    return Number(localStorage.getItem(CLAVE)) || 0;
  } catch {
    return 0;
  }
}

function escribirCompartida(t) {
  try {
    localStorage.setItem(CLAVE, String(t));
  } catch {
    /* sin storage: cada pestaña lleva su propia cuenta */
  }
}

/**
 * Vigila la actividad mientras hay sesión. A los MINUTOS_INACTIVIDAD sin uso muestra un
 * aviso con cuenta regresiva; si nadie responde, cierra la sesión y la pantalla de
 * ingreso explica el motivo. Mientras el aviso está abierto, solo "Seguir trabajando"
 * (o actividad en otra pestaña) lo cancela.
 */
export default function ControlInactividad() {
  const { estado, salir } = useSesion();
  const activo = estado === "lista";
  const ultima = useRef(0);
  const ultimaEscritura = useRef(0);
  const continuarRef = useRef(null); // "Seguir trabajando" (lo define el efecto)
  const [aviso, setAviso] = useState(null); // segundos restantes, o null

  useEffect(() => {
    if (!activo) return;
    const ahora = Date.now();
    ultima.current = ahora;
    ultimaEscritura.current = ahora;
    escribirCompartida(ahora);

    let enAviso = false;
    let cerrando = false;

    const revisar = () => {
      if (cerrando) return;
      const referencia = Math.max(ultima.current, leerCompartida());
      const { fase, segundosRestantes } = estadoInactividad(referencia, Date.now());
      if (fase === "expirado") {
        cerrando = true;
        setAviso(null);
        salir("Tu sesión se cerró por inactividad. Volvé a ingresar para continuar.");
      } else if (fase === "aviso") {
        enAviso = true;
        setAviso(segundosRestantes);
      } else if (enAviso) {
        enAviso = false; // hubo actividad en otra pestaña
        setAviso(null);
      }
    };

    const registrar = () => {
      if (enAviso) return; // con el aviso abierto hay que confirmar explícitamente
      const t = Date.now();
      ultima.current = t;
      if (t - ultimaEscritura.current > ESCRIBIR_CADA_MS) {
        ultimaEscritura.current = t;
        escribirCompartida(t);
      }
    };

    EVENTOS.forEach((e) => window.addEventListener(e, registrar, { passive: true, capture: true }));
    document.addEventListener("visibilitychange", revisar);
    window.addEventListener("storage", revisar);
    const intervalo = setInterval(revisar, 1000);

    continuarRef.current = () => {
      enAviso = false;
      const t = Date.now();
      ultima.current = t;
      ultimaEscritura.current = t;
      escribirCompartida(t);
      setAviso(null);
    };

    return () => {
      EVENTOS.forEach((e) => window.removeEventListener(e, registrar, { capture: true }));
      document.removeEventListener("visibilitychange", revisar);
      window.removeEventListener("storage", revisar);
      clearInterval(intervalo);
      continuarRef.current = null;
    };
  }, [activo, salir]);

  if (!activo || aviso === null) return null;

  return (
    <Dialog open maxWidth="xs" fullWidth aria-labelledby="titulo-inactividad" disableEscapeKeyDown>
      <DialogTitle id="titulo-inactividad">¿Seguís ahí?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pasaron {MINUTOS_INACTIVIDAD} minutos sin actividad. Para proteger las historias clínicas, la sesión se va a
          cerrar en{" "}
          <strong aria-live="polite" style={{ fontVariantNumeric: "tabular-nums" }}>
            {aviso} {aviso === 1 ? "segundo" : "segundos"}
          </strong>
          . Lo que no hayas guardado se pierde.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => salir()}>Cerrar sesión</Button>
        <Button variant="contained" onClick={() => continuarRef.current?.()} autoFocus>
          Seguir trabajando
        </Button>
      </DialogActions>
    </Dialog>
  );
}
