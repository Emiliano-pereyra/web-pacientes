import { FieldValue } from 'firebase-admin/firestore';
import { asegurarActivo, pacienteRef, respuestaError, ErrorNegocio } from '@/lib/server/pacientesService';
import { fotoParaCliente, subirArchivo } from '@/lib/server/archivos';
import { usuarioDe } from '@/lib/server/http';
import { registrar } from '@/lib/server/auditoria';

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
    asegurarActivo(snap.data());

    const stamp = Date.now();
    const extension = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const uploadedAt = new Date().toISOString();

    const { path } = await subirArchivo(
      `pacientes/${pacienteId}/${tipo}_${stamp}.${extension}`,
      Buffer.from(await file.arrayBuffer()),
      { contentType: file.type, metadata: { pacienteId, tipo, uploadedAt } },
    );

    // En la base va solo la ruta; el enlace se firma al mostrarlo
    const fotoMetadata = {
      id: `${tipo}_${stamp}`,
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
      ...(tipo === 'perfil' ? { fotoPerfilPath: path, urlFoto: '' } : {}),
      galeriaFotos: FieldValue.arrayUnion(fotoMetadata),
    });

    await registrar(request, usuario, {
      accion: 'subir_archivo',
      pacienteId,
      pacienteNombre: snap.data().datosPersonales?.nombreCompleto || snap.data().nombreCompleto,
      detalle: `${file.name} (${tipo})`,
    });

    const metadata = await fotoParaCliente(fotoMetadata);
    return Response.json({ success: true, url: metadata.url, metadata });
  } catch (error) {
    return respuestaError(error);
  }
}
