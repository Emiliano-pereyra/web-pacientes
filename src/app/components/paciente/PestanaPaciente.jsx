"use client";

import { useState } from "react";
import { Box, Button } from "@mui/material";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import SeccionVista from "./SeccionVista";
import Evoluciones from "./Evoluciones";
import ModalEditarSeccion from "./ModalEditarSeccion";
import ModalHistorialCampo from "./ModalHistorialCampo";
import { guardarPreferencia, leerPreferencia } from "@/lib/cliente/preferencias";

/**
 * Pestaña genérica: muestra las secciones configuradas en PESTANAS (schema.js)
 * y permite editarlas. El encabezado (con los datos personales) y las acciones están en la página.
 * `pedidoNuevaEvolucion` abre el formulario de evolución; `onPedidoAtendido` lo apaga.
 * `soloLectura` (paciente dado de baja) oculta todo lo que modifica.
 */
export default function PestanaPaciente({
  pestana,
  paciente,
  onActualizado,
  pedidoNuevaEvolucion = false,
  onPedidoAtendido,
  soloLectura = false,
}) {
  const [seccionEditando, setSeccionEditando] = useState(null);
  const [campoHistorial, setCampoHistorial] = useState(null);
  // Secciones desplegadas. En pestañas con secciones plegables empiezan plegadas, y
  // este equipo recuerda cuáles se dejaron abiertas (para todos los pacientes).
  const plegables = Boolean(pestana.seccionesPlegables);
  const clavePreferencia = `seccionesAbiertas.${pestana.id}`;
  const [abiertas, setAbiertasEstado] = useState(
    () => new Set(plegables ? leerPreferencia(clavePreferencia, []).filter((k) => pestana.secciones.includes(k)) : []),
  );
  const todasAbiertas = pestana.secciones.every((k) => abiertas.has(k));

  const setAbiertas = (cambio) =>
    setAbiertasEstado((prev) => {
      const sig = typeof cambio === "function" ? cambio(prev) : cambio;
      if (plegables) guardarPreferencia(clavePreferencia, [...sig]);
      return sig;
    });

  const alternar = (key) =>
    setAbiertas((prev) => {
      const sig = new Set(prev);
      if (sig.has(key)) sig.delete(key);
      else sig.add(key);
      return sig;
    });

  return (
    <Box>
      {pestana.conEvoluciones && (
        <Evoluciones
          pacienteId={paciente.id}
          pedidoAbrir={pedidoNuevaEvolucion && !soloLectura}
          onPedidoAtendido={onPedidoAtendido}
          soloLectura={soloLectura}
        />
      )}

      {plegables && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Button
            size="small"
            startIcon={todasAbiertas ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            onClick={() => setAbiertas(todasAbiertas ? new Set() : new Set(pestana.secciones))}
          >
            {todasAbiertas ? "Plegar todo" : "Desplegar todo"}
          </Button>
        </Box>
      )}

      {pestana.secciones.map((key) => (
        <SeccionVista
          key={key}
          paciente={paciente}
          seccionKey={key}
          onEditar={soloLectura ? undefined : setSeccionEditando}
          onVerHistorial={setCampoHistorial}
          plegable={plegables}
          abierta={abiertas.has(key)}
          onAlternar={alternar}
        />
      ))}

      {seccionEditando && (
        <ModalEditarSeccion
          paciente={paciente}
          seccionKey={seccionEditando}
          onClose={() => setSeccionEditando(null)}
          onSaved={(...args) => {
            setAbiertas((prev) => new Set(prev).add(seccionEditando)); // que se vea lo que se guardó
            return onActualizado?.(...args);
          }}
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
