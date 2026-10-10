/**
 * PDFs por pestaña. Se generan SIEMPRE con los datos guardados en la base
 * (el front solo manda el id), así lo impreso coincide con lo registrado.
 * Cada PDF imprime exactamente las secciones que muestra su pestaña.
 */
import { PdfDocumento } from "./PdfDocumento";
import {
  MMSE_ESCALA,
  MMSE_ITEMS,
  PESTANAS,
  SECCIONES,
  claveModificacion,
  getPath,
} from "@/lib/paciente/schema";
import { formatearFecha, formatearFechaHora, mostrar } from "@/lib/paciente/logica";

const VACIO = "—";

function encabezadoPaciente(doc, p) {
  const dp = p.datosPersonales || {};
  doc.camposEnLinea([
    ["Paciente", mostrar(dp.nombreCompleto, VACIO)],
    ["DNI", mostrar(dp.dni, VACIO)],
    ["Edad", mostrar(p.derivados?.edad, VACIO)],
    ["Fecha de nacimiento", mostrar(formatearFecha(dp.fechaNacimiento), VACIO)],
    ["Obra social", mostrar(dp.obraSocial, VACIO)],
    ["N° afiliado", mostrar(dp.afiliadoNumero, VACIO)],
    ["Ingreso", mostrar(formatearFecha(dp.fechaIngreso), VACIO)],
  ]);
  doc.linea();
}

function valorCampo(p, c) {
  const v = getPath(p, c.path);
  if (c.tipo === "date") return mostrar(formatearFecha(v), VACIO);
  if (c.tipo === "puntaje") return typeof v === "number" ? `${v}/${c.max}` : VACIO;
  return mostrar(v, VACIO);
}

function renderSeccion(doc, p, seccionKey) {
  const s = SECCIONES[seccionKey];
  if (s.esMMSE) return renderMMSE(doc, p);

  doc.subtitulo(s.titulo);
  s.grupos.forEach((g) => {
    if (g.titulo && s.grupos.length > 1) doc.tituloGrupo(g.titulo);

    const cortos = g.campos.filter((c) => c.tipo !== "textarea");
    const largos = g.campos.filter((c) => c.tipo === "textarea");

    if (cortos.length) doc.camposEnLinea(cortos.map((c) => [c.label, valorCampo(p, c)]));

    largos.forEach((c) => {
      const mod = c.conHistorial ? p.ultimaModificacion?.[claveModificacion(c.path)] : null;
      const etiqueta = mod ? `${c.label} (últ. modificación ${formatearFechaHora(mod)})` : c.label;
      // Si el grupo tiene un único campo largo con el mismo nombre que el grupo, no repetir la etiqueta
      if (g.campos.length === 1 && g.titulo && s.grupos.length > 1) {
        if (mod) doc.nota(`Última modificación: ${formatearFechaHora(mod)}`);
        doc.parrafo(valorCampo(p, c));
      } else {
        doc.campo(etiqueta, valorCampo(p, c));
      }
    });
    doc.espacio(2);
  });
}

function renderMMSE(doc, p) {
  const r = p.derivados?.mmse;
  doc.subtitulo(SECCIONES.valoracionMental.titulo);
  doc.tabla(
    ["Ítem", "Respuesta", "Puntaje"],
    MMSE_ITEMS.map((item) => {
      const resp = getPath(p, `valoracionMental.${item.id}.respuesta`);
      const punt = getPath(p, `valoracionMental.${item.id}.puntaje`);
      return [item.label, mostrar(resp, VACIO), typeof punt === "number" ? `${punt} / ${item.max}` : `— / ${item.max}`];
    }),
    [5, 4, 1.4],
  );
  if (r) {
    const total = `${r.total} / ${r.max}`;
    doc.campo(
      "Puntaje total",
      r.completo ? `${total} — ${r.interpretacion}` : `${total} (incompleto: ${r.completados} de ${r.itemsTotales} ítems puntuados)`,
    );
  }
  doc.nota(`Escala: ${MMSE_ESCALA.map((e) => (e.desde === e.hasta ? `${e.desde}` : `${e.desde}-${e.hasta}`) + ` ${e.texto.toLowerCase()}`).join(" · ")}`);
  const obs = getPath(p, "valoracionMental.observaciones");
  if (obs) doc.campo("Observaciones", obs);
}

function renderEvoluciones(doc, evoluciones) {
  doc.subtitulo("Evolución");
  if (!evoluciones?.length) {
    doc.parrafo("Sin evoluciones registradas.");
    return;
  }
  // Orden cronológico (la más vieja primero), como en una historia en papel
  [...evoluciones].reverse().forEach((e) => {
    const fecha = formatearFecha(e.fecha) || formatearFechaHora(e.creadoEn) || "";
    doc.tituloGrupo(`${fecha}${e.profesional ? ` — ${e.profesional}` : ""}`);
    doc.parrafo(e.texto);
    doc.espacio(4);
  });
}

/**
 * @param {string} tipo id de la pestaña (antecedentes | clinico | resumenHc | fliaYApod | interconsulta)
 * @param {object} paciente paciente ya normalizado (obtenerPaciente)
 * @param {Array}  evoluciones
 * @returns {Promise<Uint8Array>}
 */
export async function generarPdf(tipo, paciente, evoluciones = []) {
  const pestana = PESTANAS.find((t) => t.id === tipo);
  if (!pestana) throw new Error(`Tipo de PDF no soportado: ${tipo}`);

  const nombre = mostrar(paciente.datosPersonales?.nombreCompleto, "");
  const doc = await PdfDocumento.crear({ titulo: `${pestana.tituloPdf} - ${nombre}`, pieIzquierda: nombre });

  doc.titulo(pestana.tituloPdf);
  encabezadoPaciente(doc, paciente);

  pestana.secciones.forEach((key) => renderSeccion(doc, paciente, key));
  if (pestana.conEvoluciones) renderEvoluciones(doc, evoluciones);

  if (pestana.id === "fliaYApod") doc.firmas(["Firma del apoderado", "Aclaración y DNI"]);
  else if (pestana.conFirmas) doc.firmas(["Firma y sello del profesional"]);

  return doc.terminar();
}
