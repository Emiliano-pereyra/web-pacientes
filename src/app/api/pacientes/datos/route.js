import { obtenerPaciente, respuestaError } from "@/lib/server/pacientesService";
import { usuarioDe } from "@/lib/server/http";
import { registrar } from "@/lib/server/auditoria";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const usuario = await usuarioDe(request);
    const id = new URL(request.url).searchParams.get("id");
    const paciente = await obtenerPaciente(id);
    await registrar(request, usuario, {
      accion: "ver_paciente",
      pacienteId: id,
      pacienteNombre: paciente.datosPersonales?.nombreCompleto,
    });
    return Response.json(paciente);
  } catch (error) {
    return respuestaError(error);
  }
}
