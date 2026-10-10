import { listarEvoluciones, obtenerPaciente, respuestaError, ErrorNegocio } from "@/lib/server/pacientesService";
import { generarPdf } from "@/lib/server/pdf/generarPdf";
import { PESTANAS } from "@/lib/paciente/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/exportador/{tipo}  body: { id }
 * tipo: antecedentes | clinico | resumenHc | fliaYApod | interconsulta
 * El PDF se arma con los datos de la base, no con lo que manda el navegador.
 */
export async function POST(request, { params }) {
  try {
    const { tipo } = await params;
    if (!PESTANAS.some((p) => p.id === tipo)) throw new ErrorNegocio("Tipo de PDF no soportado", 404);
    const { id } = await request.json();
    if (!id) throw new ErrorNegocio("Falta el id del paciente");

    const paciente = await obtenerPaciente(id);
    const pestana = PESTANAS.find((p) => p.id === tipo);
    const evoluciones = pestana.conEvoluciones ? await listarEvoluciones(id) : [];
    const bytes = await generarPdf(tipo, paciente, evoluciones);

    const nombre = String(paciente.datosPersonales?.nombreCompleto || "paciente")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_");

    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${tipo}_${nombre}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return respuestaError(error);
  }
}
