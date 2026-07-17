// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VendorApplicationProvider } from "./context/VendorApplicationContext";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <VendorApplicationProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </VendorApplicationProvider>
    </AuthProvider>
  );
}

export default App;