import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request, { params }) {
  try {
    const { pacienteId } = await params;
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    const pacienteRef = doc(db, 'pacientes/lista/nombresPacientes', pacienteId);
    const pacienteSnap = await getDoc(pacienteRef);

    if (!pacienteSnap.exists()) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    const data = pacienteSnap.data();
    let fotos = data.galeriaFotos || [];

    if (tipo) {
      fotos = fotos.filter(foto => foto.tipo === tipo);
    }

    fotos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return NextResponse.json({ success: true, pacienteId, total: fotos.length, fotos });

  } catch (error) {
    console.error('Error obteniendo fotos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}