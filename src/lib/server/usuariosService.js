/**
 * Gestión de usuarios desde la app (solo servidor; las rutas exigen rol admin).
 * Mismas reglas que scripts/usuarios.ts (ver validarUsuario en src/lib/usuarios.js).
 *
 * Protecciones:
 *  - un admin no puede desactivarse ni quitarse el rol de admin a sí mismo;
 *  - siempre tiene que quedar al menos un admin activo;
 *  - no se desactiva a un profesional (ni se le cambia el rol) si tiene secretarias/os activas.
 */
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/server/firebaseAdmin";
import { ErrorNegocio } from "@/lib/server/errores";
import { requiereMatricula, requiereProfesional, validarUsuario } from "@/lib/usuarios";

const usuarios = () => adminDb.collection("usuarios");

async function todos() {
  const snap = await usuarios().get();
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

const profesionalesDe = (lista) => lista.filter((u) => requiereMatricula(u.rol));

/** Lista para la pantalla de administración. */
export async function listarUsuarios() {
  const lista = await todos();
  const porUid = new Map(lista.map((u) => [u.uid, u]));
  return lista
    .map((u) => ({
      uid: u.uid,
      email: u.email,
      nombre: u.nombre,
      rol: u.rol,
      matricula: u.matricula || "",
      activo: u.activo !== false,
      profesionalUid: u.profesionalUid || "",
      profesionalNombre: u.profesionalUid ? porUid.get(u.profesionalUid)?.nombre || "" : "",
      creadoEn: u.creadoEn || null,
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function campos(valores) {
  return {
    nombre: valores.nombre,
    rol: valores.rol,
    matricula: valores.matricula,
    profesionalUid: valores.profesionalUid || FieldValue.delete(),
  };
}

/** Alta: crea la cuenta en Firebase Auth si no existe (entra con Google o eligiendo contraseña). */
export async function crearUsuario(entrada) {
  const lista = await todos();
  const { valores, errores } = validarUsuario(entrada, { esAlta: true, profesionales: profesionalesDe(lista) });
  if (Object.keys(errores).length) throw new ErrorNegocio("Hay datos inválidos", 400, errores);

  let uid;
  try {
    uid = (await adminAuth.getUserByEmail(valores.email)).uid;
  } catch (e) {
    if (e?.code !== "auth/user-not-found") throw e;
    uid = (await adminAuth.createUser({ email: valores.email, displayName: valores.nombre })).uid;
  }
  if (lista.some((u) => u.uid === uid)) {
    throw new ErrorNegocio("Ese email ya está dado de alta", 409, { email: "Ese email ya está dado de alta" });
  }

  const ahora = new Date().toISOString();
  await usuarios()
    .doc(uid)
    .set({ email: valores.email, ...campos(valores), activo: true, creadoEn: ahora, actualizadoEn: ahora });
  return { uid, ...valores };
}

/** Edición: nombre, rol, matrícula, profesional vinculado y/o activo. */
export async function actualizarUsuario(uid, entrada, { solicitante }) {
  const lista = await todos();
  const actual = lista.find((u) => u.uid === uid);
  if (!actual) throw new ErrorNegocio("Usuario no encontrado", 404);

  const combinado = { ...actual, ...entrada };
  const { valores, errores } = validarUsuario(combinado, { profesionales: profesionalesDe(lista) });
  if (Object.keys(errores).length) throw new ErrorNegocio("Hay datos inválidos", 400, errores);
  const activo = entrada.activo === undefined ? actual.activo !== false : Boolean(entrada.activo);

  // Protecciones
  const esUnoMismo = uid === solicitante.uid;
  if (esUnoMismo && !activo) throw new ErrorNegocio("No podés desactivar tu propio usuario", 400);
  if (esUnoMismo && valores.rol !== "admin") throw new ErrorNegocio("No podés quitarte el rol de administrador", 400);

  const adminsActivos = lista.filter((u) => u.rol === "admin" && u.activo !== false);
  const dejaDeSerAdmin = actual.rol === "admin" && actual.activo !== false && (valores.rol !== "admin" || !activo);
  if (dejaDeSerAdmin && adminsActivos.length <= 1) {
    throw new ErrorNegocio("Tiene que quedar al menos un administrador activo", 400);
  }

  const dejaDeSerProfesional = requiereMatricula(actual.rol) && (!requiereMatricula(valores.rol) || !activo);
  if (dejaDeSerProfesional) {
    const vinculadas = lista.filter((u) => requiereProfesional(u.rol) && u.profesionalUid === uid && u.activo !== false);
    if (vinculadas.length) {
      throw new ErrorNegocio(
        `Tiene ${vinculadas.length} secretaria/o(s) activa(s) vinculada(s): ${vinculadas
          .map((u) => u.nombre)
          .join(", ")}. Asignalas a otro profesional primero.`,
        409,
      );
    }
  }

  await usuarios()
    .doc(uid)
    .update({ ...campos(valores), activo, actualizadoEn: new Date().toISOString() });
  if (valores.nombre !== actual.nombre) await adminAuth.updateUser(uid, { displayName: valores.nombre });

  // Resumen de cambios para el registro de accesos
  const cambios = [];
  if (valores.nombre !== actual.nombre) cambios.push(`nombre: ${actual.nombre} → ${valores.nombre}`);
  if (valores.rol !== actual.rol) cambios.push(`rol: ${actual.rol} → ${valores.rol}`);
  if ((valores.matricula || "") !== (actual.matricula || "")) cambios.push(`matrícula: ${actual.matricula || "—"} → ${valores.matricula || "—"}`);
  if ((valores.profesionalUid || "") !== (actual.profesionalUid || "")) cambios.push("profesional vinculado");
  if (activo !== (actual.activo !== false)) cambios.push(activo ? "activado" : "desactivado");
  return { uid, email: actual.email, nombre: valores.nombre, cambios };
}
