"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

/**
 * Diálogo de confirmación reutilizable.
 *   const confirmar = useConfirmar();
 *   if (await confirmar({ titulo, mensaje, confirmar: "Eliminar", peligro: true })) { ... }
 * El mensaje se muestra como texto (nunca como HTML).
 */
const ConfirmacionContext = createContext(null);

export function useConfirmar() {
  const confirmar = useContext(ConfirmacionContext);
  if (!confirmar) throw new Error("useConfirmar debe usarse dentro de <ConfirmacionProvider>");
  return confirmar;
}

export function ConfirmacionProvider({ children }) {
  const [pedido, setPedido] = useState(null);
  const resolver = useRef(null);

  const confirmar = useCallback(
    (opciones) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setPedido(opciones);
      }),
    [],
  );

  const cerrar = (respuesta) => {
    resolver.current?.(respuesta);
    resolver.current = null;
    setPedido(null);
  };

  return (
    <ConfirmacionContext.Provider value={confirmar}>
      {children}
      <Dialog open={Boolean(pedido)} onClose={() => cerrar(false)} maxWidth="xs" fullWidth>
        {pedido && (
          <>
            <DialogTitle>{pedido.titulo}</DialogTitle>
            {pedido.mensaje && (
              <DialogContent>
                <DialogContentText sx={{ whiteSpace: "pre-line" }}>{pedido.mensaje}</DialogContentText>
              </DialogContent>
            )}
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => cerrar(false)}>{pedido.cancelar || "Cancelar"}</Button>
              <Button
                variant="contained"
                color={pedido.peligro ? "error" : "primary"}
                onClick={() => cerrar(true)}
                autoFocus
              >
                {pedido.confirmar || "Aceptar"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ConfirmacionContext.Provider>
  );
}
