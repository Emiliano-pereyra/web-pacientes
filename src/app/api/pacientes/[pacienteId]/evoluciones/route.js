import { agregarEvolucion, listarEvoluciones, respuestaError } from "@/lib/server/pacientesService";
import { profesionalDe } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { pacienteId } = await params;
    return Response.json(await listarEvoluciones(pacienteId));
  } catch (error) {
    return respuestaError(error);
  }
}

/** Las evoluciones solo se agregan: no hay PUT ni DELETE a propósito. */
export async function POST(request, { params }) {
  try {
    const { pacienteId } = await params;
    const body = await request.json();
    const { id } = await agregarEvolucion(pacienteId, {
      texto: body.texto,
      fecha: body.fecha,
      profesional: body.profesional || profesionalDe(request),
    });
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return respuestaError(error);
  }
}
