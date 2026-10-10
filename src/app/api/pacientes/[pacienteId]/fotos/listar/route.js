import { pacienteRef, respuestaError, ErrorNegocio } from '@/lib/server/pacientesService';
import { usuarioDe } from '@/lib/server/http';
import { fotoParaCliente } from '@/lib/server/archivos';
import { registrar } from '@/lib/server/auditoria';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const usuario = await usuarioDe(request);
    const { pacienteId } = await params;
    const tipo = new URL(request.url).searchParams.get('tipo');

    const snap = await pacienteRef(pacienteId).get();
    if (!snap.exists) throw new ErrorNegocio('Paciente no encontrado', 404);

    let fotos = snap.data().galeriaFotos || [];
    if (tipo) fotos = fotos.filter((foto) => foto.tipo === tipo);
    fotos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    // Enlaces firmados que vencen (MINUTOS_ENLACE): solo sirven mientras la galería está abierta
    const firmadas = await Promise.all(fotos.map(fotoParaCliente));
    await registrar(request, usuario, {
      accion: 'ver_archivos',
      pacienteId,
      pacienteNombre: snap.data().datosPersonales?.nombreCompleto || snap.data().nombreCompleto,
    });
    return Response.json({ success: true, pacienteId, total: firmadas.length, fotos: firmadas });
  } catch (error) {
    return respuestaError(error);
  }
}
