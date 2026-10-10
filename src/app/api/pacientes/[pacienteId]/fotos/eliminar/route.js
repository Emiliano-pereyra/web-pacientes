import { adminDb } from '@/lib/server/firebaseAdmin';
import { pacienteRef, respuestaError, ErrorNegocio } from '@/lib/server/pacientesService';
import { eliminarArchivo } from '@/lib/server/archivos';
import { pathDeUrlFirebase, rutaFotoPerfil } from '@/lib/paciente/fotos';
import { usuarioDe } from '@/lib/server/http';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Body: { fotoIds: [...] }
 * Las rutas de los archivos salen de la galería del paciente, nunca del
 * navegador: así no se puede borrar nada fuera de esa galería.
 */
export async function DELETE(request, { params }) {
  try {
    await usuarioDe(request);
    const { pacienteId } = await params;
    const { fotoIds } = await request.json();

    if (!Array.isArray(fotoIds) || fotoIds.length === 0) {
      throw new ErrorNegocio('Debe proporcionar al menos un ID de foto');
    }

    const ref = pacienteRef(pacienteId);
    const snap = await ref.get();
    if (!snap.exists) throw new ErrorNegocio('Paciente no encontrado', 404);

    const galeria = snap.data().galeriaFotos || [];
    const aEliminar = galeria.filter((foto) => fotoIds.includes(foto.id));

    const eliminadas = [];
    const rutasEliminadas = [];
    const errors = [];
    for (const foto of aEliminar) {
      const ruta = foto.path || pathDeUrlFirebase(foto.url);
      try {
        if (ruta) await eliminarArchivo(ruta);
        eliminadas.push(foto.id);
        if (ruta) rutasEliminadas.push(ruta);
      } catch (storageError) {
        console.error(`Error eliminando ${foto.path}:`, storageError?.message);
        errors.push({ path: foto.path, error: 'No se pudo eliminar el archivo' });
      }
    }

    if (eliminadas.length > 0) {
      await adminDb.runTransaction(async (tx) => {
        const actual = (await tx.get(ref)).data() || {};
        const cambios = {
          galeriaFotos: (actual.galeriaFotos || []).filter((foto) => !eliminadas.includes(foto.id)),
        };
        // Si se borró la foto de perfil, el paciente queda sin foto
        if (rutasEliminadas.includes(rutaFotoPerfil(actual))) {
          cambios.fotoPerfilPath = '';
          cambios.urlFoto = '';
        }
        tx.update(ref, cambios);
      });
    }

    return Response.json({
      success: true,
      message: `${eliminadas.length} foto(s) eliminada(s) correctamente`,
      eliminated: eliminadas.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return respuestaError(error);
  }
}
