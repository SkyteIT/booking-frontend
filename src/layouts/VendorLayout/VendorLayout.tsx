import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import MainFooter from "../../components/footer/MainFooter";
import VendorNavbar from "../../components/navbars/VendorNavbar";

export default function VendorLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      
      {/* 🔹 Navbar */}
      <VendorNavbar />

      {/* 🔹 Content Area */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "260px 1fr" },
            gap: { xs: 2, lg: 4 },
            alignItems: "start",
          }}
        >
          {/* 🔹 Sidebar (STICKY like your image) */}
          <Box
            sx={{
              position: { lg: "sticky" },
              top: 80, // 👈 adjust based on navbar height
              alignSelf: "start",
            }}
          >
            <VendorSidebar />
          </Box>

          {/* 🔹 Main Content */}
          <Box sx={{ px : { xs: 1, lg: 2 } }}>
            <Outlet />
          </Box>
        </Box>
      </Container>

      {/* 🔹 Footer (natural bottom like screenshot) */}
      <MainFooter />
    </Box>
  );
}