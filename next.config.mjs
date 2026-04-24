/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // Configuración para evitar problemas con fontkit en PDFKit
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'fontkit': false,
      };
    }
    return config;
  },

  // Configuración de Turbopack (vacía para silenciar el error)
  turbopack: {},

  experimental: {
    webpackBuildWorker: true,
  },
};

export default nextConfig;
