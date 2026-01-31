
import PDFDocument from "pdfkit";

// === Función principal genérica ===
export async function generarPDFHistoria(datos, tipoTab) {
  switch (tipoTab) {
    case "historia-clinica":
      return generarPDFHistoriaClinica(datos);
    case "clinico":
      return generarPDFClinico(datos);
    case "flia-y-apod":
      return generarPDFFliaYApod(datos);
    case "interconsulta":
      return generarPDFInterconsulta(datos);
    case "resumen-hc":
      return generarPDFResumenHC(datos);
    default:
      throw new Error(`Tipo de PDF no soportado: ${tipoTab}`);
  }
}

// === UTILIDADES ===
const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

const d = (v) => (v == null || v === "" ? "-" : String(v));

// === CONFIGURACIÓN COMÚN ===
const config = {
  size: "A4",
  margin: 50,
  titleSize: 16,
  subtitleSize: 12,
  textSize: 10,
  lineHeight: 16,
  groupSpacing: 24,
};

// ===================================================================
// 1. HISTORIA CLÍNICA (ya implementado antes)
// ===================================================================
async function generarPDFHistoriaClinica(datos) {
  // ... (tu implementación anterior aquí)
  // Por brevedad, asumimos que ya está hecha.
  // Si necesitás que la repita, avisame.
  throw new Error("Implementar generarPDFHistoriaClinica");
}

// ===================================================================
// 2. CLÍNICO
// ===================================================================
async function generarPDFClinico({ paciente, historia }) {
  const doc = new PDFDocument(config);
  const { titleSize, subtitleSize, textSize, lineHeight, groupSpacing } =
    config;

  // Título
  doc
    .fontSize(titleSize)
    .text("HISTORIA CLÍNICA - DATOS CLÍNICOS", { align: "center" });
  doc.moveDown(1);

  // --- Antecedentes ---
  doc
    .fontSize(subtitleSize)
    .text("ANTECEDENTES DEL PACIENTE", { align: "center" });
  doc.moveDown(0.5);

  const ant = historia.antecedentes || {};

  const renderSection = (title, fields) => {
    if (!fields || Object.keys(fields).length === 0) return;
    doc.fontSize(textSize).text(title, { align: "center" });
    doc.moveDown(0.2);
    Object.entries(fields).forEach(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      doc.text(`${label}: ${d(value)}`, { align: "center" });
    });
    doc.moveDown(0.5);
  };

  renderSection("Vasculares", ant.vasculares);
  renderSection("Digestivos", ant.digestivos);
  renderSection("Metabólicas", ant.metabolicas);
  renderSection("Sensoriales", ant.sensoriales);
  renderSection("Ginecológicas", ant.ginecologicas);
  renderSection("V PERIF", ant.vPerif);
  renderSection("DBT", ant.dbt);
  renderSection("SNC", ant.snC);
  renderSection("Urológicas", ant.urologicas);
  renderSection("Dermatológicas", ant.dermatologicas);
  renderSection("Actitud psíquica", ant.actitudPsiquica);

  doc.moveDown(groupSpacing / lineHeight);

  // --- Examen físico ---
  doc.fontSize(subtitleSize).text("EXAMEN FÍSICO", { align: "center" });
  doc.moveDown(0.5);

  const exf = historia.examenFisico || {};
  renderSection("Fasciales", exf.faciales);
  renderSection("Ap. cardiovascular", exf.apCardiovascular);
  renderSection("Ap. genitourinario", exf.apGenitourinario);
  renderSection("Tr. mentales", exf.trMentales);
  renderSection("Cuello", exf.cuello);
  renderSection("Signos falla cardíaca", exf.signosFallaCardiaca);
  renderSection("Dermatológicos", exf.dermatologicos);
  renderSection("Ap. respiratoria", exf.apRespiratoria);
  renderSection("Ap. digestivo", exf.apDigestivo);
  renderSection("SNC", exf.snC);

  doc.moveDown(groupSpacing / lineHeight);

  // --- Tratamiento actual ---
  doc.fontSize(subtitleSize).text("TRATAMIENTO ACTUAL", { align: "center" });
  doc.moveDown(0.5);
  const tr = historia.tratamientoActual || {};
  doc.text(`Tratamiento 1: ${d(tr.tratamiento1)}`, { align: "center" });
  doc.text(`Tratamiento 2: ${d(tr.tratamiento2)}`, { align: "center" });
  doc.moveDown(groupSpacing / lineHeight);

  // --- Evolución ---
  doc.fontSize(subtitleSize).text("EVOLUCIÓN", { align: "center" });
  doc.moveDown(0.5);
  const ev = historia.evolucion || {};
  doc.text(d(ev.texto), { align: "center" });

  doc.end();
  return await streamToBuffer(doc);
}

// ===================================================================
// 3. FAMILIA Y APODERADOS
// ===================================================================
async function generarPDFFliaYApod({ paciente, informacionAdicional }) {
  const doc = new PDFDocument(config);
  const { titleSize, subtitleSize, textSize, lineHeight, groupSpacing } =
    config;

  doc
    .fontSize(titleSize)
    .text("INFORMACIÓN FAMILIAR Y APODERADOS", { align: "center" });
  doc.moveDown(1);

  // Primera parte: datos identificatorios
  doc.fontSize(subtitleSize).text("DATOS DEL APODERADO", { align: "center" });
  doc.moveDown(0.5);
  doc
    .fontSize(textSize)
    .text(`Yo: ${d(paciente.nombreCompleto)}`, { align: "center" })
    .text(`Identificado/a con DNI N°: ${d(paciente.dni)}`, { align: "center" })
    .text(`y en calidad de: ${d(informacionAdicional?.calidad)}`, {
      align: "center",
    })
    .text(`Del residente Sr/Sra: ${d(paciente.nombreCompleto)}`, {
      align: "center",
    });

  doc.moveDown(groupSpacing / lineHeight);

  // Segunda parte: texto fijo de consentimiento
  doc
    .fontSize(subtitleSize)
    .text("CONSENTIMIENTO INFORMADO", { align: "center" });
  doc.moveDown(0.5);
  const consentText =
    informacionAdicional?.textoConsentimiento ||
    "Que se encuentra ingresado en esta Residencia, ha sido informado/a de la medida de sujeción que se realiza bajo preescripción médica y dado el estado de salud de mi familiar/apoderante, es necesaria para evitar complicaciones graves tales como lesiones y/o caídas";

  doc.fontSize(textSize).text(consentText, { align: "center" });

  doc.end();
  return await streamToBuffer(doc);
}

// ===================================================================
// 4. INTERCONSULTA
// ===================================================================
async function generarPDFInterconsulta({
  paciente,
  antecedentesPatologicos,
  enfermedadActual,
  informeInterconsulta,
}) {
  const doc = new PDFDocument(config);
  const { titleSize, subtitleSize, textSize, lineHeight, groupSpacing } =
    config;

  doc.fontSize(titleSize).text("INFORME DE INTERCONSULTA", { align: "center" });
  doc.moveDown(1);

  // Datos del paciente
  doc.fontSize(subtitleSize).text("DATOS DEL PACIENTE", { align: "center" });
  doc.moveDown(0.5);
  const lines = [
    [
      `Fecha: ${d(paciente.fechaIngreso)}`,
      `Nombre: ${d(paciente.nombreCompleto)}`,
    ],
    [`Obra Social: ${d(paciente.obraSocial)}`, `DNI: ${d(paciente.dni)}`],
    [`AF N°: ${d(paciente.afiliadoNumero)}`, ""],
  ];
  renderGroupedLines(doc, lines, textSize, lineHeight);
  doc.moveDown(groupSpacing / lineHeight);

  // Antecedentes patológicos
  doc
    .fontSize(subtitleSize)
    .text(
      `ANTECEDENTES PATOLÓGICOS${antecedentesPatologicos?.ultimaActualizacion ? ` - ${antecedentesPatologicos.ultimaActualizacion}` : ""}`,
      { align: "center" },
    );
  doc.moveDown(0.5);
  doc.text(d(antecedentesPatologicos?.texto), { align: "center" });
  doc.moveDown(groupSpacing / lineHeight);

  // Enfermedad actual
  doc
    .fontSize(subtitleSize)
    .text(
      `ENFERMEDAD ACTUAL${enfermedadActual?.ultimaActualizacion ? ` - ${enfermedadActual.ultimaActualizacion}` : ""}`,
      { align: "center" },
    );
  doc.moveDown(0.5);
  doc.text(d(enfermedadActual?.texto), { align: "center" });
  doc.moveDown(groupSpacing / lineHeight);

  // Informe de interconsulta
  doc
    .fontSize(subtitleSize)
    .text("INFORME DE INTERCONSULTA", { align: "center" });
  doc.moveDown(0.5);
  doc.text(d(informeInterconsulta?.texto), { align: "center" });

  doc.end();
  return await streamToBuffer(doc);
}

// ===================================================================
// 5. RESUMEN HC
// ===================================================================
async function generarPDFResumenHC({
  paciente,
  enfermedadBase,
  enfermedadActual,
  tratamientoBase,
}) {
  const doc = new PDFDocument(config);
  const { titleSize, subtitleSize, textSize, lineHeight, groupSpacing } =
    config;

  doc
    .fontSize(titleSize)
    .text("RESUMEN DE HISTORIA CLÍNICA", { align: "center" });
  doc.moveDown(1);

  // Paciente
  doc.fontSize(subtitleSize).text("DATOS DEL PACIENTE", { align: "center" });
  doc.moveDown(0.5);
  const lines = [
    [
      `Fecha: ${d(paciente.fechaIngreso)}`,
      `Nombre: ${d(paciente.nombreCompleto)}`,
    ],
    [`Obra Social: ${d(paciente.obraSocial)}`, `DNI: ${d(paciente.dni)}`],
    [`Edad: ${d(paciente.edad)}`, `AF N°: ${d(paciente.afiliadoNumero)}`],
  ];
  renderGroupedLines(doc, lines, textSize, lineHeight);
  doc.moveDown(groupSpacing / lineHeight);

  // Enfermedad de base
  doc
    .fontSize(subtitleSize)
    .text(
      `ENFERMEDAD DE BASE${enfermedadBase?.ultimaActualizacion ? ` - ${enfermedadBase.ultimaActualizacion}` : ""}`,
      { align: "center" },
    );
  doc.moveDown(0.5);
  doc.text(d(enfermedadBase?.texto), { align: "center" });
  doc.moveDown(groupSpacing / lineHeight);

  // Enfermedad actual
  doc
    .fontSize(subtitleSize)
    .text(
      `ENFERMEDAD ACTUAL${enfermedadActual?.ultimaActualizacion ? ` - ${enfermedadActual.ultimaActualizacion}` : ""}`,
      { align: "center" },
    );
  doc.moveDown(0.5);
  doc.text(d(enfermedadActual?.texto), { align: "center" });
  doc.moveDown(groupSpacing / lineHeight);

  // Tratamiento de base
  doc.fontSize(subtitleSize).text("TRATAMIENTO DE BASE", { align: "center" });
  doc.moveDown(0.5);
  doc.text(d(tratamientoBase?.texto), { align: "center" });

  doc.end();
  return await streamToBuffer(doc);
}

// ===================================================================
// UTILIDAD: Renderizar líneas en pares (2 columnas)
// ===================================================================
function renderGroupedLines(doc, lines, fontSize, lineHeight) {
  lines.forEach(([left, right]) => {
    if (!right) {
      doc.fontSize(fontSize).text(left, { align: "center" });
    } else {
      const width =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const half = width / 2;
      const y = doc.y;
      doc
        .fontSize(fontSize)
        .text(left, doc.page.margins.left, y, { width: half, align: "center" });
      doc.text(right, doc.page.margins.left + half, y, {
        width: half,
        align: "center",
      });
      doc.y += lineHeight;
    }
  });
}
