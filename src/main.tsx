// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // ← add this
import App from "./App";
import "./index.css";

// Define theme inline temporarily to rule out import issue
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563EB",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
