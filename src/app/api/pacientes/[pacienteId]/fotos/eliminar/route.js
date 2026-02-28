import { NextResponse } from 'next/server';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function DELETE(request, { params }) {
  try {
    const { pacienteId } = await params;
    const { fotoIds, paths } = await request.json();

    // Validaciones
    if (!Array.isArray(fotoIds) || fotoIds.length === 0) {
      return NextResponse.json({ error: 'Debe proporcionar al menos un ID de foto' }, { status: 400 });
    }

    const storage = getStorage();
    const eliminated = [];
    const errors = [];

    for (const path of paths) {
      try {
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
        eliminated.push(path);
      } catch (storageError) {
        console.error(`Error eliminando ${path}:`, storageError);
        errors.push({ path, error: storageError.message });
      }
    }

    if (eliminated.length > 0) {
      const pacienteRef = doc(db, 'pacientes/lista/nombresPacientes', pacienteId);
      
      const fotosARemover = fotoIds.map(id => ({ id }));
      
      const pacienteSnap = await getDoc(pacienteRef);
      if (pacienteSnap.exists()) {
        const data = pacienteSnap.data();
        const galeriaActual = data.galeriaFotos || [];
        const galeriaActualizada = galeriaActual.filter(foto => !fotoIds.includes(foto.id));
        
        await updateDoc(pacienteRef, {
          galeriaFotos: galeriaActualizada
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${eliminated.length} foto(s) eliminada(s) correctamente`,
      eliminated: eliminated.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error eliminando fotos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}