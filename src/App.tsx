import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import VendorLayout from "./layouts/VendorLayout/VendorLayout";
import LandingPage from "./pages/public/LandingPage";
import SearchResultsPage from "./pages/public/search/SearchResultsPage";
import ViewProduct from "./pages/public/ViewProduct/ViewProduct";
import CreateListing from "./pages/vendor/CreateListing/CreateListing";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorListings from "./pages/vendor/Listings/VendorListings";

import Login from "./pages/public/auth/Login";
import Register from "./pages/public/auth/Register";
import ForgotPassword from "./pages/public/auth/ForgotPassword";

import BusinessInfo from "./pages/vendor/application/BusinessInfo";
import ContactInfo from "./pages/vendor/application/ContactInfo";
import Categories from "./pages/vendor/application/Categories";
import Documents from "./pages/vendor/application/Documents";
import Review from "./pages/vendor/application/Review";
import UserDashboard from "./pages/customer/UserDashboard";

import { VendorApplicationProvider } from "./context/VendorApplicationContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <VendorApplicationProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/listing/:id" element={<ViewProduct />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Vendor Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Vendor Application */}
            <Route path="/vendor/businessinfo" element={<BusinessInfo />} />
            <Route path="/vendor/contactinfo" element={<ContactInfo />} />
            <Route path="/vendor/categories" element={<Categories />} />
            <Route path="/vendor/documents" element={<Documents />} />
            <Route path="/vendor/review" element={<Review />} />

            {/* Vendor Dashboard */}
            <Route
              path="/vendor/*"
              element={
                <VendorLayout>
                  <Routes>
                    <Route path="dashboard" element={<VendorDashboard />} />
                    <Route path="listings" element={<VendorListings />} />
                    <Route path="listings/new" element={<CreateListing />} />
                    <Route
                      path="*"
                      element={<Navigate to="/vendor/dashboard" replace />}
                    />
                  </Routes>
                </VendorLayout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </VendorApplicationProvider>
  );
}

export default App;
