// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LandingPage from "../pages/public/LandingPage";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import VendorListings from "../pages/vendor/Listings/VendorListings";
import Bookings from "../pages/vendor/Bookings";
import Dashboard from "../pages/vendor/Dashboard";
import Availability from "../pages/vendor/Availability";

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
        <Route path="listings" element={<VendorListings />} />
        <Route path="availability" element={<Availability />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
