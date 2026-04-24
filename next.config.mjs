/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  /* config options here */
  reactCompiler: true,
=======
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
>>>>>>> 5b8341ff5b2bd5121035b27d5b4baf0191121453
};

export default nextConfig;
