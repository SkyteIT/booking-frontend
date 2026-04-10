// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LandingPage from "../pages/public/LandingPage";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import VendorListings from "../pages/vendor/Listings/VendorListings";
import Bookings from "../pages/vendor/Bookings";
import Dashboard from "../pages/vendor/Dashboard";
import Availability from "../pages/vendor/Availability";

import { CartProvider } from "../components/cart/app/contexts/CartContext";
import { CartPage } from "../components/cart/app/pages/CartPage";
import { CheckoutPage } from "../components/cart/app/pages/CheckoutPage";
import { PaymentPage } from "../components/cart/app/pages/PaymentPage";
import { ConfirmationPage } from "../components/cart/app/pages/ConfirmationPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { UserManagementPage } from "../pages/admin/UserManagementPage";
import { BookingOversightPage } from "../pages/admin/BookingOversightPage";


function AppRouter() {
  return (
    <CartProvider>
      <Routes>
        {/* Main app routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Vendor routes */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="listings" element={<VendorListings />} />
          <Route path="availability" element={<Availability />} />
        </Route>

        {/* Admin routes — no layout wrapper */}
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/bookings" element={<BookingOversightPage />} />
      </Routes>
    </CartProvider>
  );
}

export default AppRouter;
