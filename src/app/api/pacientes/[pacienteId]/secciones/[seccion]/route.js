import { actualizarSeccion, obtenerPaciente, respuestaError } from "@/lib/server/pacientesService";
import { usuarioDe } from "@/lib/server/http";
import { registrar } from "@/lib/server/auditoria";
import { SECCIONES } from "@/lib/paciente/schema";

export const runtime = "nodejs";

/**
 * Edita una sección del paciente.
 * Body: { path: valor } solo con campos de esa sección (ver src/lib/paciente/schema.js).
 * Devuelve el paciente actualizado.
 */
export async function PUT(request, { params }) {
  try {
    const usuario = await usuarioDe(request);
    const { pacienteId, seccion } = await params;
    const entrada = await request.json();
    const { cambios } = await actualizarSeccion(pacienteId, seccion, entrada, { usuario });
    const paciente = await obtenerPaciente(pacienteId);
    if (cambios) {
      await registrar(request, usuario, {
        accion: "editar_paciente",
        pacienteId,
        pacienteNombre: paciente.datosPersonales?.nombreCompleto,
        detalle: `${SECCIONES[seccion]?.titulo || seccion}: ${cambios} campo(s)`,
      });
    }
    return Response.json({ cambios, paciente });
  } catch (error) {
    return respuestaError(error);
  }
}
