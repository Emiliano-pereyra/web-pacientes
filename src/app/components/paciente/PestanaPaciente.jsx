"use client";

import { useState } from "react";
import { Box, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import Swal from "sweetalert2";
import EncabezadoPaciente from "./EncabezadoPaciente";
import SeccionVista from "./SeccionVista";
import Evoluciones from "./Evoluciones";
import ModalEditarSeccion from "./ModalEditarSeccion";
import ModalHistorialCampo from "./ModalHistorialCampo";
import { api } from "@/lib/cliente/api";

/**
 * Pestaña genérica: muestra las secciones configuradas en PESTANAS (schema.js),
 * permite editarlas e imprimir el PDF correspondiente.
 */
export default function PestanaPaciente({ pestana, paciente, onActualizado, conEncabezadoEditable = false }) {
  const [seccionEditando, setSeccionEditando] = useState(null);
  const [campoHistorial, setCampoHistorial] = useState(null);

  const imprimir = async () => {
    // La ventana se abre antes del await para que el navegador no la bloquee
    const ventana = window.open("", "_blank");
    Swal.fire({ title: "Generando PDF…", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const blob = await api.descargarPdf(pestana.id, paciente.id);
      const url = URL.createObjectURL(blob);
      if (ventana) ventana.location.href = url;
      else window.open(url, "_blank");
      Swal.close();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      ventana?.close();
      Swal.fire("No se pudo generar el PDF", e.message, "error");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={imprimir}>
          Imprimir {pestana.titulo.toLowerCase()}
        </Button>
      </Box>

      <EncabezadoPaciente paciente={paciente} />

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

      {pestana.conEvoluciones && <Evoluciones pacienteId={paciente.id} />}

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
