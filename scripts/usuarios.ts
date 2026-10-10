/**
 * Gestión de usuarios del sistema.
 *
 * Uso (con GOOGLE_APPLICATION_CREDENTIALS=./service-account.json):
 *   npm run usuarios -- crear <email> --nombre "Nombre Apellido" --matricula "MN 1234" --rol admin|profesional
 *   npm run usuarios -- listar
 *   npm run usuarios -- rol <email> admin|profesional
 *   npm run usuarios -- desactivar <email>
 *   npm run usuarios -- activar <email>
 *
 * - `crear` da de alta la cuenta en Firebase Auth (si no existe) y el documento
 *   `usuarios/{uid}`. Si el usuario ya existe, actualiza nombre, matrícula y rol.
 * - El usuario entra con Google (si el email es de Google) o con email y
 *   contraseña: la elige con "Crear o recuperar mi contraseña" en la pantalla de ingreso.
 * - Desactivar no borra nada: solo le quita el acceso.
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ROLES } from "../src/lib/usuarios";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "pacientes-2c28e";

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const auth = getAuth();
const usuarios = getFirestore().collection("usuarios");

function opcion(args: string[], nombre: string) {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 ? args[i + 1]?.trim() : undefined;
}

function validarRol(rol: string | undefined) {
  if (!rol || !(rol in ROLES)) throw new Error(`Rol inválido: ${rol}. Opciones: ${Object.keys(ROLES).join(", ")}`);
  return rol;
}

function validarEmail(email: string | undefined) {
  const e = email?.trim().toLowerCase();
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error(`Email inválido: ${email}`);
  return e;
}

async function uidDe(email: string) {
  try {
    return (await auth.getUserByEmail(email)).uid;
  } catch (e: any) {
    if (e?.code === "auth/user-not-found") throw new Error(`No existe un usuario con el email ${email}`);
    throw e;
  }
}

async function crear(args: string[]) {
  const email = validarEmail(args[0]);
  const nombre = opcion(args, "nombre");
  const matricula = opcion(args, "matricula") || "";
  const rol = validarRol(opcion(args, "rol"));
  if (!nombre) throw new Error("Falta --nombre");

  let uid: string;
  let nuevo = false;
  try {
    uid = (await auth.getUserByEmail(email)).uid;
    await auth.updateUser(uid, { displayName: nombre });
  } catch (e: any) {
    if (e?.code !== "auth/user-not-found") throw e;
    uid = (await auth.createUser({ email, displayName: nombre })).uid;
    nuevo = true;
  }

  const ahora = new Date().toISOString();
  const ref = usuarios.doc(uid);
  const existente = await ref.get();
  await ref.set(
    {
      email,
      nombre,
      matricula,
      rol,
      activo: true,
      actualizadoEn: ahora,
      ...(existente.exists ? {} : { creadoEn: ahora }),
    },
    { merge: true },
  );

  console.log(`${nuevo ? "Creado" : "Actualizado"}: ${nombre} <${email}> · rol ${rol}${matricula ? ` · Mat. ${matricula}` : ""}`);
}

async function listar() {
  const snap = await usuarios.orderBy("nombre").get();
  if (snap.empty) return console.log("No hay usuarios.");
  snap.docs.forEach((d) => {
    const u = d.data();
    console.log(
      `${u.activo === false ? "[inactivo] " : ""}${u.nombre} <${u.email}> · ${u.rol}${u.matricula ? ` · Mat. ${u.matricula}` : ""}`,
    );
  });
}

async function cambiar(email: string | undefined, cambios: Record<string, unknown>, mensaje: string) {
  const e = validarEmail(email);
  const ref = usuarios.doc(await uidDe(e));
  if (!(await ref.get()).exists) throw new Error(`${e} no está dado de alta. Usá "crear".`);
  await ref.update({ ...cambios, actualizadoEn: new Date().toISOString() });
  console.log(`${e}: ${mensaje}`);
}

async function main() {
  const [comando, ...args] = process.argv.slice(2);
  switch (comando) {
    case "crear":
      return crear(args);
    case "listar":
      return listar();
    case "rol": {
      const rol = validarRol(args[1]);
      return cambiar(args[0], { rol }, `rol cambiado a ${rol}`);
    }
    case "desactivar":
      return cambiar(args[0], { activo: false }, "desactivado");
    case "activar":
      return cambiar(args[0], { activo: true }, "activado");
    default:
      console.log("Comandos: crear, listar, rol, desactivar, activar (ver scripts/usuarios.ts)");
      process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
