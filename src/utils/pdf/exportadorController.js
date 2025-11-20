import PDFDocument from "pdfkit";
import { Buffer } from "buffer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontPath = path.join(process.cwd(), "src/utils/pdf/fonts/Roboto-Regular.ttf");

export async function generarPDFHistoria(datos, tipoTab) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50,  font: fontPath, });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      if (tipoTab === "historia-clinica") {
        const paciente = datos.paciente || {};
        const historia = datos.historia || {};

        doc
          .fontSize(18).font(fontPath)
          .text(`HISTORIA CLÍNICA DE ${paciente.nombreVisible || ""}`, {
            align: "center",
          });
        doc.moveDown(1.5);

        const fechaIngreso = paciente.fechaIngreso || "......";
        const fechaNacimiento = paciente.fechaNacimiento || "......";
        const edad = paciente.edad || "......";
        const dni = paciente.dni || "......";
        const os = paciente.os || "......";
        const afNumero = paciente.afNumero || "......";

        doc
          .fontSize(12).font(fontPath)
          .text(
            `Fecha de ingreso: ${fechaIngreso}    Fecha de nacimiento: ${fechaNacimiento}    Edad: ${edad}`
          )
          .moveDown();
        doc.text(`DNI: ${dni}    OS: ${os}    AF N°: ${afNumero}`);

        doc.moveDown(1.5);
        doc.fontSize(14).font(fontPath).text("VALORACION GERIÁTRICA", { underline: true });
        doc.moveDown();
        doc.fontSize(12).font(fontPath).text("SOCIAL", { underline: true });
        doc.moveDown(0.5);

        const conQuienVive = historia.social?.conQuienVive || "......";
        doc.text(`Con quién vive: ${conQuienVive}`);
        doc.moveDown();

        // MENTAL
        doc.text("MENTAL", { underline: true });
        doc.moveDown(0.5);

        const orientacion = historia.mental?.orientacionEnT || "......";
        const lugar = historia.mental?.lugar || "......";
        doc.text(`Orientación en T y E: ${orientacion}    lugar: ${lugar}`);

        const palabra1 = historia.mental?.palabra1 || "......";
        const palabra2 = historia.mental?.palabra2 || "......";
        const palabra3 = historia.mental?.palabra3 || "......";
        doc.text(
          `Fijación - Repita tres palabras: ${palabra1}, ${palabra2}, ${palabra3}`
        );

        const calculo1 = historia.mental?.calculo1 || "......";
        const calculo2 = historia.mental?.calculo2 || "......";
        const calculo3 = historia.mental?.calculo3 || "......";
        doc.text(
          `Concentración y cálculo: 100-3 = ${calculo1}, -3 = ${calculo2}, -3 = ${calculo3}`
        );

        const palabra1Mem = historia.mental?.palabra1Memoria || "......";
        const palabra2Mem = historia.mental?.palabra2Memoria || "......";
        const palabra3Mem = historia.mental?.palabra3Memoria || "......";
        doc.text(
          `Memoria - Nombre las tres palabras anteriores: ${palabra1Mem}, ${palabra2Mem}, ${palabra3Mem}`
        );

        const respuesta1 = historia.mental?.respuesta1 || "......";
        doc.text(`¿Qué es esto? - ${respuesta1}`);

        const respuestaRepita = historia.mental?.respuestaRepita || "......";
        doc.text(`Repita - en un trigal había 5 perros: ${respuestaRepita}`);

        const textoLeido = historia.mental?.textoLeido || "......";
        const cierreOjos = historia.mental?.cierreOjosYHagalo || "......";
        doc.text(
          `Lea esto ${textoLeido} CIERRE LOS OJOS y hágalo ${cierreOjos}`
        );

        const fraseEscrita = historia.mental?.fraseEscrita || "......";
        doc.text(`Escriba una frase ${fraseEscrita}`);

        const logradoDoble = historia.mental?.logradoDoblePapel || "......";
        doc.text(
          `Tome el papel con la mano izquierda y dóblelo a la mitad ${logradoDoble}`
        );

        const logradoDibujo = historia.mental?.logradoCopieDibujo || "......";
        doc.text(`Copie este dibujo ${logradoDibujo}`);

        doc.moveDown();
        doc.text(
          "30 ...... s/p   25-30 ...... ligero déficit  20/24 ...... leve"
        );
        doc.text("15/19 ...... moderado    0/14 ......");
        doc.moveDown();

        // FUNCIONAL
        doc.text("FUNCIONAL", { underline: true });
        doc.moveDown(0.5);

        const camina = historia.funcional?.camina || "......";
        const conApoyo = historia.funcional?.conApoyo || "......";
        doc.text(`Camina solo ${camina} con apoyo ${conApoyo}`);

        const pasaSentado =
          historia.funcional?.pasaMuchoTiempoSentado || "......";
        doc.text(`Pasa mucho tiempo sentado ${pasaSentado}`);

        const levantateAnda = historia.funcional?.levantateYAnda || "......";
        const equilibrio = historia.funcional?.equilibrio || "......";
        doc.text(
          `Levántate y anda ${levantateAnda}      equilibrio ${equilibrio}`
        );

        const articulaciones = historia.funcional?.articulaciones || "......";
        doc.text(`Articulaciones ${articulaciones}`);

        const caidas = historia.funcional?.caidas || "......";
        doc.text(`Caídas ${caidas}`);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
