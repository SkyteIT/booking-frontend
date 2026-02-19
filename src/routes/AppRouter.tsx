// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LandingPage from "../pages/public/LandingPage";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import Listings from "../pages/vendor/Listings";
import Bookings from "../pages/vendor/Bookings";
import Dashboard from "../pages/vendor/Dashboard";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        {/* default fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
       
      </Route>
       <Route path="/vendor" element={<VendorLayout />}>
        {/* Vendor-specific routes can be nested here */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="listings" element={<Listings />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
