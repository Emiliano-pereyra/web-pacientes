"use client";

import { SesionProvider } from "./components/auth/Sesion";
import { ConfirmacionProvider } from "./components/ui/Confirmacion";

/** Estado compartido por todas las páginas: sesión y diálogo de confirmación. */
export default function Providers({ children }) {
  return (
    <SesionProvider>
      <ConfirmacionProvider>{children}</ConfirmacionProvider>
    </SesionProvider>
  );
}
