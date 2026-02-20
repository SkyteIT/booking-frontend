// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import LandingPage from "./pages/public/LandingPage";

import Login from "./pages/public/auth/Login";
import Register from "./pages/public/auth/Register";
import ForgotPassword from "./pages/public/auth/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page with Main Layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          }
        />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
