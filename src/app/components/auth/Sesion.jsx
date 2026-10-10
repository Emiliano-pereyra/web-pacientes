"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/cliente/api";

/**
 * Sesión del usuario.
 * estado: "cargando" | "sinSesion" | "sinAcceso" | "lista"
 *  - sinAcceso: inició sesión en Firebase pero no está dado de alta (o está inactivo).
 */
const SesionContext = createContext(null);

export function useSesion() {
  return useContext(SesionContext);
}

export function SesionProvider({ children }) {
  const [estado, setEstado] = useState("cargando");
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        if (!u) {
          setUsuario(null);
          setEstado("sinSesion");
          return;
        }
        setEstado("cargando");
        try {
          setUsuario(await api.usuarioActual());
          setError("");
          setEstado("lista");
        } catch (e) {
          setUsuario(null);
          setError(e.status === 403 ? "" : e.message);
          setEstado(e.status === 403 ? "sinAcceso" : "sinSesion");
        }
      }),
    [],
  );

  const salir = useCallback(() => signOut(auth), []);

  return (
    <SesionContext.Provider value={{ estado, usuario, error, salir }}>{children}</SesionContext.Provider>
  );
}
