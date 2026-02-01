import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const patientId = formData.get('patientId');

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    if (!patientId) {
      return NextResponse.json({ error: 'Falta el ID del paciente' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type;
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop();

    const fileName = `${patientId}_${Date.now()}.${fileExtension}`;

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: mimeType,
        body: buffer,
      },
      fields: 'id,webViewLink,webContentLink',
    });

    await drive.permissions.create({
      fileId: driveResponse.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileUrl = `https://drive.google.com/uc?export=view&id=${driveResponse.data.id}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileId: driveResponse.data.id,
      fileName: fileName,
    });

  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}