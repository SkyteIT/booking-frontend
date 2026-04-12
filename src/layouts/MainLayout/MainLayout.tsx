// src/layouts/MainLayout/MainLayout.tsx
import { Box } from "@mui/material";
import MainNavbar from "../../components/navbars/MainNavbar";
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
      {/* Navbar */}
      <MainNavbar />

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Box>

       <MainFooter />
    </Box>
  );
};

export default MainLayout;
