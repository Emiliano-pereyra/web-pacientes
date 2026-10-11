"use client";

import { SesionProvider } from "./components/auth/Sesion";
import ControlCierreDiario from "./components/auth/ControlCierreDiario";
import { ConfirmacionProvider } from "./components/ui/Confirmacion";

/** Estado compartido por todas las páginas: sesión, cierre diario y diálogo de confirmación. */
export default function Providers({ children }) {
  return (
    <SesionProvider>
      <ConfirmacionProvider>
        {children}
        <ControlCierreDiario />
      </ConfirmacionProvider>
    </SesionProvider>
  );
}
