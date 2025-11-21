import { generarPDFHistoria } from "@/utils/pdf/exportadorController";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { datos, tipoTab } = await req.json();

    const pdfBuffer = await generarPDFHistoria(datos, tipoTab);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="historia_clinica_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al generar el PDF" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
