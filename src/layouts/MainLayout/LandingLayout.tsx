// src/layouts/MainLayout/LandingLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import MainFooter from "../../components/footer/MainFooter";
import CustomerNavbar from "../../components/navbars/CustomerNavbar";
import { useAuth } from "../../context/useAuth";

const LandingLayout = () => {
  const { loading } = useAuth();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* ✅ Dynamic Navbar */}
      <CustomerNavbar />

      {loading && <LoadingSpinner />}

      {/* Page Content - No top padding for landing page */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <MainFooter />
    </Box>
  );
};

export default LandingLayout;
