module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/web-pacientes/src/utils/pdf/exportadorController.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generarPDFHistoria",
    ()=>generarPDFHistoria
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$pdfkit$2f$js$2f$pdfkit$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/pdfkit/js/pdfkit.es.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/url [external] (url, cjs)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("web-pacientes/src/utils/pdf/exportadorController.js")}`;
    }
};
;
;
;
;
const __filename = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__["fileURLToPath"])(__TURBOPACK__import$2e$meta__.url);
const __dirname = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(__filename);
const fontPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "src/utils/pdf/fonts/Roboto-Regular.ttf");
async function generarPDFHistoria(datos, tipoTab) {
    return new Promise((resolve, reject)=>{
        try {
            const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$pdfkit$2f$js$2f$pdfkit$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
                size: "A4",
                margin: 50,
                font: fontPath
            });
            const buffers = [];
            doc.on("data", (chunk)=>buffers.push(chunk));
            doc.on("end", ()=>{
                const pdfBuffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat(buffers);
                resolve(pdfBuffer);
            });
            if (tipoTab === "historia-clinica") {
                const paciente = datos.paciente || {};
                const historia = datos.historia || {};
                doc.fontSize(18).font(fontPath).text(`HISTORIA CLÍNICA DE ${paciente.nombreVisible || ""}`, {
                    align: "center"
                });
                doc.moveDown(1.5);
                const fechaIngreso = paciente.fechaIngreso || "......";
                const fechaNacimiento = paciente.fechaNacimiento || "......";
                const edad = paciente.edad || "......";
                const dni = paciente.dni || "......";
                const os = paciente.os || "......";
                const afNumero = paciente.afNumero || "......";
                doc.fontSize(12).font(fontPath).text(`Fecha de ingreso: ${fechaIngreso}    Fecha de nacimiento: ${fechaNacimiento}    Edad: ${edad}`).moveDown();
                doc.text(`DNI: ${dni}    OS: ${os}    AF N°: ${afNumero}`);
                doc.moveDown(1.5);
                doc.fontSize(14).font(fontPath).text("VALORACION GERIÁTRICA", {
                    underline: true
                });
                doc.moveDown();
                doc.fontSize(12).font(fontPath).text("SOCIAL", {
                    underline: true
                });
                doc.moveDown(0.5);
                const conQuienVive = historia.social?.conQuienVive || "......";
                doc.text(`Con quién vive: ${conQuienVive}`);
                doc.moveDown();
                // MENTAL
                doc.text("MENTAL", {
                    underline: true
                });
                doc.moveDown(0.5);
                const orientacion = historia.mental?.orientacionEnT || "......";
                const lugar = historia.mental?.lugar || "......";
                doc.text(`Orientación en T y E: ${orientacion}    lugar: ${lugar}`);
                const palabra1 = historia.mental?.palabra1 || "......";
                const palabra2 = historia.mental?.palabra2 || "......";
                const palabra3 = historia.mental?.palabra3 || "......";
                doc.text(`Fijación - Repita tres palabras: ${palabra1}, ${palabra2}, ${palabra3}`);
                const calculo1 = historia.mental?.calculo1 || "......";
                const calculo2 = historia.mental?.calculo2 || "......";
                const calculo3 = historia.mental?.calculo3 || "......";
                doc.text(`Concentración y cálculo: 100-3 = ${calculo1}, -3 = ${calculo2}, -3 = ${calculo3}`);
                const palabra1Mem = historia.mental?.palabra1Memoria || "......";
                const palabra2Mem = historia.mental?.palabra2Memoria || "......";
                const palabra3Mem = historia.mental?.palabra3Memoria || "......";
                doc.text(`Memoria - Nombre las tres palabras anteriores: ${palabra1Mem}, ${palabra2Mem}, ${palabra3Mem}`);
                const respuesta1 = historia.mental?.respuesta1 || "......";
                doc.text(`¿Qué es esto? - ${respuesta1}`);
                const respuestaRepita = historia.mental?.respuestaRepita || "......";
                doc.text(`Repita - en un trigal había 5 perros: ${respuestaRepita}`);
                const textoLeido = historia.mental?.textoLeido || "......";
                const cierreOjos = historia.mental?.cierreOjosYHagalo || "......";
                doc.text(`Lea esto ${textoLeido} CIERRE LOS OJOS y hágalo ${cierreOjos}`);
                const fraseEscrita = historia.mental?.fraseEscrita || "......";
                doc.text(`Escriba una frase ${fraseEscrita}`);
                const logradoDoble = historia.mental?.logradoDoblePapel || "......";
                doc.text(`Tome el papel con la mano izquierda y dóblelo a la mitad ${logradoDoble}`);
                const logradoDibujo = historia.mental?.logradoCopieDibujo || "......";
                doc.text(`Copie este dibujo ${logradoDibujo}`);
                doc.moveDown();
                doc.text("30 ...... s/p   25-30 ...... ligero déficit  20/24 ...... leve");
                doc.text("15/19 ...... moderado    0/14 ......");
                doc.moveDown();
                // FUNCIONAL
                doc.text("FUNCIONAL", {
                    underline: true
                });
                doc.moveDown(0.5);
                const camina = historia.funcional?.camina || "......";
                const conApoyo = historia.funcional?.conApoyo || "......";
                doc.text(`Camina solo ${camina} con apoyo ${conApoyo}`);
                const pasaSentado = historia.funcional?.pasaMuchoTiempoSentado || "......";
                doc.text(`Pasa mucho tiempo sentado ${pasaSentado}`);
                const levantateAnda = historia.funcional?.levantateYAnda || "......";
                const equilibrio = historia.funcional?.equilibrio || "......";
                doc.text(`Levántate y anda ${levantateAnda}      equilibrio ${equilibrio}`);
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
}),
"[project]/web-pacientes/src/app/api/exportador/historiaClinica/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$utils$2f$pdf$2f$exportadorController$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/src/utils/pdf/exportadorController.js [app-route] (ecmascript)");
;
const runtime = "nodejs";
async function POST(req) {
    try {
        const { datos, tipoTab } = await req.json();
        const pdfBuffer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$utils$2f$pdf$2f$exportadorController$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generarPDFHistoria"])(datos, tipoTab);
        return new Response(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="historia_clinica_${Date.now()}.pdf"`
            }
        });
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        return new Response(JSON.stringify({
            error: error.message || "Error al generar el PDF"
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7a4c73d1._.js.map