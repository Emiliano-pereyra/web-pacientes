"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import SeccionVista from "./SeccionVista";
import Evoluciones from "./Evoluciones";
import ModalEditarSeccion from "./ModalEditarSeccion";
import ModalHistorialCampo from "./ModalHistorialCampo";

/**
 * Pestaña genérica: muestra las secciones configuradas en PESTANAS (schema.js)
 * y permite editarlas. El encabezado y las acciones (imprimir, fotos) están en la página.
 * `senalNuevaEvolucion` cambia cada vez que se pide abrir el formulario de evolución.
 */
export default function PestanaPaciente({
  pestana,
  paciente,
  onActualizado,
  conEncabezadoEditable = false,
  senalNuevaEvolucion = 0,
}) {
  const [seccionEditando, setSeccionEditando] = useState(null);
  const [campoHistorial, setCampoHistorial] = useState(null);

  return (
    <Box>
      {pestana.conEvoluciones && <Evoluciones pacienteId={paciente.id} senalAbrir={senalNuevaEvolucion} />}

      {conEncabezadoEditable && (
        <SeccionVista
          paciente={paciente}
          seccionKey="datosPersonales"
          onEditar={setSeccionEditando}
          onVerHistorial={setCampoHistorial}
        />
      )}

      {pestana.secciones.map((key) => (
        <SeccionVista
          key={key}
          paciente={paciente}
          seccionKey={key}
          onEditar={setSeccionEditando}
          onVerHistorial={setCampoHistorial}
        />
      ))}

      {seccionEditando && (
        <ModalEditarSeccion
          paciente={paciente}
          seccionKey={seccionEditando}
          onClose={() => setSeccionEditando(null)}
          onSaved={onActualizado}
        />
      )}

      {campoHistorial && (
        <ModalHistorialCampo
          pacienteId={paciente.id}
          campo={campoHistorial}
          onClose={() => setCampoHistorial(null)}
        />
      )}
    </Box>
  );
}
