import React, { createContext, useState, useMemo, useContext } from "react";
import { createTheme } from "@mui/material/styles";

// Create context
export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );

  // Toggle theme mode
  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("themeMode", newMode);
    setMode(newMode);
  };

  // Create theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#3f51b5",
            light: "#757de8",
            dark: "#002984",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#f50057",
            light: "#ff4081",
            dark: "#c51162",
            contrastText: "#ffffff",
          },
          success: {
            main: "#4caf50",
            light: "#80e27e",
            dark: "#087f23",
            contrastText: "#ffffff",
          },
          error: {
            main: "#f44336",
            light: "#e57373",
            dark: "#d32f2f",
            contrastText: "#ffffff",
          },
          warning: {
            main: "#ff9800",
            light: "#ffb74d",
            dark: "#f57c00",
            contrastText: "#000000",
          },
          info: {
            main: "#2196f3",
            light: "#64b5f6",
            dark: "#1976d2",
            contrastText: "#ffffff",
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
          text: {
            primary:
              mode === "light"
                ? "rgba(0, 0, 0, 0.87)"
                : "rgba(255, 255, 255, 0.87)",
            secondary:
              mode === "light"
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.6)",
            disabled:
              mode === "light"
                ? "rgba(0, 0, 0, 0.38)"
                : "rgba(255, 255, 255, 0.38)",
          },
        },
        typography: {
          fontFamily: [
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
          ].join(","),
          h1: {
            fontSize: "2.5rem",
            fontWeight: 500,
          },
          h2: {
            fontSize: "2rem",
            fontWeight: 500,
          },
          h3: {
            fontSize: "1.75rem",
            fontWeight: 500,
          },
          h4: {
            fontSize: "1.5rem",
            fontWeight: 500,
          },
          h5: {
            fontSize: "1.25rem",
            fontWeight: 500,
          },
          h6: {
            fontSize: "1rem",
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow:
                  mode === "light"
                    ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                    : "0 2px 8px rgba(0, 0, 0, 0.4)",
              },
            },
          },
          MuiTable: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#ffffff" : "#1e1e1e",
              },
            },
          },
        },
      }),
    [mode]
  );

  // Context value
  const contextValue = {
    theme,
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
