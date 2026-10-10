import { listarHistorial, respuestaError } from "@/lib/server/pacientesService";
import { usuarioDe } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET ?campo=diagnostico.enfermedadActual para filtrar por un campo. */
export async function GET(request, { params }) {
  try {
    await usuarioDe(request);
    const { pacienteId } = await params;
    const campo = new URL(request.url).searchParams.get("campo") || undefined;
    return Response.json(await listarHistorial(pacienteId, { campo }));
  } catch (error) {
    return respuestaError(error);
  }
}
