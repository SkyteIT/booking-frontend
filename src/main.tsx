// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // ← add this
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
    <GoogleOAuthProvider clientId="722594355617-j73v9slh5v8ctop8lnma9lt6fl1mhthg.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
