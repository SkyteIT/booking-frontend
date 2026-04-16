// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LandingPage from "../pages/public/LandingPage";
import SearchResultsPage from "../pages/public/search/SearchResultsPage";
import ViewProduct from "../pages/public/ViewProduct/ViewProduct";
import VendorLayout from "../layouts/VendorLayout/VendorLayout";
import VendorListings from "../pages/vendor/Listings/VendorListings";
import CreateListing from "../pages/vendor/CreateListing/CreateListing";
import Bookings from "../pages/vendor/Bookings";
import Dashboard from "../pages/vendor/Dashboard";
import Availability from "../pages/vendor/Availability";
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

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/view-product/:id" element={<ViewProduct />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/customer" element={<CustomerMain />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
      </Route>

      <Route path="/vendor" element={<VendorLayout />}>
        {/* Vendor-specific routes can be nested here */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="listings" element={<VendorListings />} />
        <Route path="listings/new" element={<CreateListing />} />
        <Route path="availability" element={<Availability />} />
      </Route>

      <Route path="/vendor/businessinfo" element={<BusinessInfo />} />
      <Route path="/vendor/contactinfo" element={<ContactInfo />} />
      <Route path="/vendor/categories" element={<Categories />} />
      <Route path="/vendor/documents" element={<Documents />} />
      <Route path="/vendor/review" element={<Review />} />

      {/* default fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
