import { listarPacientes, respuestaError } from "@/lib/server/pacientesService";
import { usuarioDe } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await usuarioDe(request);
    return Response.json(await listarPacientes());
  } catch (error) {
    return respuestaError(error);
  }
}
