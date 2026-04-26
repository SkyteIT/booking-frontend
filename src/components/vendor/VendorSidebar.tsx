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

  const isActivePath = (path: string) =>
    location.pathname === path || (path === "/vendor/dashboard" && location.pathname === "/vendor");

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

  return (
    <Box
      sx={{
        position: "sticky",
        top: 92,
        alignSelf: "start",
        width: 220,
        minHeight: 535,
        borderRadius: "24px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0d83c3 0%, #0b6ea6 100%)",
        px: 1.75,
        py: 2.25,
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontWeight: 700,
          fontSize: "1rem",
          mb: 2.2,
          px: 1.25,
        }}
      >
        Vendor Panel
      </Typography>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActivePath(item.path);

        return (
          <Box
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.75,
              px: 2,
              py: 1.15,
              mb: 1.05,
              minHeight: 42,
              borderRadius: "18px",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: isActive ? 700 : 500,
              lineHeight: 1.25,
              transition: "all 0.2s ease",
              ...(isActive
                ? {
                    backgroundColor: "#ffffff",
                    color: "#0077b6",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                  }
                : {
                    color: "rgba(255,255,255,0.85)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "#ffffff",
                    },
                  }),
            }}
          >
            <Icon sx={{ fontSize: 19 }} />
            {item.label}
          </Box>
        );
      })}
    </Box>
  );
}
