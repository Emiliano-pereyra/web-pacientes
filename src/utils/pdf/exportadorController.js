// import PDFDocument from "pdfkit";

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

const d = (v) => (v == null || v === "" ? "-" : String(v).trim());

// === CONFIGURACIÓN COMÚN ===
const config = {
  size: "A4",
  margin: 50,
  titleSize: 18,
  subtitleSize: 14,
  subsubsectionSize: 12,
  textSize: 10,
  lineHeight: 18,
};

// ===================================================================
// 1. HISTORIA CLÍNICA (ya implementado antes)
// ===================================================================
async function generarPDFHistoriaClinica(datos) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);

  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = config.margin;
  let y = height - margin;

  // ============================================
  // TÍTULO PRINCIPAL: "HISTORIA CLÍNICA - Ingreso fecha:"
  // ============================================
  const tituloPrincipal = "HISTORIA CLÍNICA";
  const fechaIngreso = `Ingreso fecha: ${d(datos.paciente.fechaIngreso)}`;

  // Calcular espacio para el título
  const tituloWidth = fontBold.widthOfTextAtSize(
    tituloPrincipal,
    config.titleSize,
  );
  const fechaWidth = font.widthOfTextAtSize(fechaIngreso, config.textSize);

  // Dibujar título principal
  page.drawText(tituloPrincipal, {
    x: margin,
    y: y,
    size: config.titleSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Dibujar fecha de ingreso alineada a la derecha
  page.drawText(fechaIngreso, {
    x: width - margin - fechaWidth,
    y: y + config.titleSize - config.textSize,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Subrayar solo el título principal
  page.drawLine({
    start: { x: margin, y: y - 3 },
    end: { x: margin + tituloWidth, y: y - 3 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y -= config.titleSize + 25; // Más espacio después del título

  // ============================================
  // DATOS DEL PACIENTE (2 columnas con puntos)
  // ============================================
  const labelWidth = 60;
  const col1Start = margin;
  const col2Start = margin + 250; // Más cerca para reducir espacio

  // Primera línea: NyA ............ Edad
  page.drawText("NyA:", {
    x: col1Start,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(d(datos.paciente.nombreCompleto), {
    x: col1Start + labelWidth,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("............", {
    x: col1Start + labelWidth + 150,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Edad:", {
    x: col2Start,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(d(datos.paciente.edad), {
    x: col2Start + labelWidth,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Segunda línea: OS ............ AF N°
  page.drawText("OS:", {
    x: col1Start,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(d(datos.paciente.obraSocial), {
    x: col1Start + labelWidth,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("............", {
    x: col1Start + labelWidth + 150,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("AF N°:", {
    x: col2Start,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(d(datos.paciente.afiliadoNumero), {
    x: col2Start + labelWidth,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Tercera línea: DNI
  page.drawText("DNI:", {
    x: col1Start,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(d(datos.paciente.dni), {
    x: col1Start + labelWidth,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 35; // Más espacio antes de VALORACIÓN GERIÁTRICA

  // ============================================
  // VALORACIÓN GERIÁTRICA
  // ============================================
  page.drawText("VALORACIÓN GERIÁTRICA", {
    x: margin,
    y: y,
    size: config.subtitleSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Subrayar
  const valWidth = fontBold.widthOfTextAtSize(
    "VALORACIÓN GERIÁTRICA",
    config.subtitleSize,
  );
  page.drawLine({
    start: { x: margin, y: y - 3 },
    end: { x: margin + valWidth, y: y - 3 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y -= config.subtitleSize + 18;

  // ============================================
  // SUBGRUPO: SOCIAL
  // ============================================
  page.drawText("SOCIAL", {
    x: margin,
    y: y,
    size: config.subsubsectionSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Subrayar
  const socialWidth = fontBold.widthOfTextAtSize(
    "SOCIAL",
    config.subsubsectionSize,
  );
  page.drawLine({
    start: { x: margin, y: y - 3 },
    end: { x: margin + socialWidth, y: y - 3 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y -= config.subsubsectionSize + 12;

  // Con quién vive
  let viveCon = d(datos.paciente.conQuienVive);
  if (viveCon === "-" && datos.paciente.otros) {
    viveCon = d(datos.paciente.otros);
  }
  page.drawText(`Con quién vive: ${viveCon}`, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Concurre a la consulta
  page.drawText(
    `Concurre a la consulta: ${d(datos.paciente.concurreALaConsulta)}`,
    {
      x: margin,
      y: y,
      size: config.textSize,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= config.textSize + 22;

  // ============================================
  // SUBGRUPO: MENTAL
  // ============================================
  page.drawText("MENTAL", {
    x: margin,
    y: y,
    size: config.subsubsectionSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Subrayar
  const mentalWidth = fontBold.widthOfTextAtSize(
    "MENTAL",
    config.subsubsectionSize,
  );
  page.drawLine({
    start: { x: margin, y: y - 3 },
    end: { x: margin + mentalWidth, y: y - 3 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y -= config.subsubsectionSize + 12;

  // Orientación (5)
  const orientacionText = `Orientación en T y E: día de hoy (${d(datos.paciente.orientacionEnT)}) lugar (${d(datos.paciente.hijosMental)})`;
  page.drawText(orientacionText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(5)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Fijación (3)
  const fijacionText = `Fijación: repita estas tres palabras árbol - caballo - moneda, (${d(datos.paciente.palabra1)}, ${d(datos.paciente.palabra2)}, ${d(datos.paciente.palabra3)})`;
  page.drawText(fijacionText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(3)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Concentración y cálculo (3)
  const concentracionText = `Concentración y cálculo: 100-3=97 (${d(datos.paciente.calculo1)}) -3=(${d(datos.paciente.calculo2)}) -3= (${d(datos.paciente.calculo3)})`;
  page.drawText(concentracionText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(3)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Memoria (3)
  const memoriaText = `Memoria: nombre de las tres palabras anteriores (${d(datos.paciente.palabra1Memoria)}, ${d(datos.paciente.palabra2Memoria)}, ${d(datos.paciente.palabra3Memoria)})`;
  page.drawText(memoriaText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(3)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // ¿Qué es esto? (2)
  const queEsEstoText = `¿Qué es esto? Lápiz (${d(datos.paciente.respuesta1)}), reloj (${d(datos.paciente.respuesta2)})`;
  page.drawText(queEsEstoText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(2)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Repita (1)
  const repitaText = `Repita: en un trigal había 5 perros (${d(datos.paciente.respuestaRepita)})`;
  page.drawText(repitaText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(1)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Lea esto (1)
  const leaEstoText = `Lea esto (${d(datos.paciente.textoLeido)}) CIERRE LOS OJOS y hágalo (${d(datos.paciente.cierreOjosYHagalo)})`;
  page.drawText(leaEstoText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(1)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Escriba una frase (1)
  const escribaFraseText = `Escriba una frase: (${d(datos.paciente.fraseEscrita)})`;
  page.drawText(escribaFraseText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(1)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Tome el papel... (3)
  const tomePapelText = `Tome el papel con la mano izquierda y dóblelo a la mitad: (${d(datos.paciente.logradoDoblePapel)})`;
  page.drawText(tomePapelText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(3)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  // Copie este dibujo (1)
  const copieDibujoText = `Copie este dibujo: (${d(datos.paciente.logradoCopieDibujo)})`;
  page.drawText(copieDibujoText, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("(1)", {
    x: width - margin - 20,
    y: y,
    size: config.textSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 22;

  // ============================================
  // PUNTAJES (sin subtítulo)
  // ============================================
  page.drawText(
    "30.............s/p      25-30...........ligero déficit         20/24..........leve      15/19...........moderado    0/14.......",
    {
      x: margin,
      y: y,
      size: config.textSize,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= config.textSize + 22;

  // ============================================
  // SUBGRUPO: FUNCIONAL
  // ============================================
  page.drawText("FUNCIONAL", {
    x: margin,
    y: y,
    size: config.subsubsectionSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Subrayar
  const funcionalWidth = fontBold.widthOfTextAtSize(
    "FUNCIONAL",
    config.subsubsectionSize,
  );
  page.drawLine({
    start: { x: margin, y: y - 3 },
    end: { x: margin + funcionalWidth, y: y - 3 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y -= config.subsubsectionSize + 12;

  page.drawText(`Camina: ${d(datos.paciente.camina)}`, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  page.drawText(
    `Pasa mucho tiempo sentado: ${d(datos.paciente.pasaMuchoTiempoSentado)}`,
    {
      x: margin,
      y: y,
      size: config.textSize,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= config.textSize + 12;

  page.drawText(
    `Levántese y anda ${d(datos.paciente.levantateYAnda)}  Equilibrio: ${d(datos.paciente.equilibrio)}`,
    {
      x: margin,
      y: y,
      size: config.textSize,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= config.textSize + 12;

  page.drawText(`Articulaciones: ${d(datos.paciente.articulaciones)}`, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= config.textSize + 12;

  page.drawText(`Caídas: ${d(datos.paciente.caidas)}`, {
    x: margin,
    y: y,
    size: config.textSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Guardar y devolver
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
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
