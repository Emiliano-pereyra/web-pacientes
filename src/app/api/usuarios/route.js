import { respuestaError } from "@/lib/server/errores";
import { usuarioDe } from "@/lib/server/http";
import { crearUsuario, listarUsuarios } from "@/lib/server/usuariosService";
import { registrar } from "@/lib/server/auditoria";
import { ROLES } from "@/lib/usuarios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Solo administradores. */
export async function GET(request) {
  try {
    await usuarioDe(request, { rol: "admin" });
    return Response.json(await listarUsuarios());
  } catch (error) {
    return respuestaError(error);
  }
}

export async function POST(request) {
  try {
    const admin = await usuarioDe(request, { rol: "admin" });
    const creado = await crearUsuario(await request.json());
    await registrar(request, admin, {
      accion: "crear_usuario",
      detalle: `${creado.nombre} <${creado.email}> · ${ROLES[creado.rol]}`,
    });
    return Response.json(creado, { status: 201 });
  } catch (error) {
    return respuestaError(error);
  }
}
