// src/routes/AppRouter.tsx
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "../components/cart/app/contexts/CartContext";
import { BookingOversightPage } from "../pages/admin/BookingOversightPage";
import { DisputesRefundsPage } from "../pages/admin/DisputesRefundsPage";
import { FraudReviewPage } from "../pages/admin/FraudReviewPage";
import { RoleChangeRequestsPage } from "../pages/admin/RoleChangeRequestsPage";
import { EmailChangeRequestsPage } from "../pages/admin/EmailChangeRequestsPage";
import AdminSectionPlaceholder from "../pages/admin/AdminSectionPlaceholder";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminFinancePage from "../pages/admin/finance/AdminFinancePage";
import DashboardAdmin from "../pages/admin/Dashboard";
import { UserManagementPage } from "../pages/admin/UserManagementPage";
import AdminNotifications from "../pages/admin/notifications/AdminNotifications";
import AddBanner from "../pages/admin/contentManagement/components/AddBanner";
import AddCategory from "../pages/admin/contentManagement/components/AddCategory";
import AddPromotion from "../pages/admin/contentManagement/components/AddPromotion";
import ContentManagement from "../pages/admin/contentManagement/ContentManagement";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/useAuth";
import { getRoleHomePath } from "../utils/roleHomePath";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import LandingLayout from "../layouts/MainLayout/LandingLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import CustomerMain from "../pages/Customer/customerMain";
import UserDashboard from "../pages/Customer/UserDashboard";
import CustomerReviews from "../pages/Customer/CustomerReviews";
import CustomerBookings from "../pages/Customer/CustomerBookings";
import CustomerSettings from "../pages/Customer/CustomerSettings";
import CustomerNotificationsPage from "../pages/Customer/CustomerNotificationsPage";
import ForgotPassword from "../pages/Public/Auth/ForgotPassword";
import Login from "../pages/Public/Auth/Login";
import Register from "../pages/Public/Auth/Register";
import ResetPassword from "../pages/Public/Auth/ResetPassword";
import VerifyEmail from "../pages/Public/Auth/VerifyEmail";
import TwoFactorEnroll from "../pages/Public/Auth/TwoFactorEnroll";
import TwoFactorVerify from "../pages/Public/Auth/TwoFactorVerify";
import LandingPage from "../pages/Public/LandingPage";
import SearchResultsPage from "../pages/Public/Search/SearchResultsPage";
import ViewProduct from "../pages/Public/ViewProduct/ViewProduct";
import Availability from "../pages/Vendor/Availability/Availability";
import Pricing from "../pages/Vendor/Pricing/Pricing";
import VendorReviews from "../pages/Vendor/Reviews/VendorReviews";
import Payouts from "../pages/Vendor/Payouts/Payouts";
import Bookings from "../pages/Vendor/Bookings/Bookings";
import BusinessInfo from "../pages/Vendor/Application/BusinessInfo";
import Categories from "../pages/Vendor/Application/Categories";
import ContactInfo from "../pages/Vendor/Application/ContactInfo";
import Documents from "../pages/Vendor/Application/Documents";
import Review from "../pages/Vendor/Application/Review";
import ApplicationStatus from "../pages/Vendor/Application/ApplicationStatus";
import CreateListing from "../pages/Vendor/CreateListing/CreateListing";
import Dashboard from "../pages/Vendor/Dashboard/Dashboard";
import VendorListings from "../pages/Vendor/Listings/VendorListings";
import VendorNotifications from "../pages/Vendor/Notifications/VendorNotifications";
import Settings from "../pages/Vendor/Settings/Settings";
import VendorSupport from "../pages/Vendor/Support/VendorSupport";
import VendorManagement from "../pages/admin/VendorManagement";
import { CartPage } from "../components/cart/app/pages/CartPage";
import { CheckoutPage } from "../components/cart/app/pages/CheckoutPage";
import { ConfirmationPage } from "../components/cart/app/pages/ConfirmationPage";
import { PaymentPage } from "../components/cart/app/pages/PaymentPage";

type RoleGateProps = {
  allowedRole: string | string[];
  children: ReactNode;
};

function RoleGate({ allowedRole, children }: RoleGateProps) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  const role = String(user?.role ?? "").toLowerCase();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // SuperAdmin "watches everything" - bypasses every RoleGate check
  // rather than needing to be added to each one individually.
  if (role === "superadmin") {
    return <>{children}</>;
  }

  const allowed = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  if (!allowed.some((r) => r.toLowerCase() === role)) {
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
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/2fa-enroll" element={<TwoFactorEnroll />} />
        <Route path="/2fa-verify" element={<TwoFactorVerify />} />

        <Route
          path="/customer"
          element={
            <RequireAuth>
              <CustomerMain />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="settings" element={<CustomerSettings />} />
          <Route path="notifications" element={<CustomerNotificationsPage />} />
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
          <Route path="pricing" element={<Pricing />} />
          <Route path="reviews" element={<VendorReviews />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="notifications" element={<VendorNotifications />} />
          {/* Kept as a redirect, not a second page - "Earnings" (payouts)
              absorbed the old standalone Reports tab; this just saves
              anyone with the old URL bookmarked from hitting a dead link. */}
          <Route path="reports" element={<Navigate to="/vendor/payouts" replace />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<VendorSupport />} />
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
          path="/vendor/application-status"
          element={
            <RequireAuth>
              <ApplicationStatus />
            </RequireAuth>
          }
        />

        {/* Admin routes - Admin and Finance both enter the shell; each
            Admin-only page is gated again individually so Finance can't
            reach it just by typing the URL. Disputes/Fraud Review are the
            two domains already Finance-gated backend-side, so they stay
            open to both. SuperAdmin bypasses every gate here (RoleGate). */}
        <Route
          path="/admin"
          element={
            <RoleGate allowedRole={["admin", "finance"]}>
              <AdminLayout />
            </RoleGate>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RoleGate allowedRole="admin"><DashboardAdmin /></RoleGate>} />
          <Route path="users" element={<RoleGate allowedRole="admin"><UserManagementPage /></RoleGate>} />
          <Route path="role-requests" element={<RoleGate allowedRole="superadmin"><RoleChangeRequestsPage /></RoleGate>} />
          <Route path="email-requests" element={<RoleGate allowedRole="superadmin"><EmailChangeRequestsPage /></RoleGate>} />
          <Route path="bookings" element={<RoleGate allowedRole="admin"><BookingOversightPage /></RoleGate>} />
          <Route path="disputes" element={<DisputesRefundsPage />} />
          <Route path="fraud-review" element={<FraudReviewPage />} />
          <Route path="vendors" element={<RoleGate allowedRole="admin"><VendorManagement /></RoleGate>} />
          <Route path="notifications" element={<RoleGate allowedRole="admin"><AdminNotifications /></RoleGate>} />
          <Route path="finance" element={<RoleGate allowedRole={["admin", "finance"]}><AdminFinancePage /></RoleGate>} />
          <Route path="content" element={<RoleGate allowedRole="admin"><ContentManagement /></RoleGate>} />
          <Route path="categories/add" element={<RoleGate allowedRole="admin"><AddCategory /></RoleGate>} />
          <Route path="banners/add" element={<RoleGate allowedRole="admin"><AddBanner /></RoleGate>} />
          <Route path="promotions/add" element={<RoleGate allowedRole="admin"><AddPromotion /></RoleGate>} />
          <Route path="settings" element={<RoleGate allowedRole={["admin", "finance"]}><AdminSettingsPage /></RoleGate>} />
          <Route path=":section" element={<RoleGate allowedRole="admin"><AdminSectionPlaceholder /></RoleGate>} />
        </Route>
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

        {/* default fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
}

export default AppRouter;
