// src/App.tsx
import AppRouter from "./routes/AppRouter";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Public
import MainLayout from "./layouts/MainLayout/MainLayout";
import LandingPage from "./pages/public/LandingPage";
import SearchResultsPage from "./pages/public/search/SearchResultsPage";

// Admin
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import ContentManagement from "./pages/admin/contentManagement/ContentManagement";
import AddCategory from "./pages/admin/contentManagement/components/AddCategory";
import AddBanner from "./pages/admin/contentManagement/components/AddBanner";
import AddPromotion from "./pages/admin/contentManagement/components/AddPromotion";
import AdminNotifications from "./pages/admin/notifications/AdminNotifications";

// Vendor
import VendorLayout from "./layouts/VendorLayout/VendorLayout";
import VendorNotifications from "./pages/vendor/notifications/VendorNotifications";

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchResultsPage /></MainLayout>} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="banners/add" element={<AddBanner />} />
          <Route path="promotions/add" element={<AddPromotion />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* ── Vendor ── */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<VendorNotifications />} />
          <Route path="notifications" element={<VendorNotifications />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
