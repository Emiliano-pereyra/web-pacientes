import { describe, expect, it } from "vitest";
import {
  ROLES,
  admiteMatricula,
  etiquetaAutor,
  etiquetaProfesional,
  requiereMatricula,
  requiereProfesional,
  responsableDe,
} from "./usuarios";
import { formatearTamano, plural } from "./cliente/formato";

const profesional = { uid: "p1", nombre: "maria eugenia padula", matricula: "MN79276 MP 38056", rol: "profesional" };
const secretaria = { uid: "s1", nombre: "Ana López", matricula: "", rol: "secretaria" };
const admin = { uid: "a1", nombre: "nicolas pereyra", matricula: "", rol: "admin" };

describe("roles", () => {
  it("roles disponibles", () => {
    expect(Object.keys(ROLES)).toEqual(["admin", "profesional", "secretaria"]);
    expect(ROLES.secretaria).toBe("Secretaria/o");
  });

  it("matrícula: obligatoria para profesional, opcional para admin, no admitida para secretaria/o", () => {
    expect(requiereMatricula("profesional")).toBe(true);
    expect(requiereMatricula("admin")).toBe(false);
    expect(admiteMatricula("admin")).toBe(true);
    expect(admiteMatricula("secretaria")).toBe(false);
  });

  it("solo la secretaria/o necesita profesional vinculado", () => {
    expect(requiereProfesional("secretaria")).toBe(true);
    expect(requiereProfesional("profesional")).toBe(false);
    expect(requiereProfesional("admin")).toBe(false);
  });
});

describe("etiqueta del profesional", () => {
  it("incluye la matrícula", () => {
    expect(etiquetaProfesional(profesional)).toBe("maria eugenia padula (Mat. MN79276 MP 38056)");
  });

  it("sin matrícula queda solo el nombre", () => {
    expect(etiquetaProfesional({ nombre: " Juan Pérez ", matricula: " " })).toBe("Juan Pérez");
  });
});

describe("profesional responsable (el que figura en los PDF)", () => {
  it("un profesional es responsable de lo suyo", () => {
    expect(responsableDe(profesional)).toEqual({ uid: "p1", nombre: profesional.nombre, matricula: profesional.matricula });
  });

  it("un admin sin matrícula figura con su nombre", () => {
    expect(responsableDe(admin)).toEqual({ uid: "a1", nombre: "nicolas pereyra", matricula: "" });
  });

  it("una secretaria/o imprime a nombre y matrícula de su profesional, no del suyo", () => {
    expect(responsableDe(secretaria, profesional)).toEqual({
      uid: "p1",
      nombre: "maria eugenia padula",
      matricula: "MN79276 MP 38056",
    });
  });

  it.each([
    ["sin profesional vinculado", null],
    ["con el profesional desactivado", { ...profesional, activo: false }],
    ["vinculada a alguien que no es profesional", { ...admin }],
  ])("una secretaria/o %s no tiene responsable", (_, vinculado) => {
    expect(responsableDe(secretaria, vinculado)).toBeNull();
  });
});

describe("autor en historial y evoluciones", () => {
  it("registra a la persona real y aclara de qué profesional es", () => {
    expect(etiquetaAutor(secretaria, responsableDe(secretaria, profesional))).toBe(
      "Ana López (secretaria/o de maria eugenia padula (Mat. MN79276 MP 38056))",
    );
  });

  it("un profesional figura con su matrícula", () => {
    expect(etiquetaAutor(profesional, responsableDe(profesional))).toBe("maria eugenia padula (Mat. MN79276 MP 38056)");
  });

  it("un admin sin matrícula figura solo con su nombre", () => {
    expect(etiquetaAutor(admin, responsableDe(admin))).toBe("nicolas pereyra");
  });
});

describe("formatos del front", () => {
  it.each([
    [512, "512 B"],
    [2048, "2 KB"],
    [3_500_000, "3,3 MB"],
  ])("tamaño %i → %s", (bytes, texto) => {
    expect(formatearTamano(bytes)).toBe(texto);
  });

  it("tamaño desconocido", () => {
    expect(formatearTamano(undefined)).toBe("");
  });

  it("plural", () => {
    expect(plural(1, "archivo")).toBe("1 archivo");
    expect(plural(3, "archivo")).toBe("3 archivos");
    expect(plural(0, "paciente")).toBe("0 pacientes");
  });
});
