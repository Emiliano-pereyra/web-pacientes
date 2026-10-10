/**
 * Pequeño motor de maquetado sobre pdf-lib:
 *  - ajuste de línea automático (los textos largos ya no se salen de la hoja)
 *  - salto de página automático
 *  - fuente Roboto embebida (soporta tildes, ñ y cualquier carácter Unicode)
 *  - pie con número de página y fecha de emisión
 */
import fs from "node:fs";
import path from "node:path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const A4 = [595.28, 841.89];
const MARGEN = 50;
const PIE = 30;
const GRIS = rgb(0.35, 0.35, 0.35);
const NEGRO = rgb(0, 0, 0);
const LINEA = rgb(0.75, 0.75, 0.75);

const DIR_FUENTES = path.join(process.cwd(), "src", "utils", "pdf", "fonts");
let cacheFuentes = null;

function leerFuentes() {
  if (!cacheFuentes) {
    cacheFuentes = {
      regular: fs.readFileSync(path.join(DIR_FUENTES, "Roboto-Regular.ttf")),
      bold: fs.readFileSync(path.join(DIR_FUENTES, "Roboto-Bold.ttf")),
    };
  }
  return cacheFuentes;
}

export class PdfDocumento {
  static async crear({ titulo, pieIzquierda = "" }) {
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
    const { regular, bold } = leerFuentes();
    const inst = new PdfDocumento();
    inst.pdf = pdf;
    inst.font = await pdf.embedFont(regular, { subset: true });
    inst.bold = await pdf.embedFont(bold, { subset: true });
    inst.pieIzquierda = pieIzquierda;
    inst.ancho = A4[0] - MARGEN * 2;
    pdf.setTitle(titulo);
    pdf.setProducer("WebPacientes");
    inst.nuevaPagina();
    return inst;
  }

  nuevaPagina() {
    this.page = this.pdf.addPage(A4);
    this.y = A4[1] - MARGEN;
  }

  asegurarEspacio(alto) {
    if (this.y - alto < MARGEN + PIE) this.nuevaPagina();
  }

  // -------------------------------------------------------------
  // Ajuste de línea
  // -------------------------------------------------------------
  partirLineas(texto, font, size, ancho = this.ancho) {
    const lineas = [];
    String(texto ?? "")
      .replace(/\r/g, "")
      .split("\n")
      .forEach((parrafo) => {
        const palabras = parrafo.split(/\s+/).filter(Boolean);
        if (palabras.length === 0) {
          lineas.push("");
          return;
        }
        let actual = "";
        palabras.forEach((palabra) => {
          // palabra más larga que el ancho: se corta por caracteres
          while (font.widthOfTextAtSize(palabra, size) > ancho) {
            let i = palabra.length;
            while (i > 1 && font.widthOfTextAtSize(palabra.slice(0, i), size) > ancho) i--;
            if (actual) {
              lineas.push(actual);
              actual = "";
            }
            lineas.push(palabra.slice(0, i));
            palabra = palabra.slice(i);
          }
          const prueba = actual ? `${actual} ${palabra}` : palabra;
          if (font.widthOfTextAtSize(prueba, size) <= ancho) actual = prueba;
          else {
            lineas.push(actual);
            actual = palabra;
          }
        });
        if (actual) lineas.push(actual);
      });
    return lineas;
  }

  escribir(texto, { size = 10, bold = false, color = NEGRO, x = MARGEN, ancho, interlineado = 1.35, centrado = false } = {}) {
    const font = bold ? this.bold : this.font;
    const w = ancho ?? this.ancho - (x - MARGEN);
    const alto = size * interlineado;
    this.partirLineas(texto, font, size, w).forEach((linea) => {
      this.asegurarEspacio(alto);
      const lx = centrado ? MARGEN + (this.ancho - font.widthOfTextAtSize(linea, size)) / 2 : x;
      this.page.drawText(linea, { x: lx, y: this.y - size, size, font, color });
      this.y -= alto;
    });
  }

  espacio(pts = 8) {
    this.y -= pts;
  }

  linea() {
    this.asegurarEspacio(6);
    this.page.drawLine({
      start: { x: MARGEN, y: this.y },
      end: { x: MARGEN + this.ancho, y: this.y },
      thickness: 0.6,
      color: LINEA,
    });
    this.y -= 6;
  }

  // -------------------------------------------------------------
  // Bloques
  // -------------------------------------------------------------
  titulo(texto) {
    this.escribir(texto, { size: 16, bold: true, centrado: true });
    this.espacio(6);
  }

  subtitulo(texto) {
    this.asegurarEspacio(40); // que el subtítulo no quede solo al pie
    this.espacio(6);
    this.escribir(texto.toUpperCase(), { size: 12, bold: true });
    this.linea();
  }

  tituloGrupo(texto) {
    this.asegurarEspacio(30);
    this.espacio(2);
    this.escribir(texto, { size: 10.5, bold: true });
  }

  /** "Etiqueta: valor" con la etiqueta en negrita y el valor ajustado a la línea. */
  campo(etiqueta, valor, { size = 10 } = {}) {
    const textoEtiqueta = `${etiqueta}: `;
    const anchoEtiqueta = this.bold.widthOfTextAtSize(textoEtiqueta, size);
    const alto = size * 1.35;
    const valorStr = String(valor ?? "");

    if (anchoEtiqueta > this.ancho * 0.45) {
      this.escribir(textoEtiqueta, { size, bold: true });
      this.escribir(valorStr, { size, x: MARGEN + 12 });
      return;
    }

    const lineas = this.partirLineas(valorStr, this.font, size, this.ancho - anchoEtiqueta);
    lineas.forEach((l, i) => {
      this.asegurarEspacio(alto);
      if (i === 0) this.page.drawText(textoEtiqueta, { x: MARGEN, y: this.y - size, size, font: this.bold });
      this.page.drawText(l, { x: MARGEN + anchoEtiqueta, y: this.y - size, size, font: this.font });
      this.y -= alto;
    });
  }

  /** ¿El par entra cómodo en una línea compartida? */
  esCorto(etiqueta, valor, size = 10) {
    const ancho = this.bold.widthOfTextAtSize(`${etiqueta}: `, size) + this.font.widthOfTextAtSize(String(valor ?? ""), size);
    return ancho <= this.ancho * 0.48 && !String(valor ?? "").includes("\n");
  }

  /** Varios pares cortos en líneas compartidas: "TA: x   ·   Cardio: y". Los largos van en su propia línea. */
  camposEnLinea(paresTodos, { size = 10 } = {}) {
    const pares = paresTodos.filter(([e, v]) => this.esCorto(e, v, size));
    const largos = paresTodos.filter(([e, v]) => !this.esCorto(e, v, size));
    if (pares.length) this.dibujarEnLinea(pares, size);
    largos.forEach(([e, v]) => this.campo(e, v, { size }));
  }

  dibujarEnLinea(pares, size) {
    const sep = "   ·   ";
    const alto = size * 1.35;
    let x = MARGEN;
    this.asegurarEspacio(alto);
    pares.forEach(([etiqueta, valor], i) => {
      const e = `${etiqueta}: `;
      const v = String(valor ?? "");
      const ancho = this.bold.widthOfTextAtSize(e, size) + this.font.widthOfTextAtSize(v, size);
      const anchoSep = i > 0 ? this.font.widthOfTextAtSize(sep, size) : 0;
      if (x > MARGEN && x + anchoSep + ancho > MARGEN + this.ancho) {
        this.y -= alto;
        this.asegurarEspacio(alto);
        x = MARGEN;
      } else if (i > 0) {
        this.page.drawText(sep, { x, y: this.y - size, size, font: this.font, color: GRIS });
        x += anchoSep;
      }
      this.page.drawText(e, { x, y: this.y - size, size, font: this.bold });
      x += this.bold.widthOfTextAtSize(e, size);
      this.page.drawText(v, { x, y: this.y - size, size, font: this.font });
      x += this.font.widthOfTextAtSize(v, size);
    });
    this.y -= alto;
  }

  parrafo(texto, { size = 10, color = NEGRO } = {}) {
    this.escribir(texto, { size, color });
  }

  nota(texto) {
    this.escribir(texto, { size: 8.5, color: GRIS });
  }

  /** Tabla simple con anchos relativos. filas: [[c1, c2, ...]] */
  tabla(encabezados, filas, anchosRel, { size = 9 } = {}) {
    const total = anchosRel.reduce((a, b) => a + b, 0);
    const anchos = anchosRel.map((a) => (a / total) * this.ancho);
    const pad = 4;
    const dibujarFila = (celdas, bold) => {
      const font = bold ? this.bold : this.font;
      const partes = celdas.map((c, i) => this.partirLineas(String(c ?? ""), font, size, anchos[i] - pad * 2));
      const altoLinea = size * 1.3;
      const alto = Math.max(...partes.map((p) => p.length)) * altoLinea + pad;
      this.asegurarEspacio(alto + 2);
      let x = MARGEN;
      partes.forEach((lineas, i) => {
        lineas.forEach((l, j) => {
          this.page.drawText(l, { x: x + pad, y: this.y - size - j * altoLinea, size, font });
        });
        x += anchos[i];
      });
      this.y -= alto;
      this.page.drawLine({
        start: { x: MARGEN, y: this.y + 1 },
        end: { x: MARGEN + this.ancho, y: this.y + 1 },
        thickness: 0.4,
        color: LINEA,
      });
    };
    dibujarFila(encabezados, true);
    filas.forEach((f) => dibujarFila(f, false));
    this.espacio(4);
  }

  firmas(etiquetas) {
    this.asegurarEspacio(80);
    this.espacio(50);
    const ancho = (this.ancho - 30 * (etiquetas.length - 1)) / etiquetas.length;
    etiquetas.forEach((e, i) => {
      const x = MARGEN + i * (ancho + 30);
      this.page.drawLine({ start: { x, y: this.y }, end: { x: x + ancho, y: this.y }, thickness: 0.8, color: NEGRO });
      this.page.drawText(e, { x, y: this.y - 12, size: 9, font: this.font, color: GRIS });
    });
    this.y -= 20;
  }

  async terminar() {
    const paginas = this.pdf.getPages();
    const emitido = new Date().toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    });
    paginas.forEach((p, i) => {
      const der = `Página ${i + 1} de ${paginas.length}`;
      const izq = `${this.pieIzquierda}${this.pieIzquierda ? " · " : ""}Emitido ${emitido}`;
      p.drawText(izq, { x: MARGEN, y: MARGEN - 20, size: 8, font: this.font, color: GRIS });
      p.drawText(der, {
        x: MARGEN + this.ancho - this.font.widthOfTextAtSize(der, 8),
        y: MARGEN - 20,
        size: 8,
        font: this.font,
        color: GRIS,
      });
    });
    return this.pdf.save();
  }
}
