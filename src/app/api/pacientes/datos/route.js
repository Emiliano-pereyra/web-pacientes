import { obtenerPaciente, respuestaError } from "@/lib/server/pacientesService";
import { usuarioDe } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await usuarioDe(request);
    const id = new URL(request.url).searchParams.get("id");
    return Response.json(await obtenerPaciente(id));
  } catch (error) {
    return respuestaError(error);
  }
}
