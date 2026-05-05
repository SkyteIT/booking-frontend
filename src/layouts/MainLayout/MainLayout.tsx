// src/layouts/MainLayout/MainLayout.tsx
import { Box } from "@mui/material";
import CustomerNavbar from "../../components/navbars/CustomerNavbar";
import MainFooter from "../../components/footer/MainFooter";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
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

      {/* Page Content */}
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

export default MainLayout;