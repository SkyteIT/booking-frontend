// src/layouts/VendorLayout/VendorLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import MainFooter from "../../components/footer/MainFooter";

export default function VendorLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <VendorHeader />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box sx={{ width: 220, flexShrink: 0 }}>
          <VendorSidebar />
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 3, bgcolor: "#f4f6f8", flexGrow: 1, overflowY: "auto" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <MainFooter />
      </Box>
    </Box>
  );
}
