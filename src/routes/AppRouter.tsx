// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LandingPage from "../pages/public/LandingPage";
import SearchResultsPage from "../pages/public/search/SearchResultsPage";
import ViewProduct from "../pages/public/ViewProduct/ViewProduct";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import VendorListings from "../pages/vendor/Listings/VendorListings";
import CreateListing from "../pages/vendor/CreateListing/CreateListing";
import Bookings from "../pages/vendor/Bookings/Bookings";
import Dashboard from "../pages/vendor/Dashboard/Dashboard";
import Availability from "../pages/vendor/Availability/Availability";
import Settings from "../pages/vendor/Settings/Settings";
import Login from "../pages/public/auth/Login";
import Register from "../pages/public/auth/Register";
import ForgotPassword from "../pages/public/auth/ForgotPassword";
import CustomerMain from "../pages/customer/customerMain";
import UserDashboard from "../pages/customer/UserDashboard";
import BusinessInfo from "../pages/vendor/application/BusinessInfo";
import ContactInfo from "../pages/vendor/application/ContactInfo";
import Categories from "../pages/vendor/application/Categories";
import Documents from "../pages/vendor/application/Documents";
import Review from "../pages/vendor/application/Review";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import VendorManagement from "../pages/admin/VendorManagement/VendorManagement";
import DashboardAdmin from "../pages/admin/Dashboard";
import AdminSectionPlaceholder from "../pages/admin/AdminSectionPlaceholder";
import { useAuth } from "../context/AuthContext";

type RoleGateProps = {
  allowedRole: "admin" | "vendor";
  children: ReactNode;
};

function getRoleHomePath(role: string) {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "admin") return "/admin/dashboard";
  if (normalizedRole === "vendor") return "/";
  if (normalizedRole === "customer") return "/";

  return "/";
}

function RoleGate({ allowedRole, children }: RoleGateProps) {
  const { user, loading } = useAuth();

  if (loading) return null;

  const role = String(user?.role ?? "").toLowerCase();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to={getRoleHomePath(role)} replace />;
  }

  return <>{children}</>;
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/view-product/:id" element={<ViewProduct />} />
        <Route path="/listing/:id" element={<ViewProduct />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/customer" element={<CustomerMain />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
      </Route>

      <Route
        path="/vendor"
        element={
          <RoleGate allowedRole="vendor">
            <VendorLayout />
          </RoleGate>
        }
      >
        {/* Vendor-specific routes can be nested here */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="listings" element={<VendorListings />} />
        <Route path="listings/new" element={<CreateListing />} />
        <Route path="availability" element={<Availability />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/vendor/businessinfo" element={<BusinessInfo />} />
      <Route path="/vendor/contactinfo" element={<ContactInfo />} />
      <Route path="/vendor/categories" element={<Categories />} />
      <Route path="/vendor/documents" element={<Documents />} />
      <Route path="/vendor/review" element={<Review />} />
      
      // Admin routes
      <Route
        path="/admin"
        element={
          <RoleGate allowedRole="admin">
            <AdminLayout />
          </RoleGate>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path=":section" element={<AdminSectionPlaceholder />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      {/* default fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
