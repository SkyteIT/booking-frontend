// src/routes/AppRouter.tsx
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "../components/cart/app/contexts/CartContext";
import { BookingOversightPage } from "../pages/admin/BookingOversightPage";
import AdminSectionPlaceholder from "../pages/admin/AdminSectionPlaceholder";
import DashboardAdmin from "../pages/admin/Dashboard";
import { UserManagementPage } from "../pages/admin/UserManagementPage";
import AdminNotifications from "../pages/admin/notifications/AdminNotifications";
import CustomerNotifications from "../pages/customer/notifications/CustomerNotifications";
import AddBanner from "../pages/admin/contentManagement/components/AddBanner";
import AddCategory from "../pages/admin/contentManagement/components/AddCategory";
import AddPromotion from "../pages/admin/contentManagement/components/AddPromotion";
import AdminSettings from "../pages/admin/settings/AdminSettings";
import ProfileSettings from "../pages/admin/settings/sections/ProfileSettings";
import SystemSettings from "../pages/admin/settings/sections/SystemSettings";
import BookingSettings from "../pages/admin/settings/sections/BookingSettings";
import NotificationSettings from "../pages/admin/settings/sections/NotificationSettings";
import UsersVendorSettings from "../pages/admin/settings/sections/UsersVendorSettings";
import SecuritySettings from "../pages/admin/settings/sections/SecuritySettings";
import ContentManagement from "../pages/admin/contentManagement/ContentManagement";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/useAuth";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import LandingLayout from "../layouts/MainLayout/LandingLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import CustomerMain from "../pages/Customer/customerMain";
import CustomerBookings from "../pages/Customer/CustomerBookings";
import CustomerPaymentMethods from "../pages/Customer/CustomerPaymentMethods";
import CustomerReviews from "../pages/Customer/CustomerReviews";
import UserDashboard from "../pages/Customer/UserDashboard";
import CustomerSettings from "../pages/Customer/CustomerSettings";
import ForgotPassword from "../pages/Public/Auth/ForgotPassword";
import ResetPassword from "../pages/Public/Auth/ResetPassword";
import Login from "../pages/Public/Auth/Login";
import Register from "../pages/Public/Auth/Register";
import LandingPage from "../pages/Public/LandingPage";
import SearchResultsPage from "../pages/Public/Search/SearchResultsPage";
import ViewProduct from "../pages/Public/ViewProduct/ViewProduct";
import Availability from "../pages/Vendor/Availability/Availability";
import VendorReviews from "../pages/Vendor/Reviews/VendorReviews";
import Bookings from "../pages/Vendor/Bookings/Bookings";
import BusinessInfo from "../pages/Vendor/Application/BusinessInfo";
import Categories from "../pages/Vendor/Application/Categories";
import ContactInfo from "../pages/Vendor/Application/ContactInfo";
import Documents from "../pages/Vendor/Application/Documents";
import Review from "../pages/Vendor/Application/Review";
import CreateListing from "../pages/Vendor/CreateListing/CreateListing";
import Dashboard from "../pages/Vendor/Dashboard/Dashboard";
import VendorListings from "../pages/Vendor/Listings/VendorListings";
import VendorNotifications from "../pages/vendor/notifications/VendorNotifications";
import Settings from "../pages/Vendor/Settings/Settings";
import VendorManagement from "../pages/admin/VendorManagement";
import { CartPage } from "../components/cart/app/pages/CartPage";
import { CheckoutPage } from "../components/cart/app/pages/CheckoutPage";
import { ConfirmationPage } from "../components/cart/app/pages/ConfirmationPage";
import { PaymentPage } from "../components/cart/app/pages/PaymentPage";

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
    <CartProvider>
      <Routes>
        {/* Landing page with no top padding */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Route>

        {/* Other public pages with top padding */}
        <Route element={<MainLayout />}>
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/view-product/:id" element={<ViewProduct />} />
          <Route path="/listing/:id" element={<ViewProduct />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/customer" element={<CustomerMain />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="payments" element={<CustomerPaymentMethods />} />
          <Route path="settings" element={<CustomerSettings />} />
          <Route path="notifications" element={<CustomerNotifications />} />
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
          <Route path="listings/edit/:id" element={<CreateListing />} />
          <Route path="availability" element={<Availability />} />
          <Route path="reviews" element={<VendorReviews />} />
          <Route path="notifications" element={<VendorNotifications />} />
          <Route path="settings" element={<Settings />} />
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

        {/* Admin routes */}
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
          <Route path="users" element={<UserManagementPage />} />
          <Route path="bookings" element={<BookingOversightPage />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="settings" element={<AdminSettings />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="system" element={<SystemSettings />} />
            <Route path="booking" element={<BookingSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="users-vendor" element={<UsersVendorSettings />} />
            <Route path="security" element={<SecuritySettings />} />
          </Route>
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="banners/add" element={<AddBanner />} />
          <Route path="promotions/add" element={<AddPromotion />} />
          <Route path=":section" element={<AdminSectionPlaceholder />} />
        </Route>
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

        {/* default fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
}

export default AppRouter;
