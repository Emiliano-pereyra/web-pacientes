import { respuestaError } from "@/lib/server/errores";
import { usuarioDe } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Datos del usuario que inició sesión (403 si no está dado de alta o está inactivo). */
export async function GET(request) {
  try {
    return Response.json(await usuarioDe(request));
  } catch (error) {
    return respuestaError(error);
  }
}
