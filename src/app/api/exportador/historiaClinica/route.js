import { generarPDFHistoria } from "@/utils/pdf/exportadorController";
<<<<<<< HEAD
=======
import { format } from 'date-fns';
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453

export const runtime = "nodejs";

export async function POST(req) {
  try {
<<<<<<< HEAD
    const { datos, tipoTab } = await req.json();
=======
    const { tipoTab, datos } = await req.json();
    
    const nombrePaciente = datos.paciente?.nombreCompleto || 'paciente';
    const fechaActual = format(new Date(), 'dd-MM-yyyy HH-mm-ss');
    const nombreArchivo = `${nombrePaciente} - ${fechaActual}.pdf`;
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453

    const pdfBuffer = await generarPDFHistoria(datos, tipoTab);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
<<<<<<< HEAD
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
=======
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
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
