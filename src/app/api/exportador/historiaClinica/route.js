import { generarPDFHistoria } from "@/utils/pdf/exportadorController";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { datos } = await req.json();
    const pdfBuffer = await generarPDFHistoria(datos, "historia-clinica");

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="historiaclinica_${Date.now()}.pdf"`,
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
