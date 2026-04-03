import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const menuItems = [
  { path: "/vendor/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/vendor/bookings", label: "Bookings", icon: CalendarMonthIcon },
  { path: "/vendor/listings", label: "Listings", icon: Inventory2Icon },
  { path: "/vendor/availability", label: "Availability", icon: AccessTimeIcon },
  { path: "/vendor/pricing", label: "Pricing & Promotions", icon: LocalOfferIcon },
  { path: "/vendor/reports", label: "Reports", icon: BarChartIcon },
  { path: "/vendor/settings", label: "Settings", icon: SettingsIcon },
  { path: "/vendor/support", label: "Support", icon: SupportAgentIcon },
];

export default function VendorSidebar() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // ==============================
  // 📱 MOBILE VERSION
  // ==============================
  if (isMobile) {
    return (
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          background: "linear-gradient(to right, #0077b6, #005a8d)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <BottomNavigation
          value={location.pathname}
          showLabels
          sx={{ background: "transparent" }}
        >
          {menuItems.slice(0, 5).map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label.split(" ")[0]}
              value={item.path}
              component={NavLink}
              to={item.path}
              icon={<item.icon />}
              sx={{
                color: "rgba(255,255,255,0.7)",
                "&.Mui-selected": {
                  color: "#ffffff",
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    );
  }

  // ==============================
  // 💻 DESKTOP VERSION
  // ==============================
  return (
    <Box
      sx={{
        position: "sticky",
        left: 16,
        top: 96,
        zIndex: 10,
        height: "calc(100vh - 150px)",
        width: 260,
        borderRadius: 3,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        overflowY: "auto",
        background: "linear-gradient(to bottom, #0077b6, #005a8d)",
        p: 2,
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontWeight: 600,
          mb: 2,
          px: 1,
        }}
      >
        Vendor Panel
      </Typography>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Box
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2,
              py: 1.5,
              mb: 1,
              borderRadius: 2,
              textDecoration: "none",
              fontWeight: isActive ? 600 : 400,
              transition: "all 0.2s ease",
              ...(isActive
                ? {
                    backgroundColor: "#ffffff",
                    color: "#0077b6",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                  }
                : {
                    color: "rgba(255,255,255,0.85)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#ffffff",
                    },
                  }),
            }}
          >
            <Icon sx={{ fontSize: 20 }} />

            {item.label}
          </Box>
        );
      })}
    </Box>
  );
}
