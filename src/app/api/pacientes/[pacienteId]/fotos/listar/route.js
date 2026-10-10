import { pacienteRef, respuestaError, ErrorNegocio } from '@/lib/server/pacientesService';
import { usuarioDe } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await usuarioDe(request);
    const { pacienteId } = await params;
    const tipo = new URL(request.url).searchParams.get('tipo');

    const snap = await pacienteRef(pacienteId).get();
    if (!snap.exists) throw new ErrorNegocio('Paciente no encontrado', 404);

    let fotos = snap.data().galeriaFotos || [];
    if (tipo) fotos = fotos.filter((foto) => foto.tipo === tipo);
    fotos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return Response.json({ success: true, pacienteId, total: fotos.length, fotos });
  } catch (error) {
    return respuestaError(error);
  }
}
