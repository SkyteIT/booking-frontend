import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import MainFooter from "../../components/footer/MainFooter";
import MainNavbar from "../../components/navbars/MainNavbar";

export default function VendorLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <MainNavbar variant="vendor" />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "260px 1fr" },
            gap: 4, // more breathing space
            alignItems: "start",
          }}
        >
          {/* 🔹 Sticky sidebar */}
          <Box
            sx={{
              position: { lg: "sticky" },
              top: { lg: 80 }, // adjust based on navbar height
              height: "fit-content",
            }}
          >
            <VendorSidebar />
          </Box>

          {/* 🔹 Main content */}
          <Box
            sx={{
              pb: { xs: 10, lg: 0 },
              minHeight: "60vh",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Container>

      <MainFooter />
    </Box>
  );
}