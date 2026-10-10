import { crearPaciente, respuestaError, ErrorNegocio } from "@/lib/server/pacientesService";
import { subirArchivo } from "@/lib/server/archivos";
import { usuarioDe } from "@/lib/server/http";
import { registrar } from "@/lib/server/auditoria";

export const runtime = "nodejs";
export const maxDuration = 60;

const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FOTO = 5 * 1024 * 1024;

/**
 * Alta de paciente.
 * Acepta multipart/form-data con:
 *   datos → JSON con { path: valor } (ej. { "datosPersonales.nombreCompleto": "..." })
 *   file  → foto de perfil opcional
 * o application/json con el objeto { path: valor } directamente.
 */
export async function POST(request) {
  try {
    const usuario = await usuarioDe(request);
    const contentType = request.headers.get("content-type") || "";
    let entrada = {};
    let file = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      entrada = JSON.parse(form.get("datos") || "{}");
      const f = form.get("file");
      if (f && typeof f === "object" && f.size > 0) file = f;
    } else {
      entrada = await request.json();
    }

    if (file) {
      if (!TIPOS_FOTO.includes(file.type)) throw new ErrorNegocio("La foto debe ser JPG, PNG, WebP o GIF");
      if (file.size > MAX_FOTO) throw new ErrorNegocio("La foto supera el límite de 5 MB");
    }

    const subirFoto = file
      ? async (pacienteId) => {
          const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
          const stamp = Date.now();
          const { path } = await subirArchivo(
            `pacientes/${pacienteId}/perfil_${stamp}.${ext}`,
            Buffer.from(await file.arrayBuffer()),
            {
              contentType: file.type,
              metadata: { pacienteId, tipo: "perfil", uploadedAt: new Date().toISOString() },
            },
          );
          return {
            path,
            metadata: {
              id: `perfil_${stamp}`,
              path,
              tipo: "perfil",
              descripcion: "Foto de perfil al crear paciente",
              nombreOriginal: file.name,
              mimeType: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString(),
              subidoPor: usuario.profesional,
              subidoPorUid: usuario.uid,
            },
          };
        }
      : undefined;

    const { id } = await crearPaciente(entrada, { usuario, subirFoto });
    await registrar(request, usuario, {
      accion: "crear_paciente",
      pacienteId: id,
      pacienteNombre: entrada["datosPersonales.nombreCompleto"],
    });
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Datos mal formados" }, { status: 400 });
    return respuestaError(error);
  }
}
