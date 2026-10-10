"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/cliente/api";

/**
 * Sesión del usuario.
 * estado: "cargando" | "sinSesion" | "sinAcceso" | "lista"
 *  - sinAcceso: inició sesión en Firebase pero no está dado de alta (o está inactivo).
 * aviso: por qué se cerró la sesión (p. ej. inactividad), para mostrarlo en la pantalla de ingreso.
 */
const SesionContext = createContext(null);

// El motivo del cierre se comparte entre pestañas: todas se cierran juntas (Firebase) y
// todas deben explicar por qué. Vale por un minuto.
const CLAVE_CIERRE = "webpacientes.cierre";

function leerMotivoCierre() {
  try {
    const { motivo, en } = JSON.parse(localStorage.getItem(CLAVE_CIERRE) || "{}");
    return motivo && Date.now() - en < 60_000 ? motivo : "";
  } catch {
    return "";
  }
}

function guardarMotivoCierre(motivo) {
  try {
    if (motivo) localStorage.setItem(CLAVE_CIERRE, JSON.stringify({ motivo, en: Date.now() }));
    else localStorage.removeItem(CLAVE_CIERRE);
  } catch {
    /* sin storage: se ignora */
  }
}

export function useSesion() {
  return useContext(SesionContext);
}

export function SesionProvider({ children }) {
  const [estado, setEstado] = useState("cargando");
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        if (!u) {
          setUsuario(null);
          setError("");
          setAviso(leerMotivoCierre());
          setEstado("sinSesion");
          return;
        }
        setEstado("cargando");
        setAviso("");
        try {
          setUsuario(await api.usuarioActual());
          setError("");
          setEstado("lista");
        } catch (e) {
          setUsuario(null);
          setError(e.message); // en 403 explica el motivo (sin alta, inactivo, sin profesional asignado)
          setEstado(e.status === 403 ? "sinAcceso" : "sinSesion");
        }
      }),
    [],
  );

  /** Cierra la sesión. `motivo` (p. ej. "Tu sesión se cerró por inactividad.") se muestra al volver a entrar. */
  const salir = useCallback((motivo = "") => {
    guardarMotivoCierre(typeof motivo === "string" ? motivo : "");
    return signOut(auth);
  }, []);

  return (
    <SesionContext.Provider value={{ estado, usuario, error, aviso, salir }}>{children}</SesionContext.Provider>
  );
}
