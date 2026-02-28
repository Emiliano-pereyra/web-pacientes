import { NextResponse } from 'next/server';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request, { params }) {
  try {
    const { pacienteId } = await params;
    const formData = await request.formData();
    const file = formData.get('file');
    const tipo = formData.get('tipo') || 'general';
    const descripcion = formData.get('descripcion') || '';

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo supera el límite de 50MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${tipo}_${Date.now()}.${fileExtension}`;
    
    const storage = getStorage();
    const storageRef = ref(storage, `pacientes/${pacienteId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, buffer, {
      contentType: file.type,
      customMetadata: { pacienteId, tipo, uploadedAt: new Date().toISOString() }
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

    const fotoMetadata = {
      id: `${tipo}_${Date.now()}`,
      url: downloadURL,
      path: snapshot.ref.fullPath,
      tipo,
      descripcion,
      nombreOriginal: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };

    const pacienteRef = doc(db, 'pacientes/lista/nombresPacientes', pacienteId);
    const updates = {};
    
    if (tipo === 'perfil') {
      updates.urlFoto = downloadURL;
    }
    
    await updateDoc(pacienteRef, {
      ...updates,
      galeriaFotos: arrayUnion(fotoMetadata)
    });

    return NextResponse.json({ success: true, url: downloadURL, metadata: fotoMetadata });

  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}