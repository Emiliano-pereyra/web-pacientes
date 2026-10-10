/** Utilidades HTTP para las rutas de la API. */
import { adminAuth, adminDb } from "@/lib/server/firebaseAdmin";
import { ErrorNegocio } from "@/lib/server/errores";
import { ROLES, etiquetaAutor, requiereProfesional, responsableDe } from "@/lib/usuarios";

/**
 * Usuario que hace el pedido.
 * Verifica el token de Firebase Auth (header Authorization: Bearer <token>) y
 * busca el usuario en la colección `usuarios`. Solo pasan los usuarios dados de
 * alta y activos; con `rol` se exige además ese rol (admin pasa siempre, y una
 * secretaria/o tiene los mismos permisos que un profesional).
 *
 * @returns {Promise<{ uid, email, nombre, matricula, rol, responsable, profesional }>}
 *   responsable → profesional que figura en los PDF ({ uid, nombre, matricula })
 *   profesional → cómo figura el autor en historial y evoluciones
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
  const rolEfectivo = datos.rol === "secretaria" ? "profesional" : datos.rol;
  if (rol && rolEfectivo !== rol && datos.rol !== "admin") {
    throw new ErrorNegocio("No tenés permiso para esta acción", 403);
  }

  const usuario = {
    uid: decodificado.uid,
    email: datos.email,
    nombre: datos.nombre,
    matricula: datos.matricula || "",
    rol: datos.rol,
  };

  let vinculado = null;
  if (requiereProfesional(datos.rol) && datos.profesionalUid) {
    const p = await adminDb.collection("usuarios").doc(datos.profesionalUid).get();
    if (p.exists) vinculado = { uid: p.id, ...p.data() };
  }
  const responsable = responsableDe(usuario, vinculado);
  if (!responsable) {
    throw new ErrorNegocio(
      "Tu usuario no tiene un profesional activo asignado. Pedile a un administrador que lo configure.",
      403,
    );
  }

  return { ...usuario, responsable, profesional: etiquetaAutor(usuario, responsable) };
}
