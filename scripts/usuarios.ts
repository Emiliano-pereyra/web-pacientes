/**
 * Gestión de usuarios del sistema.
 *
 * Uso (con GOOGLE_APPLICATION_CREDENTIALS=./service-account.json):
 *   npm run usuarios -- crear <email> --nombre "Nombre" --rol profesional --matricula "MN 1234"
 *   npm run usuarios -- crear <email> --nombre "Nombre" --rol admin [--matricula "MN 1234"]
 *   npm run usuarios -- crear <email> --nombre "Nombre" --rol secretaria --profesional <email del profesional>
 *   npm run usuarios -- listar
 *   npm run usuarios -- rol <email> admin|profesional|secretaria [--matricula X] [--profesional <email>]
 *   npm run usuarios -- asignar <email secretaria/o> <email profesional>
 *   npm run usuarios -- matricula <email> <matrícula>      (usar "-" para quitarla)
 *   npm run usuarios -- desactivar <email>
 *   npm run usuarios -- activar <email>
 *
 * Reglas:
 *  - profesional: matrícula obligatoria.
 *  - admin: matrícula opcional.
 *  - secretaria: sin matrícula; vinculada a un profesional activo. Lo que imprime sale a
 *    nombre de ese profesional (ver src/lib/usuarios.js).
 *
 * `crear` da de alta la cuenta en Firebase Auth (si no existe) y el documento
 * `usuarios/{uid}`; si ya existe, la actualiza. Desactivar no borra nada.
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { ROLES, admiteMatricula, etiquetaProfesional, requiereMatricula, requiereProfesional } from "../src/lib/usuarios";

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

/** Busca un profesional activo por email y devuelve su uid. */
async function profesionalActivo(email: string | undefined) {
  const e = validarEmail(email);
  const uid = await uidDe(e);
  const snap = await usuarios.doc(uid).get();
  const p = snap.data();
  if (!p || !requiereMatricula(p.rol)) throw new Error(`${e} no es un profesional dado de alta`);
  if (p.activo === false) throw new Error(`${e} está desactivado`);
  return { uid, ...p };
}

/**
 * Aplica las reglas de matrícula y profesional vinculado según el rol.
 * Devuelve los campos a guardar.
 */
async function camposDeRol(rol: string, { matricula, profesional }: { matricula?: string; profesional?: string }) {
  if (requiereMatricula(rol) && !matricula) throw new Error("Un profesional necesita --matricula");
  if (!admiteMatricula(rol) && matricula) throw new Error("Una secretaria/o no lleva matrícula");
  if (requiereProfesional(rol)) {
    if (!profesional) throw new Error("Una secretaria/o necesita --profesional <email del profesional>");
    const p = await profesionalActivo(profesional);
    return { matricula: "", profesionalUid: p.uid, _profesional: p };
  }
  return { matricula: matricula || "", profesionalUid: FieldValue.delete() };
}

async function crear(args: string[]) {
  const email = validarEmail(args[0]);
  const nombre = opcion(args, "nombre");
  const rol = validarRol(opcion(args, "rol"));
  if (!nombre) throw new Error("Falta --nombre");
  const { _profesional, ...campos } = (await camposDeRol(rol, {
    matricula: opcion(args, "matricula"),
    profesional: opcion(args, "profesional"),
  })) as any;

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
    { email, nombre, rol, activo: true, actualizadoEn: ahora, ...campos, ...(existente.exists ? {} : { creadoEn: ahora }) },
    { merge: true },
  );

  const detalle = _profesional ? ` · de ${etiquetaProfesional(_profesional)}` : campos.matricula ? ` · Mat. ${campos.matricula}` : "";
  console.log(`${nuevo ? "Creado" : "Actualizado"}: ${nombre} <${email}> · ${ROLES[rol as keyof typeof ROLES]}${detalle}`);
}

async function listar() {
  const snap = await usuarios.orderBy("nombre").get();
  if (snap.empty) return console.log("No hay usuarios.");
  const porUid = new Map(snap.docs.map((d) => [d.id, d.data()]));
  snap.docs.forEach((d) => {
    const u = d.data();
    let detalle = u.matricula ? ` · Mat. ${u.matricula}` : "";
    if (requiereProfesional(u.rol)) {
      const p = porUid.get(u.profesionalUid);
      detalle = p ? ` · de ${etiquetaProfesional(p)}${p.activo === false ? " [profesional inactivo]" : ""}` : " · SIN PROFESIONAL";
    }
    console.log(`${u.activo === false ? "[inactivo] " : ""}${u.nombre} <${u.email}> · ${ROLES[u.rol as keyof typeof ROLES] || u.rol}${detalle}`);
  });
}

async function documentoDe(email: string | undefined) {
  const e = validarEmail(email);
  const ref = usuarios.doc(await uidDe(e));
  const snap = await ref.get();
  if (!snap.exists) throw new Error(`${e} no está dado de alta. Usá "crear".`);
  return { email: e, ref, datos: snap.data()! };
}

async function cambiarRol(args: string[]) {
  const { email, ref, datos } = await documentoDe(args[0]);
  const rol = validarRol(args[1]);
  const { _profesional, ...campos } = (await camposDeRol(rol, {
    // al cambiar de rol se conserva la matrícula si el nuevo rol la admite
    matricula: opcion(args, "matricula") ?? (admiteMatricula(rol) ? datos.matricula : undefined),
    profesional: opcion(args, "profesional"),
  })) as any;
  await ref.update({ rol, ...campos, actualizadoEn: new Date().toISOString() });
  console.log(`${email}: rol cambiado a ${ROLES[rol as keyof typeof ROLES]}`);
}

async function asignar(args: string[]) {
  const { email, ref, datos } = await documentoDe(args[0]);
  if (!requiereProfesional(datos.rol)) throw new Error(`${email} no es secretaria/o`);
  const p = await profesionalActivo(args[1]);
  await ref.update({ profesionalUid: p.uid, actualizadoEn: new Date().toISOString() });
  console.log(`${email}: ahora es secretaria/o de ${etiquetaProfesional(p)}`);
}

async function cambiarMatricula(args: string[]) {
  const { email, ref, datos } = await documentoDe(args[0]);
  const valor = args[1]?.trim();
  if (!valor) throw new Error('Indicá la matrícula, o "-" para quitarla');
  const matricula = valor === "-" ? "" : valor;
  if (!admiteMatricula(datos.rol) && matricula) throw new Error("Una secretaria/o no lleva matrícula");
  if (requiereMatricula(datos.rol) && !matricula) throw new Error("Un profesional no puede quedar sin matrícula");
  await ref.update({ matricula, actualizadoEn: new Date().toISOString() });
  console.log(`${email}: ${matricula ? `matrícula ${matricula}` : "sin matrícula"}`);
}

async function activar(email: string | undefined, activo: boolean) {
  const { email: e, ref, datos } = await documentoDe(email);
  await ref.update({ activo, actualizadoEn: new Date().toISOString() });
  console.log(`${e}: ${activo ? "activado" : "desactivado"}`);
  if (!activo && requiereMatricula(datos.rol)) {
    const vinculadas = await usuarios.where("profesionalUid", "==", ref.id).get();
    const activas = vinculadas.docs.filter((d) => d.data().activo !== false);
    if (activas.length) {
      console.log(
        `Atención: ${activas.length} secretaria/o(s) quedan sin profesional activo y no podrán entrar hasta reasignarlas:`,
      );
      activas.forEach((d) => console.log(`  - ${d.data().nombre} <${d.data().email}>  →  npm run usuarios -- asignar <email> <otro profesional>`));
    }
  }
}

async function main() {
  const [comando, ...args] = process.argv.slice(2);
  switch (comando) {
    case "crear":
      return crear(args);
    case "listar":
      return listar();
    case "rol":
      return cambiarRol(args);
    case "asignar":
      return asignar(args);
    case "matricula":
      return cambiarMatricula(args);
    case "desactivar":
      return activar(args[0], false);
    case "activar":
      return activar(args[0], true);
    default:
      console.log("Comandos: crear, listar, rol, asignar, matricula, desactivar, activar (ver scripts/usuarios.ts)");
      process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
