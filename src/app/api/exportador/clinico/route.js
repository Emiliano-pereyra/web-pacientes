import { generarPDFClinico } from "@/controller/exportadorController";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { datos } = await req.json();
    const pdfBuffer = await generarPDFClinico(datos, "clinico");

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="clinico_${Date.now()}.pdf"`,
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