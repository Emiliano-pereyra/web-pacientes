import { Inter } from "next/font/google";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Toaster } from "sonner";
import theme from "../theme/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });

export const metadata = {
  title: "Pacientes Maru",
  description: "Historia clínica de pacientes",
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: extensiones del navegador (p. ej. Scribe) agregan atributos a <html>
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body>
        {/* Inyecta los estilos de MUI en el <head> del HTML del servidor: evita errores de hidratación */}
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
