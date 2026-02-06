import { generarPDFHistoria } from "@/utils/pdf/exportadorController";
import { format } from 'date-fns';

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { tipoTab, datos } = await req.json();
    
    const nombrePaciente = datos.paciente?.nombreCompleto || 'paciente';
    const fechaActual = format(new Date(), 'dd-MM-yyyy HH-mm-ss');
    const nombreArchivo = `${nombrePaciente} - ${fechaActual}.pdf`;

    const pdfBuffer = await generarPDFHistoria(datos, tipoTab);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${nombreArchivo}"`,
      },
    });
  } catch (error) {
    console.error("Error al generar PDF clínico:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al generar el PDF" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}