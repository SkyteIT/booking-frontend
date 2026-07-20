// src/layouts/VendorLayout/VendorSidebar.tsx
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard",           icon: <DashboardIcon />,       path: "/vendor" },
  { label: "Bookings",            icon: <CalendarMonthIcon />,   path: "/vendor/bookings" },
  { label: "Listings",            icon: <ListAltIcon />,         path: "/vendor/listings" },
  { label: "Availability",        icon: <EventAvailableIcon />,  path: "/vendor/availability" },
  { label: "Pricing & Promotions",icon: <AttachMoneyIcon />,     path: "/vendor/pricing" },
  { label: "Reports",             icon: <BarChartIcon />,        path: "/vendor/reports" },
  { label: "Settings",            icon: <SettingsIcon />,        path: "/vendor/settings" },
  { label: "Support",             icon: <HelpOutlineIcon />,     path: "/vendor/support" },
];

export default function VendorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 220,
        height: "calc(100vh - 70px)",
        bgcolor: "#0077B6",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 1.5,
      }}
    >
      <List disablePadding>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: active ? "rgba(255,255,255,0.18)" : "transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "#fff" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: "#fff",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <ListItemButton
        onClick={() => navigate("/")}
        sx={{ borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.12)" } }}
      >
        <ListItemIcon sx={{ minWidth: 34, color: "#ffcdd2" }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{ fontSize: 14, color: "#ffcdd2" }}
        />
      </ListItemButton>
    </Box>
  );
}
