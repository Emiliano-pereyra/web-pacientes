import { listarPacientes, respuestaError } from "@/lib/server/pacientesService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await listarPacientes());
  } catch (error) {
    return respuestaError(error);
  }
}
