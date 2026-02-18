// src/layouts/MainLayout/MainLayout.tsx
import { Box } from "@mui/material";
import MainNavbar from "../../components/navbars/MainNavbar";
import MainFooter from "../../components/footer/MainFooter";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
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
        {children}
      </Box>

      {/* Footer */}
      <MainFooter />
    </Box>
  );
};

export default MainLayout;
