import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme/theme";

export const metadata = {
  title: "Pacientes Maru",
  description: "Listado de pacientes de Maru",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
