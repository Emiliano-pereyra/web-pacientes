import { FieldValue } from 'firebase-admin/firestore';
import { pacienteRef, respuestaError, ErrorNegocio } from '@/lib/server/pacientesService';
import { subirArchivo } from '@/lib/server/archivos';
import { usuarioDe } from '@/lib/server/http';

export const runtime = 'nodejs';
export const maxDuration = 60;

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'];
const MAX_ARCHIVO = 50 * 1024 * 1024;

export async function POST(request, { params }) {
  try {
    const usuario = await usuarioDe(request);
    const { pacienteId } = await params;
    const formData = await request.formData();
    const file = formData.get('file');
    const tipo = String(formData.get('tipo') || 'general').replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    const descripcion = formData.get('descripcion') || '';

    if (!file || typeof file !== 'object') throw new ErrorNegocio('No se proporcionó ningún archivo');
    if (!TIPOS_PERMITIDOS.includes(file.type)) throw new ErrorNegocio('Tipo de archivo no permitido');
    if (file.size > MAX_ARCHIVO) throw new ErrorNegocio('El archivo supera el límite de 50MB');

    const snap = await pacienteRef(pacienteId).get();
    if (!snap.exists) throw new ErrorNegocio('Paciente no encontrado', 404);

    const stamp = Date.now();
    const extension = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const uploadedAt = new Date().toISOString();

    const { url, path } = await subirArchivo(
      `pacientes/${pacienteId}/${tipo}_${stamp}.${extension}`,
      Buffer.from(await file.arrayBuffer()),
      { contentType: file.type, metadata: { pacienteId, tipo, uploadedAt } },
    );

    const fotoMetadata = {
      id: `${tipo}_${stamp}`,
      url,
      path,
      tipo,
      descripcion,
      nombreOriginal: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedAt,
      subidoPor: usuario.profesional,
      subidoPorUid: usuario.uid,
    };

    await pacienteRef(pacienteId).update({
      ...(tipo === 'perfil' ? { urlFoto: url } : {}),
      galeriaFotos: FieldValue.arrayUnion(fotoMetadata),
    });

    return Response.json({ success: true, url, metadata: fotoMetadata });
  } catch (error) {
    return respuestaError(error);
  }
}
