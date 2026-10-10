import { darDeBaja, reactivar, respuestaError } from "@/lib/server/pacientesService";
import { usuarioDe } from "@/lib/server/http";
import { registrar } from "@/lib/server/auditoria";

export const runtime = "nodejs";

/**
 * Baja del paciente.
 * Body: { tipo, motivo, fecha, hora, lugar, causa, notificadoA, notificadoEn, institucion }
 */
export async function POST(request, { params }) {
  try {
    const usuario = await usuarioDe(request);
    const { pacienteId } = await params;
    const { pacienteNombre, resumen } = await darDeBaja(pacienteId, await request.json(), { usuario });
    await registrar(request, usuario, { accion: "baja_paciente", pacienteId, pacienteNombre, detalle: resumen });
    return Response.json({ ok: true });
  } catch (error) {
    return respuestaError(error);
  }
}

/**
 * Deshace la baja (queda en el historial). Body: { motivo }.
 * Si fue por fallecimiento, solo un admin puede anularla y el motivo es obligatorio.
 */
export async function DELETE(request, { params }) {
  try {
    const usuario = await usuarioDe(request);
    const { pacienteId } = await params;
    const body = await request.json().catch(() => ({}));
    const r = await reactivar(pacienteId, { motivo: body.motivo }, { usuario });
    await registrar(request, usuario, {
      accion: r.eraFallecimiento ? "anular_baja" : "reactivar_paciente",
      pacienteId,
      pacienteNombre: r.pacienteNombre,
      detalle: r.motivo,
    });
    return Response.json({ ok: true });
  } catch (error) {
    return respuestaError(error);
  }
}
