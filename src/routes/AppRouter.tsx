// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

// Public
import LandingPage from "../pages/public/LandingPage";
import SearchResultsPage from "../pages/public/search/SearchResultsPage";
import ViewProduct from "../pages/public/ViewProduct/ViewProduct";

// Auth
import Login from "../pages/public/auth/Login";
import Register from "../pages/public/auth/Register";
import ForgotPassword from "../pages/public/auth/ForgotPassword";

// Admin
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import ContentManagement from "../pages/admin/contentManagement/ContentManagement";
import AddCategory from "../pages/admin/contentManagement/components/AddCategory";
import AddBanner from "../pages/admin/contentManagement/components/AddBanner";
import AddPromotion from "../pages/admin/contentManagement/components/AddPromotion";
import AdminNotifications from "../pages/admin/notifications/AdminNotifications";

// Vendor (existing)
import VendorListings from "../pages/vendor/Listings/VendorListings";
import Bookings from "../pages/vendor/Bookings";
import Dashboard from "../pages/vendor/Dashboard";
import Availability from "../pages/vendor/Availability";

// Vendor (features)
import VendorNotifications from "../pages/vendor/notifications/VendorNotifications";
import VendorSettings from "../pages/vendor/settings/VendorSettings";

// User / Customer
import UserDashboard from "../pages/customer/UserDashboard";
import UserNotificationsPage from "../pages/user/notifications/UserNotificationsPage";

function AppRouter() {
  return (
    <Routes>
      {/* ───────── PUBLIC ───────── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/listings/:id" element={<ViewProduct />} />
      </Route>

      {/* ───────── AUTH ───────── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
        <Route index element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="listings" element={<VendorListings />} />
        <Route path="availability" element={<Availability />} />
        <Route path="notifications" element={<VendorNotifications />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>

      {/* ───────── USER / CUSTOMER ───────── */}
      <Route path="/user">
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="notifications" element={<UserNotificationsPage />} />
      </Route>

      {/* ───────── FALLBACK ───────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
