// src/routes/AppRouter.tsx
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/useAuth";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import LandingLayout from "../layouts/MainLayout/LandingLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import AdminSectionPlaceholder from "../pages/admin/AdminSectionPlaceholder";
import DashboardAdmin from "../pages/admin/dashboard/AdminDashboard";
import VendorManagement from "../pages/admin/VendorManagement/VendorManagement";
import CustomerMain from "../pages/Customer/customerMain";
import UserDashboard from "../pages/Customer/UserDashboard";
import ForgotPassword from "../pages/public/auth/ForgotPassword";
import Login from "../pages/public/auth/Login";
import Register from "../pages/public/auth/Register";
import LandingPage from "../pages/public/LandingPage";
import SearchResultsPage from "../pages/public/search/SearchResultsPage";
import ViewProduct from "../pages/public/ViewProduct/ViewProduct";
import BusinessInfo from "../pages/vendor/Application/BusinessInfo";
import Categories from "../pages/vendor/Application/Categories";
import ContactInfo from "../pages/vendor/Application/ContactInfo";
import Documents from "../pages/vendor/Application/Documents";
import Review from "../pages/vendor/Application/Review";
import Availability from "../pages/vendor/Availability/Availability";
import Bookings from "../pages/vendor/Bookings/Bookings";
import CreateListing from "../pages/vendor/CreateListing/CreateListing";
import Dashboard from "../pages/vendor/Dashboard/Dashboard";
import VendorListings from "../pages/vendor/Listings/VendorListings";
import VendorSettings from "../pages/vendor/settings/Settings";
import UserNotificationsPage from "../pages/user/notifications/UserNotificationsPage";

type RoleGateProps = {
  allowedRole: "admin" | "vendor";
  children: ReactNode;
};

function getRoleHomePath(role: string) {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "admin") return "/admin/dashboard";
  if (normalizedRole === "vendor") return "/vendor/dashboard";
  if (normalizedRole === "customer") return "/";

  return "/";
}

function RoleGate({ allowedRole, children }: RoleGateProps) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  const role = String(user?.role ?? "").toLowerCase();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to={getRoleHomePath(role)} replace />;
  }

  return <>{children}</>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route element={<MainLayout />}>
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
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="listings" element={<VendorListings />} />
        <Route path="listings/new" element={<CreateListing />} />
        <Route path="listings/edit/:id" element={<CreateListing />} />
        <Route path="availability" element={<Availability />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>

      <Route
        path="/vendor/businessinfo"
        element={
          <RequireAuth>
            <BusinessInfo />
          </RequireAuth>
        }
      />
      <Route
        path="/vendor/contactinfo"
        element={
          <RequireAuth>
            <ContactInfo />
          </RequireAuth>
        }
      />
      <Route
        path="/vendor/categories"
        element={
          <RequireAuth>
            <Categories />
          </RequireAuth>
        }
      />
      <Route
        path="/vendor/documents"
        element={
          <RequireAuth>
            <Documents />
          </RequireAuth>
        }
      />
      <Route
        path="/vendor/review"
        element={
          <RequireAuth>
            <Review />
          </RequireAuth>
        }
      />

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

      <Route path="/user">
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="notifications" element={<UserNotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
