"use client";

import { useCallback, useEffect } from "react";
import { useConfirmar } from "@/app/components/ui/Confirmacion";

/**
 * Lleva el foco al primer campo con error (en el orden en que aparece en pantalla).
 * Los campos se marcan con data-campo="<path>" en FormularioSeccion.
 */
export function enfocarPrimerError(errores, raiz = document) {
  const paths = Object.keys(errores || {}).filter((p) => errores[p]);
  if (!paths.length) return;
  // esperar a que el formulario muestre los errores (y la pestaña correcta)
  requestAnimationFrame(() => {
    const contenedores = [...raiz.querySelectorAll("[data-campo]")];
    const primero = contenedores.find((el) => paths.includes(el.dataset.campo));
    const control = primero?.querySelector("input:not([type=hidden]), textarea, [role=combobox]");
    if (!control) return;
    control.focus({ preventScroll: true });
    primero.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}

/**
 * Protege un formulario con cambios sin guardar:
 *  - avisa si se cierra la pestaña del navegador;
 *  - `pedirCierre(cerrar)` pregunta antes de descartar los cambios.
 */
export function useCambiosSinGuardar(hayCambios) {
  const confirmar = useConfirmar();

  useEffect(() => {
    if (!hayCambios) return;
    const alSalir = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", alSalir);
    return () => window.removeEventListener("beforeunload", alSalir);
  }, [hayCambios]);

  return useCallback(
    async (cerrar) => {
      if (
        !hayCambios ||
        (await confirmar({
          titulo: "¿Descartar los cambios?",
          mensaje: "Lo que escribiste no se guardó y se va a perder.",
          confirmar: "Descartar",
          cancelar: "Seguir editando",
          peligro: true,
        }))
      ) {
        cerrar();
      }
    },
    [hayCambios, confirmar],
  );
}
