import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import MainFooter from "../../components/footer/MainFooter";
import AdminNavbar from "../../components/navbars/AdminNavbar";
import { useAuth } from "../../context/useAuth";

export default function AdminLayout() {
  const { loading } = useAuth();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F3F5F9", // softer background
      }}
    >
      <AdminNavbar />

      {loading && <LoadingSpinner />}

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "260px 1fr" },
            gap: { xs: 2.5, lg: 3.5 },
            alignItems: "start",
          }}
        >
          {/* 🔹 Sidebar */}
          <Box
            sx={{
              position: { lg: "sticky" },
              top: 96,
              alignSelf: "start",
            }}
          >
            <AdminSidebar />
          </Box>

          {/* 🔹 Main Content */}
          <Box
            sx={{
              minHeight: "calc(100vh - 160px)",
              borderRadius: 4,

              // 👇 Apple-like surface
              bgcolor: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",

              // 👇 subtle border instead of heavy
              border: "1px solid rgba(0,0,0,0.04)",

              // 👇 soft floating shadow
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)",

              p: { xs: 2.5, md: 3.5 },
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
