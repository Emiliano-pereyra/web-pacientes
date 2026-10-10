import { describe, expect, it } from "vitest";
import {
  calcularCambios,
  calcularEdad,
  edadDePaciente,
  esVacio,
  formatearFecha,
  mostrar,
  normalizarFecha,
  pacienteVacio,
  resultadoMMSE,
  validarSeccion,
  valoresDeSeccion,
} from "./logica";
import { MMSE_ESCALA, MMSE_ITEMS, MMSE_MAX, setPath } from "./schema";

/** Paciente con el mismo puntaje en todos los ítems del MMSE (o con puntajes por ítem). */
function conMMSE(puntajes) {
  const p = pacienteVacio();
  MMSE_ITEMS.forEach((item, i) => {
    const v = typeof puntajes === "function" ? puntajes(item, i) : puntajes[item.id];
    if (v !== undefined) setPath(p, `valoracionMental.${item.id}.puntaje`, v);
  });
  return p;
}

const maximos = (item) => item.max;

// ---------------------------------------------------------------
describe("valores vacíos", () => {
  it.each([undefined, null, "", "   ", "-", " - "])("%j es vacío", (v) => {
    expect(esVacio(v)).toBe(true);
  });

  it.each([0, "0", "texto", false])("%j no es vacío", (v) => {
    expect(esVacio(v)).toBe(false);
  });

  it("mostrar usa el guion largo para vacíos y respeta el 0", () => {
    expect(mostrar("")).toBe("—");
    expect(mostrar(0)).toBe("0");
    expect(mostrar(null, "Sin dato")).toBe("Sin dato");
  });
});

// ---------------------------------------------------------------
describe("fechas", () => {
  it.each([
    ["2024-03-05", "2024-03-05"],
    ["05/03/2024", "2024-03-05"],
    ["5/3/2024", "2024-03-05"],
    ["05-03-2024", "2024-03-05"],
    ["2024-03-05T14:30:00.000Z", "2024-03-05"],
  ])("normaliza %s → %s", (entrada, esperado) => {
    expect(normalizarFecha(entrada)).toBe(esperado);
  });

  it.each(["", null, "ayer", "2024/03/05", "32 de marzo"])("no adivina fechas inválidas: %j", (v) => {
    expect(normalizarFecha(v)).toBe("");
  });

  it("formatea como DD/MM/AAAA y deja el texto original si no es una fecha", () => {
    expect(formatearFecha("2024-03-05")).toBe("05/03/2024");
    expect(formatearFecha("sin fecha")).toBe("sin fecha");
    expect(formatearFecha("")).toBe("");
  });
});

// ---------------------------------------------------------------
describe("edad", () => {
  const ref = new Date(2026, 9, 10); // 10/10/2026

  it("cumple años el mismo día", () => {
    expect(calcularEdad("1950-10-10", ref)).toBe(76);
  });

  it("todavía no cumplió (falta un día)", () => {
    expect(calcularEdad("1950-10-11", ref)).toBe(75);
  });

  it("todavía no cumplió (mes posterior)", () => {
    expect(calcularEdad("1950-11-01", ref)).toBe(75);
  });

  it("ya cumplió este año", () => {
    expect(calcularEdad("1950-01-31", ref)).toBe(76);
  });

  it("acepta el formato DD/MM/AAAA del modelo viejo", () => {
    expect(calcularEdad("10/10/1950", ref)).toBe(76);
  });

  it("nacido el 29 de febrero: en año no bisiesto cumple recién el 1 de marzo", () => {
    expect(calcularEdad("1948-02-29", new Date(2026, 1, 28))).toBe(77);
    expect(calcularEdad("1948-02-29", new Date(2026, 2, 1))).toBe(78);
  });

  it("descarta fechas futuras e imposibles", () => {
    expect(calcularEdad("2030-01-01", ref)).toBeNull();
    expect(calcularEdad("1850-01-01", ref)).toBeNull();
    expect(calcularEdad("", ref)).toBeNull();
  });

  it("sin fecha de nacimiento usa la edad que tenía el modelo viejo, aclarándolo", () => {
    const p = pacienteVacio();
    setPath(p, "datosPersonales.edadRegistrada", "82");
    expect(edadDePaciente(p)).toBe("82 (sin fecha de nacimiento)");
    expect(edadDePaciente(pacienteVacio())).toBe("");
  });
});

// ---------------------------------------------------------------
describe("MMSE", () => {
  it("suma los puntajes y cuenta los ítems completados", () => {
    const r = resultadoMMSE(conMMSE(() => 1));
    expect(r.total).toBe(MMSE_ITEMS.length);
    expect(r.completados).toBe(MMSE_ITEMS.length);
    expect(r.completo).toBe(true);
    expect(r.max).toBe(MMSE_MAX);
  });

  it("no interpreta un MMSE incompleto", () => {
    const r = resultadoMMSE(conMMSE({ orientacionTiempo: 5, orientacionEspacio: 5 }));
    expect(r.completo).toBe(false);
    expect(r.completados).toBe(2);
    expect(r.total).toBe(10);
    expect(r.interpretacion).toBeNull();
  });

  it("un 0 cuenta como ítem respondido", () => {
    const r = resultadoMMSE(conMMSE(() => 0));
    expect(r.completo).toBe(true);
    expect(r.total).toBe(0);
    expect(r.interpretacion).toBe("Deterioro severo");
  });

  it("paciente sin puntajes: nada completado", () => {
    const r = resultadoMMSE(pacienteVacio());
    expect(r).toMatchObject({ total: 0, completados: 0, completo: false, interpretacion: null });
  });

  it.each([
    [14, "Deterioro severo"],
    [15, "Deterioro moderado"],
    [19, "Deterioro moderado"],
    [20, "Deterioro leve"],
    [24, "Deterioro leve"],
    [25, "Ligero déficit"],
  ])("total %i → %s", (objetivo, texto) => {
    // repartir el objetivo entre los ítems sin pasar el máximo de cada uno
    let resto = objetivo;
    const r = resultadoMMSE(
      conMMSE((item) => {
        const v = Math.min(item.max, resto);
        resto -= v;
        return v;
      }),
    );
    expect(r.total).toBe(objetivo);
    expect(r.interpretacion).toBe(texto);
  });

  it("la escala cubre todos los totales posibles sin huecos ni superposiciones", () => {
    for (let total = 0; total <= MMSE_MAX; total++) {
      const tramos = MMSE_ESCALA.filter((e) => total >= e.desde && total <= e.hasta);
      expect(tramos, `total ${total}`).toHaveLength(1);
    }
  });

  // PENDIENTE DE DECISIÓN CLÍNICA: los máximos de la planilla suman 28 (cálculo vale 3),
  // pero la escala pide 30 para "Sin patología". Con todo correcto hoy sale "Ligero déficit".
  // Ver src/lib/paciente/schema.js (MMSE_ITEMS y MMSE_ESCALA).
  it.skip("con todos los ítems en el máximo, la interpretación es «Sin patología»", () => {
    const r = resultadoMMSE(conMMSE(maximos));
    expect(r.total).toBe(30);
    expect(r.interpretacion).toBe("Sin patología");
  });
});

// ---------------------------------------------------------------
describe("validación de datos personales", () => {
  const valida = (entrada, opciones) => validarSeccion("datosPersonales", entrada, opciones);

  it("DNI: limpia puntos y espacios", () => {
    const { valores, errores } = valida({ "datosPersonales.dni": "12.345.678" });
    expect(errores).toEqual({});
    expect(valores["datosPersonales.dni"]).toBe("12345678");
  });

  it.each(["123456", "123456789", "abc"])("DNI inválido: %s", (dni) => {
    const { errores } = valida({ "datosPersonales.dni": dni });
    expect(errores["datosPersonales.dni"]).toBe("El DNI debe tener 7 u 8 dígitos");
  });

  it("DNI de 7 dígitos es válido", () => {
    expect(valida({ "datosPersonales.dni": "1234567" }).errores).toEqual({});
  });

  it("fecha de nacimiento futura", () => {
    const { errores } = valida({ "datosPersonales.fechaNacimiento": "2999-01-01" });
    expect(errores["datosPersonales.fechaNacimiento"]).toBe("La fecha no puede ser futura");
  });

  it("fecha inválida", () => {
    const { errores } = valida({ "datosPersonales.fechaNacimiento": "ayer" });
    expect(errores["datosPersonales.fechaNacimiento"]).toBe("Fecha inválida");
  });

  it("guarda las fechas como AAAA-MM-DD aunque lleguen como DD/MM/AAAA", () => {
    const { valores } = valida({ "datosPersonales.fechaNacimiento": "05/03/1950" });
    expect(valores["datosPersonales.fechaNacimiento"]).toBe("1950-03-05");
  });

  it("el ingreso no puede ser anterior al nacimiento", () => {
    const { errores } = valida({
      "datosPersonales.fechaNacimiento": "1950-03-05",
      "datosPersonales.fechaIngreso": "1949-01-01",
    });
    expect(errores["datosPersonales.fechaIngreso"]).toBe("La fecha de ingreso es anterior al nacimiento");
  });

  it("género solo acepta las opciones del esquema", () => {
    expect(valida({ "datosPersonales.genero": "Femenino" }).errores).toEqual({});
    expect(valida({ "datosPersonales.genero": "X" }).errores["datosPersonales.genero"]).toBe("Opción inválida");
  });

  it("en el alta el nombre es obligatorio aunque no venga", () => {
    const { errores } = valida({}, { esAlta: true });
    expect(errores["datosPersonales.nombreCompleto"]).toBe("Nombre completo es obligatorio");
  });

  it("al editar, lo que no se envía no se toca ni se exige", () => {
    const { valores, errores } = valida({ "datosPersonales.dni": "12345678" });
    expect(errores).toEqual({});
    expect(Object.keys(valores)).toEqual(["datosPersonales.dni"]);
  });

  it("nombre demasiado corto", () => {
    const { errores } = valida({ "datosPersonales.nombreCompleto": "Al" });
    expect(errores["datosPersonales.nombreCompleto"]).toBe("El nombre es demasiado corto");
  });

  it("ignora campos de otras secciones", () => {
    const { valores } = valida({ "diagnostico.enfermedadActual": "x", "datosPersonales.dni": "12345678" });
    expect(valores).not.toHaveProperty(["diagnostico.enfermedadActual"]);
  });

  it("sección inexistente", () => {
    expect(validarSeccion("noExiste", {}).errores).toEqual({ _seccion: "Sección inexistente" });
  });
});

// ---------------------------------------------------------------
describe("validación de puntajes del MMSE", () => {
  const path = "valoracionMental.orientacionTiempo.puntaje"; // máximo 5
  const valida = (v) => validarSeccion("valoracionMental", { [path]: v });

  it.each([
    [0, 0],
    ["3", 3],
    [5, 5],
  ])("acepta %j como %i", (entrada, esperado) => {
    const { valores, errores } = valida(entrada);
    expect(errores).toEqual({});
    expect(valores[path]).toBe(esperado);
  });

  it.each([6, -1, 2.5, "dos"])("rechaza %j", (v) => {
    expect(valida(v).errores[path]).toBe("Debe ser un número entero entre 0 y 5");
  });

  it("vacío deja el ítem sin puntuar (null), no en 0", () => {
    expect(valida("").valores[path]).toBeNull();
  });
});

// ---------------------------------------------------------------
describe("cambios para el historial", () => {
  it("registra valor anterior y nuevo solo de lo que cambió", () => {
    const p = pacienteVacio();
    setPath(p, "diagnostico.enfermedadActual", "HTA");
    setPath(p, "diagnostico.enfermedadBase", "DBT");
    const cambios = calcularCambios(p, {
      "diagnostico.enfermedadActual": "HTA controlada",
      "diagnostico.enfermedadBase": "DBT",
    });
    expect(cambios).toEqual([{ campo: "diagnostico.enfermedadActual", anterior: "HTA", nuevo: "HTA controlada" }]);
  });

  it("vacío, null y el «-» viejo son lo mismo: no generan cambios falsos", () => {
    const p = pacienteVacio();
    setPath(p, "diagnostico.enfermedadActual", "-");
    expect(calcularCambios(p, { "diagnostico.enfermedadActual": "" })).toEqual([]);
  });

  it("borrar un valor queda registrado como nuevo = null", () => {
    const p = pacienteVacio();
    setPath(p, "diagnostico.enfermedadActual", "HTA");
    expect(calcularCambios(p, { "diagnostico.enfermedadActual": "" })).toEqual([
      { campo: "diagnostico.enfermedadActual", anterior: "HTA", nuevo: null },
    ]);
  });
});

// ---------------------------------------------------------------
describe("precarga de formularios", () => {
  it("convierte fechas viejas y deja los puntajes vacíos como texto vacío", () => {
    const p = pacienteVacio();
    setPath(p, "datosPersonales.fechaNacimiento", "05/03/1950");
    const v = valoresDeSeccion(p, "datosPersonales");
    expect(v["datosPersonales.fechaNacimiento"]).toBe("1950-03-05");

    const m = valoresDeSeccion(conMMSE({ orientacionTiempo: 4 }), "valoracionMental");
    expect(m["valoracionMental.orientacionTiempo.puntaje"]).toBe(4);
    expect(m["valoracionMental.copia.puntaje"]).toBe("");
  });
});
