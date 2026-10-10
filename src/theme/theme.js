"use client";
import { createTheme } from "@mui/material/styles";

/** Pantallas táctiles (iPad, celulares): objetivos de al menos 44 px, como pide Apple. */
const TACTIL = "@media (pointer: coarse)";

/**
 * Tema clínico: azul petróleo sobrio, fondo gris muy claro y superficies blancas.
 * La fuente (Inter) se carga con next/font en layout.js y llega por --font-sans.
 */
const theme = createTheme({
  palette: {
    primary: { main: "#0e6377", light: "#e6f1f4", dark: "#0a4757", contrastText: "#ffffff" },
    secondary: { main: "#475569", contrastText: "#ffffff" },
    error: { main: "#c62828" },
    background: { default: "#f5f7f9", paper: "#ffffff" },
    text: { primary: "#1e293b", secondary: "#5b6676" },
    divider: "#e2e8f0",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "var(--font-sans), system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    h5: { fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600, fontSize: "1.05rem", letterSpacing: "-0.005em" },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          transition: "background-color 150ms ease, border-color 150ms ease, transform 120ms ease-out",
          "&:active": { transform: "scale(0.97)" },
          [TACTIL]: { minHeight: 44 },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { [TACTIL]: { minWidth: 44, minHeight: 44 } } },
    },
    MuiCheckbox: {
      styleOverrides: { root: { [TACTIL]: { padding: 10 } } },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: { [TACTIL]: { minHeight: 44 } },
        // En pantallas táctiles la "x" para borrar se ve siempre (no hay hover)
        clearIndicator: { [TACTIL]: { visibility: "visible" } },
      },
    },
    MuiInputBase: {
      // 16 px evita que Safari en iPhone/iPad haga zoom al tocar un campo
      styleOverrides: { input: { [TACTIL]: { fontSize: 16 } } },
    },
    MuiListItemButton: {
      styleOverrides: { root: { [TACTIL]: { minHeight: 56 } } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { outlined: { borderColor: "#e2e8f0" } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: { root: { borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" } },
    },
    MuiTab: { styleOverrides: { root: { textTransform: "none", fontWeight: 600, minHeight: 44 } } },
    MuiTooltip: { defaultProps: { arrow: true } },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

export default theme;
