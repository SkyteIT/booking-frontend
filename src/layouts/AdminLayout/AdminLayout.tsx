// src/layouts/AdminLayout/AdminLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import MainFooter from "../../components/footer/MainFooter";

export default function AdminLayout() {
  const headerHeight = 70; // same as AdminHeader height

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {/* Header - full width */}
      <AdminHeader />

      {/* Main content area: sidebar + page content */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        
        {/* Sidebar with fixed width and height adjusted under header */}
        <Box sx={{ width: 260, height: `calc(100vh - ${headerHeight}px)` }}>
          <AdminSidebar />
        </Box>

        {/* Page content area */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Page content container */}
          <Box sx={{ p: 3, bgcolor: "#f4f6f8", flexGrow: 1, overflowY: "auto" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Footer spans full width */}
      <Box sx={{ width: "100%" }}>
        <MainFooter />
      </Box>
    </Box>
  );
}