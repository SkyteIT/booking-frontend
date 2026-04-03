// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import VendorLayout from "./layouts/VendorLayout/VendorLayout";
import LandingPage from "./pages/public/LandingPage";
import SearchResultsPage from "./pages/public/search/SearchResultsPage";
import ViewProduct from "./pages/public/ViewProduct/ViewProduct";
import CreateListing from "./pages/vendor/CreateListing/CreateListing";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorListings from "./pages/vendor/Listings/VendorListings";

function App() {
  return (
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

        {/* Vendor Routes */}
        <Route
          path="/vendor/*"
          element={
            <VendorLayout>
              <Routes>
                <Route path="/dashboard" element={<VendorDashboard />} />
                <Route path="/listings" element={<VendorListings />} />
                <Route path="/listings/new" element={<CreateListing />} />
                <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
              </Routes>
            </VendorLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
