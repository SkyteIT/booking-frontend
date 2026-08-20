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
    <Box
      className="dashboard-wrapper"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage:
          "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(0,119,182,0.16), transparent 70%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <MainNavbar />

      <Box component="main" sx={{ flex: 1 }}>
        <Box className="dashboard-layout">
          <Box className="dashboard-sidebar">
            <DashboardSideBar />
          </Box>

          <Box className="dashboard-main">
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                mb: 1,
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "baseline",
                gap: "2px",
              }}
            >
              {title}
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "3px",
                  backgroundColor: "primary.main",
                  display: "inline-block",
                  ml: 0.5,
                }}
              />
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
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
