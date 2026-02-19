import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import MainFooter from "../../components/footer/MainFooter";
import MainNavbar from "../../components/navbars/MainNavbar";


export default function VendorLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "secondary.main" }}>
      <MainNavbar variant="vendor" />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "260px 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* Sticky gradient sidebar */}
          <VendorSidebar />

          {/* Main page area */}
          <Box sx={{ pb: { xs: 9, lg: 0 } }}>
            <Outlet />
          </Box>
        </Box>
      </Container>

      <MainFooter />
    </Box>
  );
}
