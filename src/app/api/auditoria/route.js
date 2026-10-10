import { respuestaError } from "@/lib/server/errores";
import { usuarioDe } from "@/lib/server/http";
import { consultar } from "@/lib/server/auditoria";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Solo administradores. GET ?pacienteId=&uid=&antesDe=<fecha ISO> */
export async function GET(request) {
  try {
    await usuarioDe(request, { rol: "admin" });
    const q = new URL(request.url).searchParams;
    return Response.json(
      await consultar({
        pacienteId: q.get("pacienteId") || undefined,
        uid: q.get("uid") || undefined,
        antesDe: q.get("antesDe") || undefined,
      }),
    );
  } catch (error) {
    return respuestaError(error);
  }
}
