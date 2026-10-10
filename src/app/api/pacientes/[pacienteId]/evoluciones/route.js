import { agregarEvolucion, listarEvoluciones, respuestaError } from "@/lib/server/pacientesService";
import { usuarioDe } from "@/lib/server/http";
import { registrar } from "@/lib/server/auditoria";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await usuarioDe(request);
    const { pacienteId } = await params;
    return Response.json(await listarEvoluciones(pacienteId));
  } catch (error) {
    return respuestaError(error);
  }
}

/**
 * Las evoluciones solo se agregan: no hay PUT ni DELETE a propósito.
 * El profesional es siempre el usuario autenticado.
 */
export async function POST(request, { params }) {
  try {
    const usuario = await usuarioDe(request);
    const { pacienteId } = await params;
    const body = await request.json();
    const { id, pacienteNombre } = await agregarEvolucion(pacienteId, { texto: body.texto, fecha: body.fecha }, { usuario });
    await registrar(request, usuario, { accion: "agregar_evolucion", pacienteId, pacienteNombre });
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return respuestaError(error);
  }
}
