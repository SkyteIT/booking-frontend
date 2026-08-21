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
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {/* Dynamic Navbar */}
      <CustomerNavbar />

      {loading && <LoadingSpinner />}

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: "100%",
          backgroundColor: "background.default",
        }}
      >
        <Outlet />
      </Box>

      <MainFooter />
    </Box>
  );
};

export default MainLayout;
