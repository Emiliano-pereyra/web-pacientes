/**
 * ESQUEMA ÚNICO DEL PACIENTE
 * ---------------------------------------------------------------
 * Fuente de verdad para: formularios (crear/editar), validación en la API,
 * vistas de cada pestaña, generación de PDFs y migración del modelo viejo.
 *
 * Cada campo tiene un `path` con la ruta en el documento de Firestore,
 * por ejemplo "antecedentes.cardiovascular.ta".
 *
 * Tipos de campo:
 *   text      → línea simple
 *   textarea  → texto largo
 *   date      → fecha "YYYY-MM-DD"
 *   dni       → solo dígitos (7 u 8)
 *   select    → requiere `opciones`
 *   puntaje   → entero entre 0 y `max` (MMSE)
 */

// ---------------------------------------------------------------
// MMSE (Mini-Mental) — ítems según la planilla actual
// ---------------------------------------------------------------
export const MMSE_ITEMS = [
  { id: "orientacionTiempo", label: "Orientación en tiempo (día de hoy)", max: 5 },
  { id: "orientacionEspacio", label: "Orientación en espacio (lugar)", max: 5 },
  { id: "fijacion", label: "Fijación: repita árbol, caballo, moneda", max: 3 },
  { id: "calculo", label: "Concentración y cálculo: 100 - 3 (tres veces)", max: 3 },
  { id: "memoria", label: "Memoria: nombre de las tres palabras anteriores", max: 3 },
  { id: "denominacion", label: "¿Qué es esto? Lápiz, reloj", max: 2 },
  { id: "repeticion", label: "Repita: «en un trigal había 5 perros»", max: 1 },
  { id: "lectura", label: "Lea esto: «CIERRE LOS OJOS» y hágalo", max: 1 },
  { id: "escritura", label: "Escriba una frase", max: 1 },
  { id: "ordenTriple", label: "Tome el papel con la mano izquierda y dóblelo a la mitad", max: 3 },
  { id: "copia", label: "Copie este dibujo", max: 1 },
];

export const MMSE_MAX = MMSE_ITEMS.reduce((acc, i) => acc + i.max, 0);

// Escala de la planilla en papel, ajustada a su máximo real: los ítems suman 28
// (cálculo vale 3, no 5 como en el MMSE estándar de 30). Solo se movió el tope;
// los demás cortes son los originales. Definido por el equipo (10/10/2026).
export const MMSE_ESCALA = [
  { desde: 28, hasta: 28, texto: "Sin patología" },
  { desde: 25, hasta: 27, texto: "Ligero déficit" },
  { desde: 20, hasta: 24, texto: "Deterioro leve" },
  { desde: 15, hasta: 19, texto: "Deterioro moderado" },
  { desde: 0, hasta: 14, texto: "Deterioro severo" },
];

// ---------------------------------------------------------------
// Helpers para construir grupos de campos
// ---------------------------------------------------------------
const campo = (path, label, extra = {}) => ({ path, label, tipo: "text", ...extra });
const texto = (path, label, extra = {}) => ({ path, label, tipo: "textarea", ...extra });
const fecha = (path, label, extra = {}) => ({ path, label, tipo: "date", ...extra });

const grupo = (seccion, id, titulo, items, conObservaciones = false) => ({
  id,
  titulo,
  campos: [
    ...items.map(([k, l]) => campo(`${seccion}.${id}.${k}`, l)),
    ...(conObservaciones
      ? [texto(`${seccion}.${id}.observaciones`, "Observaciones")]
      : []),
  ],
});

// ---------------------------------------------------------------
// SECCIONES — unidad de edición (cada una tiene su botón "Editar")
// ---------------------------------------------------------------
export const SECCIONES = {
  datosPersonales: {
    titulo: "Datos personales",
    grupos: [
      {
        id: "datos",
        titulo: null,
        campos: [
          campo("datosPersonales.nombreCompleto", "Nombre completo", { requerido: true }),
          campo("datosPersonales.dni", "DNI", { tipo: "dni" }),
          campo("datosPersonales.genero", "Género", {
            tipo: "select",
            opciones: ["Femenino", "Masculino", "Otro"],
          }),
          fecha("datosPersonales.fechaNacimiento", "Fecha de nacimiento", { noFutura: true }),
          campo("datosPersonales.obraSocial", "Obra social"),
          campo("datosPersonales.afiliadoNumero", "N.º de afiliado"),
          fecha("datosPersonales.fechaIngreso", "Fecha de ingreso", { noFutura: true }),
        ],
      },
    ],
  },

  antecedentes: {
    titulo: "Antecedentes",
    grupos: [
      grupo("antecedentes", "cardiovascular", "Cardiovasculares", [["ta", "TA"], ["cardio", "Cardio"]], true),
      grupo("antecedentes", "digestivo", "Digestivos", [["digestivos", "Digestivos"], ["constipacion", "Constipación"]], true),
      grupo("antecedentes", "metabolico", "Metabólicos / DBT", [["metabolicas", "Metabólicas"], ["tiroides", "Tiroides"]], true),
      grupo("antecedentes", "sensorial", "Sensoriales", [["auditivas", "Auditivas"], ["olfativas", "Olfativas"], ["visuales", "Visuales"], ["gustativas", "Gustativas"]]),
      grupo("antecedentes", "ginecologico", "Ginecológicos", [["ginecologicas", "Ginecológicas"]]),
      grupo("antecedentes", "vascularPeriferico", "Vascular periférico", [["edemas", "Edemas"], ["varices", "Várices"], ["ulceras", "Úlceras"]]),
      grupo("antecedentes", "neurologico", "Neurológicos (SNC)", [["paralisis", "Parálisis"], ["parestesias", "Parestesias"], ["temblores", "Temblores"], ["convulsiones", "Convulsiones"], ["afasias", "Afasias"], ["disartria", "Disartria"]], true),
      grupo("antecedentes", "urologico", "Urológicos", [["urologicas", "Urológicas"]], true),
      grupo("antecedentes", "dermatologico", "Dermatológicos", [["dermatologicas", "Dermatológicas"]]),
      grupo("antecedentes", "psiquico", "Psíquicos", [["actitudActiva", "Actitud activa"], ["actitudPasiva", "Actitud pasiva"]], true),
      grupo("antecedentes", "otros", "Otros", [], true),
    ],
  },

  examenFisico: {
    titulo: "Examen físico",
    grupos: [
      grupo("examenFisico", "mental", "Trastornos mentales", [["atencion", "Atención"], ["orientacion", "Orientación"], ["memoria", "Memoria"], ["signosDepresivos", "Signos depresivos"], ["sueno", "Trastornos del sueño"]], true),
      grupo("examenFisico", "facial", "Faciales", [["ojos", "Ojos"], ["boca", "Boca"], ["denticion", "Dentición"]]),
      grupo("examenFisico", "cuello", "Cuello", [["adenopatias", "Adenopatías"], ["bocio", "Bocio"]]),
      grupo("examenFisico", "cardiovascular", "Ap. cardiovascular", [["r1r2", "R1 y R2"]], true),
      grupo("examenFisico", "fallaCardiaca", "Signos de falla cardíaca", [["ta", "TA"], ["edemas", "Edemas"]]),
      grupo("examenFisico", "piel", "Dermatológicos", [["tejCp", "TEJ CP"], ["peso", "Peso"]]),
      grupo("examenFisico", "respiratorio", "Ap. respiratorio", [["percusion", "Percusión"], ["auscultacion", "Auscultación"]], true),
      grupo("examenFisico", "digestivo", "Ap. digestivo", [["abdomen", "Abdomen"], ["palpacion", "A la palpación"], ["catarsis", "Catarsis"], ["controlEsfinter", "Control de esfínter"]], true),
      grupo("examenFisico", "genitourinario", "Ap. genitourinario", [["ppbl", "PPBL"], ["controlEsfinter", "Control de esfínter"]], true),
      grupo("examenFisico", "neurologico", "SNC", [["alteracionesMotoras", "Alteraciones motoras"], ["sensitivas", "Sensitivas"], ["temblores", "Temblores"], ["postura", "Postura"], ["equilibrio", "Equilibrio"], ["marcha", "Marcha"]], true),
      grupo("examenFisico", "otros", "Otros", [], true),
    ],
  },

  diagnostico: {
    titulo: "Diagnóstico",
    grupos: [
      {
        id: "enfermedadBase",
        titulo: "Enfermedad de base",
        campos: [
          texto("diagnostico.enfermedadBase", "Enfermedad de base", { conHistorial: true }),
          fecha("diagnostico.fechaEnfermedadBase", "Fecha de diagnóstico", { noFutura: true }),
        ],
      },
      {
        id: "enfermedadActual",
        titulo: "Enfermedad actual",
        campos: [texto("diagnostico.enfermedadActual", "Enfermedad actual", { conHistorial: true })],
      },
      {
        id: "antecedentesPatologicos",
        titulo: "Antecedentes patológicos",
        campos: [texto("diagnostico.antecedentesPatologicos", "Antecedentes patológicos", { conHistorial: true })],
      },
    ],
  },

  tratamiento: {
    titulo: "Tratamiento",
    grupos: [
      {
        id: "tratamientoBase",
        titulo: "Tratamiento de base",
        campos: [
          texto("tratamiento.tratamientoBase", "Tratamiento de base", { conHistorial: true }),
          fecha("tratamiento.fechaTratamientoBase", "Fecha de inicio", { noFutura: true }),
        ],
      },
      {
        id: "tratamientoActual",
        titulo: "Tratamiento actual",
        campos: [texto("tratamiento.tratamientoActual", "Tratamiento actual", { conHistorial: true })],
      },
    ],
  },

  valoracionSocial: {
    titulo: "Valoración social",
    grupos: [
      {
        id: "social",
        titulo: null,
        campos: [
          campo("valoracionSocial.acompanado", "¿Acompañado?"),
          campo("valoracionSocial.conQuienVive", "Con quién vive"),
          campo("valoracionSocial.concurreALaConsulta", "Concurre a la consulta"),
          campo("valoracionSocial.conyuge", "Cónyuge"),
          campo("valoracionSocial.hermanos", "Hermanos"),
          campo("valoracionSocial.hijos", "Hijos"),
          texto("valoracionSocial.otros", "Otros"),
        ],
      },
    ],
  },

  valoracionMental: {
    titulo: "Valoración mental (MMSE)",
    esMMSE: true,
    grupos: [
      ...MMSE_ITEMS.map((item) => ({
        id: item.id,
        titulo: `${item.label} (${item.max})`,
        campos: [
          campo(`valoracionMental.${item.id}.respuesta`, "Respuesta"),
          { path: `valoracionMental.${item.id}.puntaje`, label: "Puntaje", tipo: "puntaje", max: item.max },
        ],
      })),
      {
        id: "observaciones",
        titulo: "Observaciones",
        campos: [texto("valoracionMental.observaciones", "Observaciones")],
      },
    ],
  },

  valoracionFuncional: {
    titulo: "Valoración funcional",
    grupos: [
      {
        id: "funcional",
        titulo: null,
        campos: [
          campo("valoracionFuncional.camina", "Camina"),
          campo("valoracionFuncional.levantateYAnda", "Levántate y anda"),
          campo("valoracionFuncional.articulaciones", "Articulaciones"),
          campo("valoracionFuncional.pasaMuchoTiempoSentado", "Pasa mucho tiempo sentado"),
          campo("valoracionFuncional.equilibrio", "Equilibrio"),
          campo("valoracionFuncional.caidas", "Caídas"),
        ],
      },
    ],
  },

  familia: {
    titulo: "Familia / Apoderado",
    grupos: [
      {
        id: "apoderado",
        titulo: "Apoderado",
        campos: [
          campo("familia.apoderadoNombre", "Nombre del apoderado"),
          campo("familia.apoderadoDni", "DNI del apoderado", { tipo: "dni" }),
          campo("familia.apoderadoParentesco", "En calidad de (parentesco)"),
        ],
      },
      {
        id: "consentimiento",
        titulo: "Consentimiento",
        campos: [
          campo("familia.residenteNombre", "Nombre del residente"),
          texto("familia.consentimientoTexto", "Texto del consentimiento"),
        ],
      },
    ],
  },

  interconsulta: {
    titulo: "Interconsulta",
    grupos: [
      {
        id: "interconsulta",
        titulo: null,
        campos: [
          fecha("interconsulta.fecha", "Fecha"),
          campo("interconsulta.especialidad", "Especialidad"),
          texto("interconsulta.motivo", "Motivo de la consulta", { conHistorial: true }),
          texto("interconsulta.informe", "Informe de interconsulta", { conHistorial: true }),
        ],
      },
    ],
  },
};

export const SECCION_KEYS = Object.keys(SECCIONES);

// Secciones que se pueden completar al crear el paciente
export const SECCIONES_ALTA = ["datosPersonales", "antecedentes", "examenFisico", "diagnostico", "tratamiento"];

// ---------------------------------------------------------------
// PESTAÑAS — qué secciones muestra (e imprime) cada una
// ---------------------------------------------------------------
export const PESTANAS = [
  {
    id: "antecedentes",
    titulo: "Antecedentes",
    tituloPdf: "Historia clínica — Antecedentes y examen físico",
    secciones: ["antecedentes", "examenFisico", "tratamiento"],
    seccionesPlegables: true, // muchos campos: cada sección se despliega por separado
  },
  {
    id: "clinico",
    titulo: "Clínico Psicosocial",
    tituloPdf: "Valoración geriátrica",
    secciones: ["valoracionSocial", "valoracionMental", "valoracionFuncional"],
    seccionesPlegables: true,
    conEvoluciones: true,
  },
  {
    id: "resumenHc",
    titulo: "Resumen HC",
    tituloPdf: "Resumen de historia clínica",
    secciones: ["diagnostico", "tratamiento"],
  },
  {
    id: "fliaYApod",
    titulo: "Información Familiar / Apoderado",
    tituloPdf: "Información familiar / Apoderado",
    secciones: ["familia"],
    conFirmas: true,
  },
  {
    id: "interconsulta",
    titulo: "Interconsulta",
    tituloPdf: "Interconsulta",
    secciones: ["interconsulta", "diagnostico", "tratamiento"],
    conFirmas: true,
  },
];

// ---------------------------------------------------------------
// Utilidades de acceso
// ---------------------------------------------------------------
export function camposDeSeccion(seccionKey) {
  const s = SECCIONES[seccionKey];
  if (!s) return [];
  return s.grupos.flatMap((g) => g.campos);
}

export const TODOS_LOS_CAMPOS = SECCION_KEYS.flatMap(camposDeSeccion);

const CAMPOS_POR_PATH = Object.fromEntries(TODOS_LOS_CAMPOS.map((c) => [c.path, c]));

export function campoPorPath(path) {
  return CAMPOS_POR_PATH[path];
}

export function getPath(obj, path) {
  return path.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  keys.slice(0, -1).forEach((k) => {
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  });
  cur[keys[keys.length - 1]] = value;
  return obj;
}

/** Clave segura para mapas de Firestore (no admite puntos en claves). */
export const claveModificacion = (path) => path.replaceAll(".", "__");
