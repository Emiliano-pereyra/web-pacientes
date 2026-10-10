"use client";

import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Divider, Paper, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSesion } from "./Sesion";

const MENSAJES = {
  "auth/invalid-credential": "Email o contraseña incorrectos",
  "auth/invalid-email": "El email no es válido",
  "auth/too-many-requests": "Demasiados intentos. Probá de nuevo en unos minutos",
  "auth/popup-closed-by-user": "",
  "auth/cancelled-popup-request": "",
  "auth/network-request-failed": "Sin conexión. Revisá internet e intentá de nuevo",
};

const mensajeDe = (e) => (e?.code in MENSAJES ? MENSAJES[e.code] : "No se pudo iniciar sesión");

function Marco({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2, bgcolor: "background.default" }}>
      <Paper variant="outlined" sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Panel — Pacientes
        </Typography>
        {children}
      </Paper>
    </Box>
  );
}

/** Pantalla de ingreso: Google o email y contraseña. */
export function PantallaIngreso() {
  const { error: errorSesion } = useSesion();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const ejecutar = async (accion) => {
    setOcupado(true);
    setError("");
    setAviso("");
    try {
      await accion();
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setOcupado(false);
    }
  };

  const conGoogle = () => ejecutar(() => signInWithPopup(auth, new GoogleAuthProvider()));

  const conEmail = (ev) => {
    ev.preventDefault();
    ejecutar(() => signInWithEmailAndPassword(auth, email.trim(), clave));
  };

  const recuperar = () => {
    if (!email.trim()) {
      setError("Escribí tu email y volvé a tocar el botón");
      return;
    }
    ejecutar(async () => {
      await sendPasswordResetEmail(auth, email.trim());
      setAviso(`Si ${email.trim()} tiene una cuenta, le llegó un correo para elegir la contraseña.`);
    });
  };

  return (
    <Marco>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Iniciá sesión para continuar.
      </Typography>

      {(error || errorSesion) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || errorSesion}
        </Alert>
      )}
      {aviso && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {aviso}
        </Alert>
      )}

      <Button fullWidth variant="outlined" size="large" startIcon={<GoogleIcon />} onClick={conGoogle} disabled={ocupado}>
        Entrar con Google
      </Button>

      <Divider sx={{ my: 3 }}>o con email</Divider>

      <Box component="form" onSubmit={conEmail} sx={{ display: "grid", gap: 2 }}>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" size="large" disabled={ocupado}>
          {ocupado ? <CircularProgress size={24} /> : "Entrar"}
        </Button>
        <Button size="small" onClick={recuperar} disabled={ocupado}>
          Crear o recuperar mi contraseña
        </Button>
      </Box>
    </Marco>
  );
}

/** Inició sesión pero su cuenta no está dada de alta en el sistema. */
export function PantallaSinAcceso() {
  const { salir } = useSesion();
  const email = auth.currentUser?.email;
  return (
    <Marco>
      <Alert severity="warning" sx={{ my: 2 }}>
        {email ? `La cuenta ${email}` : "Esta cuenta"} no tiene acceso al sistema. Pedile a un administrador que te dé de
        alta.
      </Alert>
      <Button fullWidth variant="outlined" onClick={salir}>
        Usar otra cuenta
      </Button>
    </Marco>
  );
}
