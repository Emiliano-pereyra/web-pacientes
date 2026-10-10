/** Utilidades HTTP para las rutas de la API. */
import { adminAuth, adminDb } from "@/lib/server/firebaseAdmin";
import { ErrorNegocio } from "@/lib/server/errores";
import { ROLES, etiquetaProfesional } from "@/lib/usuarios";

/**
 * Usuario que hace el pedido.
 * Verifica el token de Firebase Auth (header Authorization: Bearer <token>) y
 * busca el usuario en la colección `usuarios`. Solo pasan los usuarios dados de
 * alta y activos; con `rol` se exige además ese rol (admin pasa siempre).
 *
 * @returns {Promise<{ uid, email, nombre, matricula, rol, profesional }>}
 */
export async function usuarioDe(request, { rol } = {}) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new ErrorNegocio("Iniciá sesión para continuar", 401);

  let decodificado;
  try {
    decodificado = await adminAuth.verifyIdToken(token);
  } catch {
    throw new ErrorNegocio("La sesión venció. Volvé a iniciar sesión", 401);
  }

  const snap = await adminDb.collection("usuarios").doc(decodificado.uid).get();
  const datos = snap.exists ? snap.data() : null;
  if (!datos || datos.activo === false || !ROLES[datos.rol]) {
    throw new ErrorNegocio("Tu cuenta no tiene acceso al sistema", 403);
  }
  if (rol && datos.rol !== rol && datos.rol !== "admin") {
    throw new ErrorNegocio("No tenés permiso para esta acción", 403);
  }

  const usuario = {
    uid: decodificado.uid,
    email: datos.email,
    nombre: datos.nombre,
    matricula: datos.matricula || "",
    rol: datos.rol,
  };
  return { ...usuario, profesional: etiquetaProfesional(usuario) };
}
