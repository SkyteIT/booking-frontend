// src/layouts/MainLayout/MainLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import MainFooter from "../../components/footer/MainFooter";
import CustomerNavbar from "../../components/navbars/CustomerNavbar";
import { useAuth } from "../../context/useAuth";

const MainLayout = () => {
  const { loading } = useAuth();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Dynamic Navbar */}
      <CustomerNavbar />

      {loading && <LoadingSpinner />}

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: "100px",
        }}
      >
        <Outlet />
      </Box>

       <MainFooter />
    </Box>
  );
};

export default MainLayout;
