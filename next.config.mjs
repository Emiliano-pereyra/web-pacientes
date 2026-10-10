const esDev = process.env.NODE_ENV !== "production";

/**
 * Política de contenido (CSP). Solo se permite lo que la app usa:
 *  - Firebase Auth: login con Google en ventana emergente (apis.google.com,
 *    el dominio de auth del proyecto) y las APIs de tokens (*.googleapis.com).
 *  - Fotos y archivos de Storage (enlaces firmados) y fotos de perfil de Google.
 *  - blob: para la vista previa de archivos y los PDF generados.
 *  - 'unsafe-inline' en estilos: MUI (Emotion) inyecta <style> en tiempo de ejecución.
 *  - 'unsafe-inline' en scripts: Next.js usa scripts inline para hidratar la página.
 *    Para quitarlo hace falta CSP con nonce vía middleware (renderizado dinámico).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://apis.google.com${esDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // storage.googleapis.com: enlaces firmados (vencen) que genera la API para fotos y archivos
  "img-src 'self' data: blob: https://storage.googleapis.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com",
  "media-src 'self' blob: https://storage.googleapis.com https://firebasestorage.googleapis.com",
  "font-src 'self'",
  `connect-src 'self' https://*.googleapis.com https://apis.google.com${esDev ? " ws: wss:" : ""}`,
  "frame-src https://pacientes-2c28e.firebaseapp.com https://accounts.google.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(esDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const encabezadosSeguridad = [
  { key: "Content-Security-Policy", value: csp },
  // No se puede mostrar la app dentro de un iframe de otro sitio (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // same-origin-allow-popups: el login con Google usa una ventana emergente que necesita window.opener
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  ...(esDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Las fuentes del PDF se leen con fs: hay que incluirlas en el bundle de Vercel
  outputFileTracingIncludes: {
    "/api/exportador/[tipo]": ["./src/utils/pdf/fonts/**"],
  },

  async headers() {
    return [
      { source: "/:path*", headers: encabezadosSeguridad },
      // Datos clínicos: ni el navegador ni intermediarios guardan copias de las respuestas de la API
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
    ];
  },
};

export default nextConfig;
