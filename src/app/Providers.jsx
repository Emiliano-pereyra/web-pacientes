"use client";

import { SesionProvider } from "./components/auth/Sesion";
import ControlInactividad from "./components/auth/ControlInactividad";
import { ConfirmacionProvider } from "./components/ui/Confirmacion";

/** Estado compartido por todas las páginas: sesión, cierre por inactividad y diálogo de confirmación. */
export default function Providers({ children }) {
  return (
    <SesionProvider>
      <ConfirmacionProvider>
        {children}
        <ControlInactividad />
      </ConfirmacionProvider>
    </SesionProvider>
  );
}
