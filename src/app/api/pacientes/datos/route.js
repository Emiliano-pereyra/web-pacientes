import { obtenerPaciente, respuestaError } from "@/lib/server/pacientesService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    return Response.json(await obtenerPaciente(id));
  } catch (error) {
    return respuestaError(error);
  }
}
