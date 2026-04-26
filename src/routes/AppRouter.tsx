// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";

// Public
import LandingPage from "../pages/public/LandingPage";
import SearchResultsPage from "../pages/public/search/SearchResultsPage";

// Admin
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import ContentManagement from "../pages/admin/contentManagement/ContentManagement";
import AddCategory from "../pages/admin/contentManagement/components/AddCategory";
import AddBanner from "../pages/admin/contentManagement/components/AddBanner";
import AddPromotion from "../pages/admin/contentManagement/components/AddPromotion";
import AdminNotifications from "../pages/admin/notifications/AdminNotifications";

// Vendor (existing develop)
import VendorListings from "../pages/vendor/Listings/VendorListings";
import Bookings from "../pages/vendor/Bookings";
import Dashboard from "../pages/vendor/Dashboard";
import Availability from "../pages/vendor/Availability";

// Vendor (your feature)
import VendorNotifications from "../pages/vendor/notifications/VendorNotifications";

function AppRouter() {
  return (
    <Routes>
      {/* ───────── PUBLIC ───────── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
      </Route>

      {/* ───────── ADMIN ───────── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="banners/add" element={<AddBanner />} />
        <Route path="promotions/add" element={<AddPromotion />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      {/* ───────── VENDOR ───────── */}
      <Route path="/vendor" element={<VendorLayout />}>
        {/* existing */}
        <Route index element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="listings" element={<VendorListings />} />
        <Route path="availability" element={<Availability />} />

        {/* your feature */}
        <Route path="notifications" element={<VendorNotifications />} />
      </Route>

      {/* ───────── FALLBACK ───────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;