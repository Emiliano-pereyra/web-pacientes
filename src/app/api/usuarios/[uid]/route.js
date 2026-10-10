import { respuestaError } from "@/lib/server/errores";
import { usuarioDe } from "@/lib/server/http";
import { actualizarUsuario } from "@/lib/server/usuariosService";
import { registrar } from "@/lib/server/auditoria";

export const runtime = "nodejs";

/** Solo administradores. Body: { nombre?, rol?, matricula?, profesionalUid?, activo? } */
export async function PATCH(request, { params }) {
  try {
    const admin = await usuarioDe(request, { rol: "admin" });
    const { uid } = await params;
    const r = await actualizarUsuario(uid, await request.json(), { solicitante: admin });
    if (r.cambios.length) {
      await registrar(request, admin, {
        accion: "editar_usuario",
        detalle: `${r.nombre} <${r.email}>: ${r.cambios.join("; ")}`,
      });
    }
    return Response.json(r);
  } catch (error) {
    return respuestaError(error);
  }
}
