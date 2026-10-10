import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import theme from "../theme/theme";

export const metadata = {
  title: "Pacientes Maru",
  description: "Listado de pacientes de Maru",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: extensiones del navegador (p. ej. Scribe) agregan atributos a <html>
    <html lang="es" suppressHydrationWarning>
      <body>
        {/* Inyecta los estilos de MUI en el <head> del HTML del servidor: evita errores de hidratación */}
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
