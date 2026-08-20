
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import {
  Box,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const menuItems = [
  { path: "/vendor/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/vendor/bookings", label: "Bookings", icon: CalendarMonthIcon },
  { path: "/vendor/listings", label: "Listings", icon: Inventory2Icon },
  { path: "/vendor/availability", label: "Availability", icon: AccessTimeIcon },
  { path: "/vendor/reviews", label: "Reviews", icon: StarIcon },
  { path: "/vendor/payouts", label: "Earnings", icon: AccountBalanceWalletIcon },
  { path: "/vendor/pricing", label: "Pricing & Promotions", icon: LocalOfferIcon },
  { path: "/vendor/notifications", label: "Notifications", icon: NotificationsIcon },
  { path: "/vendor/settings", label: "Settings", icon: SettingsIcon },
  { path: "/vendor/support", label: "Support", icon: SupportAgentIcon },
];

const mobileMenuItems = [...menuItems.slice(0, 5), menuItems[7]];

export default function VendorSidebar() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

// MOBILE VERSION

  if (isMobile) {
    return (
      <Paper
        elevation={6} //
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          background: "linear-gradient(to right, #0077b6, #005a8d)",
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <BottomNavigation
          value={location.pathname}
          showLabels
          sx={{ background: "transparent" }}
        >
          {mobileMenuItems.map((item) => (
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

  //DESKTOP VERSION

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
        boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        background: "linear-gradient(to bottom, #0077b6, #005a8d)",
        p: 1.5,
      }}
    >

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
          gap: 1.5,
          px: 2,
          py: 1.2,
          mb: 0.6,
          borderRadius: 2,
          textDecoration: "none",
          fontSize: "0.9rem",
          fontWeight: isActive ? 600 : 400,
          transition: "all 0.2s ease",

          ...(isActive
                ? {
                    backgroundColor: "secondary.main",
                    color: "primary.main",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }
                : {
                    color: "rgba(255,255,255,0.85)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.22)", //
                      color: "#ffffff",
                    },
                  }),
            }}
          >
            <Icon sx={{ fontSize: 18 }} />

            {item.label}
          </Box>
        );
      })}
    </Box>
  );
}
