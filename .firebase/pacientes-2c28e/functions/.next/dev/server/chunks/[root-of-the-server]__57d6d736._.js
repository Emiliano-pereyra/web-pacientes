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
"[project]/web-pacientes/src/utils/pdf/exportadorController.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generarPDF",
    ()=>generarPDF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$pdfkit$2f$js$2f$pdfkit$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/pdfkit/js/pdfkit.es.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/stream [external] (stream, cjs)");
;
;
function generarPDF(datos, tipoTab) {
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$pdfkit$2f$js$2f$pdfkit$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
        size: "A4",
        margin: 40
    });
    const stream = new __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["Readable"]({
        read () {}
    });
    doc.on("data", (chunk)=>stream.push(chunk));
    doc.on("end", ()=>stream.push(null));
    doc.fontSize(18).text("Informe del Paciente", {
        align: "center"
    });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown(2);
    switch(tipoTab){
        case "diagnostico":
            doc.fontSize(14).text("Diagnóstico Médico", {
                underline: true
            });
            doc.moveDown();
            doc.fontSize(12).text(`Paciente: ${datos.nombre}`);
            doc.text(`Edad: ${datos.edad}`);
            doc.text(`Diagnóstico: ${datos.diagnostico}`);
            break;
        case "tratamiento":
            doc.fontSize(14).text("Plan de Tratamiento", {
                underline: true
            });
            doc.moveDown();
            doc.text(`Paciente: ${datos.nombre}`);
            doc.text(`Tratamiento: ${datos.tratamiento}`);
            doc.text(`Duración: ${datos.duracion}`);
            break;
        case "historial":
            doc.fontSize(14).text("Historial Clínico", {
                underline: true
            });
            doc.moveDown();
            datos.historial.forEach((item, i)=>{
                doc.text(`${i + 1}. ${item.fecha} - ${item.detalle}`);
            });
            break;
        case "clinico":
            doc.fontSize(18).text("Clínico", {
                align: "center",
                underline: true
            });
            doc.moveDown(1.5);
            doc.fontSize(14).text("Antecedentes de importancia:", {
                continued: true
            });
            doc.fontSize(12).text(` VASCULARES  TA: ${datos.clinico?.vasculares_ta || ""}  CARDIO: ${datos.clinico?.cardio || ""}`);
            doc.moveDown();
            doc.text(`V PERIF: ${datos.clinico?.vperif || ""}  edemas: ${datos.clinico?.edemas || ""}  úlceras: ${datos.clinico?.ulceras || ""}  DIGESTIVOS: ${datos.clinico?.digestivos || ""}`);
            doc.text(`Constipación: ${datos.clinico?.constipacion || ""}  RESPIRATORIAS: ${datos.clinico?.respiratorias || ""}`);
            doc.text(`METAB: ${datos.clinico?.metab || ""}  DBT: ${datos.clinico?.dbt || ""}  Tiroides: ${datos.clinico?.tiroides || ""}`);
            doc.text(`OSTEOMUSC: ${datos.clinico?.osteomusc || ""}  Articulaciones: ${datos.clinico?.articulaciones || ""}`);
            doc.text(`GINECOLÓGICAS: ${datos.clinico?.ginecologicas || ""}  UROLÓGICAS: ${datos.clinico?.urologicas || ""}`);
            doc.text(`Continencia: ${datos.clinico?.continencia || ""}`);
            doc.text(`DERMATOLÓGICAS: ${datos.clinico?.dermatologicas || ""}`);
            doc.text(`SENSORIALES  Auditivas: ${datos.clinico?.auditivas || ""}  Olfativas: ${datos.clinico?.olfativas || ""}  Visuales: ${datos.clinico?.visuales || ""}  Gustativas: ${datos.clinico?.gustativas || ""}`);
            doc.text(`SNC  Parálisis: ${datos.clinico?.paralisis || ""}  Parestesias: ${datos.clinico?.parestesias || ""}  Temblores: ${datos.clinico?.temblores || ""}  Convulsiones: ${datos.clinico?.convulsiones || ""}`);
            doc.text(`Afasias: ${datos.clinico?.afasias || ""}  Disartria: ${datos.clinico?.disartria || ""}`);
            doc.text(`Actitud psíquica  Activa: ${datos.clinico?.activa || ""}  Pasiva: ${datos.clinico?.pasiva || ""}`);
            doc.moveDown(2);
            doc.fontSize(14).text("Examen físico:", {
                underline: true
            });
            doc.fontSize(12).text(`Fasciales: ${datos.clinico?.fasciales || ""}  Ojos: ${datos.clinico?.ojos || ""}  Boca: ${datos.clinico?.boca || ""}`);
            doc.text(`Dentición: ${datos.clinico?.denticion || ""}`);
            doc.text(`(…)`);
            break;
        default:
            doc.text("Sin datos específicos para este tab.");
    }
    doc.end();
    return stream;
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/web-pacientes/src/app/api/exportador/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$utils$2f$pdf$2f$exportadorController$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/src/utils/pdf/exportadorController.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const { datos, tipoTab } = await req.json();
        const pdfStream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$utils$2f$pdf$2f$exportadorController$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generarPDF"])(datos, tipoTab);
        return new Response(pdfStream, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="reporte_${tipoTab}.pdf"`
            }
        });
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error al generar el PDF"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__57d6d736._.js.map