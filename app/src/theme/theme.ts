import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#1976d2" },
      secondary: { main: "#FFBB28" },
      background: { default: mode === "dark" ? "#121212" : "#f5f5f5" },
    },
  });