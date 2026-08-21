import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import MainFooter from "../../components/footer/MainFooter";
import VendorNavbar from "../../components/navbars/VendorNavbar";
import VendorSidebar from "../../components/Vendor/VendorSidebar";
import { useAuth } from "../../context/useAuth";

export default function VendorLayout() {
  const { loading } = useAuth();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F6F8FB",
        backgroundImage:
          "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(0,119,182,0.22), transparent 70%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loading && <LoadingSpinner />}

      {/*  Navbar */}
      <VendorNavbar />

      {/* Content Area */}
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 3, sm: 5, md: 8, lg: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "260px 1fr" },
            gap: { xs: 2, lg: 4 },
            alignItems: "start",
          }}
        >
          {/* Sidebar (STICKY like your image) */}
          <Box
            sx={{
              position: { lg: "sticky" },
              top: 80, // 
              alignSelf: "start",
            }}
          >
            <VendorSidebar />
          </Box>

          {/* Main Content */}
          <Box sx={{ px : { xs: 2, lg: 2 } }}>
            <Outlet />
          </Box>
        </Box>
      </Container>

      {/* Footer (natural bottom like screenshot) */}
      <MainFooter />
    </Box>
  );
}