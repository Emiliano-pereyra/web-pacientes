import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { crearPaciente, respuestaError, ErrorNegocio } from "@/lib/server/pacientesService";
import { profesionalDe } from "@/lib/server/http";

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
          const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
          const stamp = Date.now();
          const storageRef = ref(storage, `pacientes/${pacienteId}/perfil_${stamp}.${ext}`);
          await uploadBytes(storageRef, Buffer.from(await file.arrayBuffer()), {
            contentType: file.type,
            customMetadata: { pacienteId, tipo: "perfil", uploadedAt: new Date().toISOString() },
          });
          const url = await getDownloadURL(storageRef);
          return {
            url,
            metadata: {
              id: `perfil_${stamp}`,
              url,
              path: storageRef.fullPath,
              tipo: "perfil",
              descripcion: "Foto de perfil al crear paciente",
              nombreOriginal: file.name,
              mimeType: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString(),
            },
          };
        }
      : undefined;

    const { id } = await crearPaciente(entrada, { profesional: profesionalDe(request), subirFoto });
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Datos mal formados" }, { status: 400 });
    return respuestaError(error);
  }
}
