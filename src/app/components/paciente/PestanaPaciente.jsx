"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import SeccionVista from "./SeccionVista";
import Evoluciones from "./Evoluciones";
import ModalEditarSeccion from "./ModalEditarSeccion";
import ModalHistorialCampo from "./ModalHistorialCampo";

/**
 * Pestaña genérica: muestra las secciones configuradas en PESTANAS (schema.js)
 * y permite editarlas. El encabezado (con los datos personales) y las acciones están en la página.
 * `pedidoNuevaEvolucion` abre el formulario de evolución; `onPedidoAtendido` lo apaga.
 */
export default function PestanaPaciente({
  pestana,
  paciente,
  onActualizado,
  pedidoNuevaEvolucion = false,
  onPedidoAtendido,
}) {
  const [seccionEditando, setSeccionEditando] = useState(null);
  const [campoHistorial, setCampoHistorial] = useState(null);

  return (
    <Box>
      {pestana.conEvoluciones && (
        <Evoluciones
          pacienteId={paciente.id}
          pedidoAbrir={pedidoNuevaEvolucion}
          onPedidoAtendido={onPedidoAtendido}
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
