/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Las fuentes del PDF se leen con fs: hay que incluirlas en el bundle de Vercel
  outputFileTracingIncludes: {
    "/api/exportador/[tipo]": ["./src/utils/pdf/fonts/**"],
  },
};

export default nextConfig;
