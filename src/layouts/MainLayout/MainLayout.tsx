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
        flex: 1,
        minHeight: "100%",
        width: "100%",
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
          flexShrink: 0,
          width: "100%",
          backgroundColor: "background.default",
        }}
      >
        <Outlet />
      </Box>

      <Box sx={{ mt: "auto" }}>
        <MainFooter />
      </Box>
    </Box>
  );
};

export default MainLayout;
