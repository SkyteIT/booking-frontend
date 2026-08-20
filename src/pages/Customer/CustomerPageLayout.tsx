import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import MainFooter from "../../components/footer/MainFooter";
import MainNavbar from "../../components/navbars/CustomerNavbar";
import DashboardSideBar from "../../components/sections/userDashboard/DashboardSideBar";
import "../../components/sections/userDashboard/userDashboard.css";

type CustomerPageLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function CustomerPageLayout({ title, subtitle, children }: CustomerPageLayoutProps) {
  return (
    <Box className="dashboard-wrapper" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <MainNavbar />

      <Box component="main" sx={{ flex: 1 }}>
        <Box className="dashboard-layout">
          <Box className="dashboard-sidebar">
            <DashboardSideBar />
          </Box>

          <Box className="dashboard-main">
            <Typography variant="h4" fontWeight={800} mb={1} sx={{ letterSpacing: "-0.5px", color: "#0F172A" }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" color="#64748B" mb={3} sx={{ fontSize: 14 }}>
                {subtitle}
              </Typography>
            )}
            {children}
          </Box>
        </Box>
      </Box>

      <MainFooter />
    </Box>
  );
}
