/**
 * Migración del modelo viejo (campos planos con nombres inconsistentes)
 * al modelo unificado (schemaVersion 2).
 *
 * Se usa en dos lugares:
 *  - Al leer un paciente que todavía no fue migrado (se normaliza en memoria).
 *  - Al escribir sobre un paciente viejo (se guarda ya migrado) y en el script
 *    scripts/migrar-modelo.mjs, que migra toda la colección de una vez.
 *
 * Cuando varios campos viejos apuntan al mismo campo nuevo, se concatenan los
 * valores distintos (no se pierde nada).
 */
import { MMSE_ITEMS, claveModificacion, getPath, setPath } from "./schema";
import { SCHEMA_VERSION, esVacio, normalizarFecha, pacienteVacio } from "./logica";

// path nuevo → lista de campos viejos (en orden de prioridad)
export const MAPA_LEGACY = {
  // Datos personales
  "datosPersonales.nombreCompleto": ["nombreCompleto"],
  "datosPersonales.dni": ["dni"],
  "datosPersonales.genero": ["genero"],
  "datosPersonales.fechaNacimiento": ["fechaNacimiento"],
  "datosPersonales.obraSocial": ["obraSocial", "os"],
  "datosPersonales.afiliadoNumero": ["afiliadoNumero", "afNumero"],
  "datosPersonales.fechaIngreso": ["fechaIngreso"],
  "datosPersonales.edadRegistrada": ["edad"],

  // Antecedentes (detalle + texto libre por aparato)
  "antecedentes.cardiovascular.ta": ["TA"],
  "antecedentes.cardiovascular.cardio": ["Cardio"],
  "antecedentes.cardiovascular.observaciones": ["antecedentesCardiovascular"],
  "antecedentes.digestivo.digestivos": ["Digestivos"],
  "antecedentes.digestivo.constipacion": ["Constipacion"],
  "antecedentes.digestivo.observaciones": ["antecedentesDigestivo"],
  "antecedentes.metabolico.metabolicas": ["Metabolicas"],
  "antecedentes.metabolico.tiroides": ["Tiroides"],
  "antecedentes.metabolico.observaciones": ["antecedentesMetabolico"],
  "antecedentes.sensorial.auditivas": ["Auditivas"],
  "antecedentes.sensorial.olfativas": ["Olfativas"],
  "antecedentes.sensorial.visuales": ["Visuales"],
  "antecedentes.sensorial.gustativas": ["Gustativas"],
  "antecedentes.ginecologico.ginecologicas": ["Ginecologicas"],
  "antecedentes.vascularPeriferico.edemas": ["Edemas"],
  "antecedentes.vascularPeriferico.varices": ["Varices"],
  "antecedentes.vascularPeriferico.ulceras": ["Ulceras"],
  "antecedentes.neurologico.paralisis": ["Paralisis"],
  "antecedentes.neurologico.parestesias": ["Parestesias"],
  "antecedentes.neurologico.temblores": ["Temblores"],
  "antecedentes.neurologico.convulsiones": ["Convulsiones"],
  "antecedentes.neurologico.afasias": ["Afasias"],
  "antecedentes.neurologico.disartria": ["Disartria"],
  "antecedentes.neurologico.observaciones": ["antecedentesNeurologico"],
  "antecedentes.urologico.urologicas": ["Urologicas"],
  "antecedentes.urologico.observaciones": ["antecedentesUrologico"],
  "antecedentes.dermatologico.dermatologicas": ["Dermatologicas"],
  "antecedentes.psiquico.actitudActiva": ["PsiquicaActiva"],
  "antecedentes.psiquico.actitudPasiva": ["PsiquicaPasiva"],
  "antecedentes.psiquico.observaciones": ["antecedentesPsiquiatrico"],
  "antecedentes.otros.observaciones": ["antecedentesOtros"],

  // Examen físico
  "examenFisico.mental.atencion": ["TrAtencion"],
  "examenFisico.mental.orientacion": ["TrOrientacion"],
  "examenFisico.mental.memoria": ["TrMemoria"],
  "examenFisico.mental.signosDepresivos": ["TrSignoDepre", "SignoDepre"],
  "examenFisico.mental.sueno": ["TrSueno"],
  "examenFisico.mental.observaciones": ["examenOrientacion"],
  "examenFisico.facial.ojos": ["FacialOjos"],
  "examenFisico.facial.boca": ["FacialBoca"],
  "examenFisico.facial.denticion": ["FacialDenticion"],
  "examenFisico.cuello.adenopatias": ["Adenopatias"],
  "examenFisico.cuello.bocio": ["Bocio"],
  "examenFisico.cardiovascular.r1r2": ["CardioR1R2"],
  "examenFisico.cardiovascular.observaciones": ["examenCardiovascular"],
  "examenFisico.fallaCardiaca.ta": ["CardiacaTA"],
  "examenFisico.fallaCardiaca.edemas": ["CardiacaEdemas"],
  "examenFisico.piel.tejCp": ["TEJCP"],
  "examenFisico.piel.peso": ["Peso"],
  "examenFisico.respiratorio.percusion": ["Percusion"],
  "examenFisico.respiratorio.auscultacion": ["Auscultacion"],
  "examenFisico.respiratorio.observaciones": ["RespiratoriaOtros", "examenRespiratorio"],
  "examenFisico.digestivo.abdomen": ["Abdomen"],
  "examenFisico.digestivo.palpacion": ["Palpacion"],
  "examenFisico.digestivo.catarsis": ["Catarsis"],
  "examenFisico.digestivo.controlEsfinter": ["DigestivoEsfinter"],
  "examenFisico.digestivo.observaciones": ["DigestivoOtros", "examenDigestivo"],
  "examenFisico.genitourinario.ppbl": ["PPBL"],
  "examenFisico.genitourinario.controlEsfinter": ["GenitourinarioEsfinter"],
  "examenFisico.genitourinario.observaciones": ["GenitourinarioOtros", "examenGenitourinario"],
  "examenFisico.neurologico.alteracionesMotoras": ["SNCAltMotoras"],
  "examenFisico.neurologico.sensitivas": ["SNCSensitivas"],
  "examenFisico.neurologico.temblores": ["SNCTemblores"],
  "examenFisico.neurologico.postura": ["SNCPostura"],
  "examenFisico.neurologico.equilibrio": ["SNCEquilibrio"],
  "examenFisico.neurologico.marcha": ["SNCMarcha"],
  "examenFisico.neurologico.observaciones": ["examenNeurologico"],
  "examenFisico.otros.observaciones": ["examenOtros"],

  // Diagnóstico y tratamiento
  "diagnostico.enfermedadBase": ["enfermedadBase"],
  "diagnostico.fechaEnfermedadBase": ["fechaEnfermedadBase"],
  "diagnostico.enfermedadActual": ["enfermedadActual"],
  "diagnostico.antecedentesPatologicos": ["antecedentesPatologicosActual", "antecedentesPatologicos"],
  "tratamiento.tratamientoBase": ["tratamientoBase"],
  "tratamiento.fechaTratamientoBase": ["fechaTratamientoBase"],
  "tratamiento.tratamientoActual": ["tratamientoActual", "TratamientoActual"],

  // Valoración social / funcional
  "valoracionSocial.acompanado": ["acompanado"],
  "valoracionSocial.conQuienVive": ["conQuienVive"],
  "valoracionSocial.concurreALaConsulta": ["concurreALaConsulta"],
  "valoracionSocial.conyuge": ["conyuge"],
  "valoracionSocial.hermanos": ["hermanos"],
  "valoracionSocial.hijos": ["hijos"],
  "valoracionSocial.otros": ["otros"],
  "valoracionFuncional.camina": ["camina"],
  "valoracionFuncional.levantateYAnda": ["levantateYAnda"],
  "valoracionFuncional.articulaciones": ["articulaciones"],
  "valoracionFuncional.pasaMuchoTiempoSentado": ["pasaMuchoTiempoSentado"],
  "valoracionFuncional.equilibrio": ["equilibrio"],
  "valoracionFuncional.caidas": ["caidas"],

  // Valoración mental: las respuestas viejas pasan a "respuesta" de cada ítem (el puntaje queda vacío)
  "valoracionMental.orientacionTiempo.respuesta": ["orientacionEnT"],
  "valoracionMental.orientacionEspacio.respuesta": ["hijosMental"],
  "valoracionMental.fijacion.respuesta": ["palabra1", "palabra2", "palabra3"],
  "valoracionMental.calculo.respuesta": ["calculo1", "calculo2", "calculo3"],
  "valoracionMental.memoria.respuesta": ["palabra1Memoria", "palabra2Memoria", "palabra3Memoria"],
  "valoracionMental.denominacion.respuesta": ["respuesta1", "respuesta2"],
  "valoracionMental.repeticion.respuesta": ["respuestaRepita"],
  "valoracionMental.lectura.respuesta": ["textoLeido", "cierreOjosYHagalo"],
  "valoracionMental.escritura.respuesta": ["fraseEscrita"],
  "valoracionMental.ordenTriple.respuesta": ["logradoDoblePapel"],
  "valoracionMental.copia.respuesta": ["logradoCopieDibujo"],

  // Familia / apoderado
  "familia.apoderadoNombre": ["apoderadoNombre"],
  "familia.apoderadoDni": ["apoderadoDni"],
  "familia.apoderadoParentesco": ["apoderadoParentesco", "calidadDe"],
  "familia.residenteNombre": ["residenteNombre"],
  "familia.consentimientoTexto": ["consentimientoTexto"],

  // Interconsulta
  "interconsulta.fecha": ["fecha"],
  "interconsulta.especialidad": ["especialidad"],
  "interconsulta.motivo": ["motivoConsulta"],
  "interconsulta.informe": ["informeInterconsulta"],
};

const PATHS_FECHA = new Set([
  "datosPersonales.fechaNacimiento",
  "datosPersonales.fechaIngreso",
  "diagnostico.fechaEnfermedadBase",
  "tratamiento.fechaTratamientoBase",
  "interconsulta.fecha",
]);

function combinar(raw, claves, separador = "\n") {
  const valores = [];
  claves.forEach((k) => {
    const v = raw[k];
    if (!esVacio(v)) {
      const s = String(v).trim();
      if (!valores.includes(s)) valores.push(s);
    }
  });
  return valores.join(separador);
}

export function esDocumentoLegacy(raw) {
  return !raw || raw.schemaVersion !== SCHEMA_VERSION;
}

/**
 * Convierte un documento (viejo o nuevo) al modelo unificado.
 * Devuelve:
 *   doc         → documento canónico listo para guardar
 *   evoluciones → evoluciones del modelo viejo que hay que pasar a la subcolección
 *   historial   → valores "previos" del modelo viejo que hay que pasar al historial
 */
export function migrarDocumento(raw = {}) {
  if (!esDocumentoLegacy(raw)) {
    // Ya migrado: completar campos que falten por cambios de esquema
    const base = pacienteVacio();
    return { doc: mergeProfundo(base, raw), evoluciones: [], historial: [] };
  }

  const doc = pacienteVacio();

  for (const [path, claves] of Object.entries(MAPA_LEGACY)) {
    let v = combinar(raw, claves, path.startsWith("valoracionMental.") ? ", " : "\n");
    if (PATHS_FECHA.has(path)) v = normalizarFecha(v) || v;
    setPath(doc, path, v);
  }

  // "Concurre a la consulta" de la sección mental no tiene equivalente en el MMSE
  if (!esVacio(raw.concurreALaConsultaMental)) {
    doc.valoracionMental.observaciones = `Concurre a la consulta: ${String(raw.concurreALaConsultaMental).trim()}`;
  }

  // Fotos
  doc.urlFoto = esVacio(raw.urlFoto) ? "" : raw.urlFoto;
  doc.galeriaFotos = Array.isArray(raw.galeriaFotos) ? raw.galeriaFotos : [];

  // Fechas de última modificación que existían en el modelo viejo
  const um = {};
  const fEnf = raw.fechaUltModifEnfermedadActual;
  const fAnt = raw.fechaUltModifAntecedentesPatologicos;
  if (!esVacio(fEnf)) um[claveModificacion("diagnostico.enfermedadActual")] = String(fEnf);
  if (!esVacio(fAnt)) um[claveModificacion("diagnostico.antecedentesPatologicos")] = String(fAnt);
  doc.ultimaModificacion = um;

  // Evolución (un único texto en el modelo viejo) → primera entrada de la subcolección
  const evoluciones = [];
  const textoEvol = combinar(raw, ["Evolucion", "evolucionTexto"]);
  if (textoEvol) {
    evoluciones.push({
      texto: textoEvol,
      fecha: normalizarFecha(raw.UltFechaModifEvolucion) || "",
      profesional: "Registro anterior (migrado)",
      migrado: true,
    });
  }

  // Valores "previos" que guardaba el modelo viejo → historial
  const historial = [];
  const previos = [
    ["diagnostico.enfermedadActual", raw.enfermedadPrevia, raw.fechaAnterioModifEnfermedadActual ?? raw.fechaAnteriorModifEnfermedadActual],
    ["diagnostico.antecedentesPatologicos", raw.antecedentesPatologicosPrevio, raw.fechaAnterioModifAntecedentesPatologicos ?? raw.fechaAnteriorModifAntecedentesPatologicos],
  ];
  previos.forEach(([campo, anterior, fechaAnt]) => {
    if (!esVacio(anterior)) {
      historial.push({
        seccion: campo.split(".")[0],
        cambios: [{ campo, anterior: String(anterior), nuevo: getPath(doc, campo) || null }],
        profesional: "Registro anterior (migrado)",
        fechaReferencia: esVacio(fechaAnt) ? null : String(fechaAnt),
        migrado: true,
      });
    }
  });

  return { doc, evoluciones, historial };
}

function mergeProfundo(base, extra) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  Object.entries(extra || {}).forEach(([k, v]) => {
    if (v && typeof v === "object" && !Array.isArray(v) && base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) {
      out[k] = mergeProfundo(base[k], v);
    } else {
      out[k] = v;
    }
  });
  return out;
}

/** Lista de campos viejos que el script puede borrar después de migrar. */
export const CAMPOS_LEGACY = Array.from(
  new Set([
    ...Object.values(MAPA_LEGACY).flat(),
    "concurreALaConsultaMental",
    "Evolucion",
    "evolucionTexto",
    "UltFechaModifEvolucion",
    "enfermedadPrevia",
    "antecedentesPatologicosPrevio",
    "fechaUltModifEnfermedadActual",
    "fechaUltModifAntecedentesPatologicos",
    "fechaAnterioModifEnfermedadActual",
    "fechaAnteriorModifEnfermedadActual",
    "fechaAnterioModifAntecedentesPatologicos",
    "fechaAnteriorModifAntecedentesPatologicos",
    "fechaTratamientoActual",
  ]),
);

export { MMSE_ITEMS };
