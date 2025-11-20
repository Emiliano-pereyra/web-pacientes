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
"[project]/web-pacientes/src/lib/firebase.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db,
    "firebaseConfig",
    ()=>firebaseConfig
]);
(()=>{
    const e = new Error("Cannot find module 'firebase/app'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'firebase/firestore'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const firebaseConfig = {
    apiKey: "AIzaSyA0UHMyHqtxx5yDsBaRFXbMkTbfkF4qYs0",
    authDomain: "pacientes-2c28e.firebaseapp.com",
    projectId: "pacientes-2c28e",
    storageBucket: "pacientes-2c28e.firebasestorage.app",
    messagingSenderId: "458153598528",
    appId: "1:458153598528:web:f92a305edc99cb269949a5"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
}),
"[project]/web-pacientes/src/controller/pacientesController.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDatosPaciente",
    ()=>getDatosPaciente,
    "getPacientes",
    ()=>getPacientes
]);
(()=>{
    const e = new Error("Cannot find module 'firebase/firestore'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/src/lib/firebase.js [app-route] (ecmascript)");
;
;
const getPacientes = async ()=>{
    try {
        const listaRef = collection(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"], "pacientes", "lista");
        const listaSnap = await getDocs(listaRef);
        const pacientes = listaSnap.docs.map((doc)=>({
                id: doc.id,
                nombre: doc.id.replace(/_/g, " ")
            }));
        return pacientes;
    } catch (error) {
        console.error("Error obteniendo pacientes:", error);
        throw new Error("No se pudieron obtener los pacientes");
    }
};
const getDatosPaciente = async (idPaciente)=>{
    try {
        const datosRef = collection(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"], "pacientes", "lista", idPaciente, "datos");
        const datosSnap = await getDocs(datosRef);
        const datos = datosSnap.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }));
        return datos;
    } catch (error) {
        console.error("Error obteniendo datos del paciente:", error);
        throw new Error("No se pudieron obtener los datos del paciente");
    }
};
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/web-pacientes/src/app/api/pacientes/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$controller$2f$pacientesController$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/src/controller/pacientesController.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET(request, { params }) {
    try {
        const { id } = params;
        const datos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$src$2f$controller$2f$pacientesController$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatosPaciente"])(id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(datos);
    } catch (error) {
        console.error("Error en la ruta /api/paciente/[id]:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__35636147._.js.map