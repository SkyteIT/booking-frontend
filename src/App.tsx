// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import LandingPage from "./pages/public/LandingPage";

import Login from "./pages/public/auth/Login";
import Register from "./pages/public/auth/Register";
import ForgotPassword from "./pages/public/auth/ForgotPassword";
import BusinessInfo from "./pages/vendor/application/BusinessInfo"; 
import ContactInfo from "./pages/vendor/application/ContactInfo"; 
import Categories from "./pages/vendor/application/Categories";
import Documents from "./pages/vendor/application/Documents"; 
import Review from "./pages/vendor/application/Review";
import UserDashboard from "./pages/customer/UserDashboard";
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

        <Route path="/vendor/businessinfo" element={<BusinessInfo />} />
        <Route path="/vendor/contactinfo" element={<ContactInfo />} />
        <Route path="/vendor/categories" element={<Categories />} />
        <Route path="/vendor/documents" element={<Documents />} />
        <Route path="/vendor/review" element={<Review />} />
         
        <Route path="/dashboard" element={<UserDashboard />} />

      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
