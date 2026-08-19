import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Card, Typography, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isVendor =
    String(user?.role ?? "").toLowerCase() === "vendor";

  // ✅ BASE MENU
  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/customer/dashboard" },
    { label: "My Bookings", icon: <CalendarMonthIcon fontSize="small" />, path: "/customer/bookings" },
    { label: "My Reviews", icon: <StarIcon fontSize="small" />, path: "/customer/reviews" },
    { label: "Notifications", icon: <NotificationsIcon fontSize="small" />, path: "/customer/notifications" },
    { label: "Settings", icon: <SettingsIcon fontSize="small" />, path: "/customer/settings" },
  ];

  // ✅ ADD VENDOR ONLY IF ROLE = VENDOR
  if (isVendor) {
    menuItems.push({
      label: "Vendor Dashboard",
      icon: <StorefrontIcon fontSize="small" />,
      path: "/vendor/dashboard",
    });
  }

  return (
    <Card className="sidebar-card" sx={{ p: 3 }}>
      {/* 🔹 PROFILE */}
      <Box textAlign="center">
        <Box className="user-avatar">
          <PersonIcon />
        </Box>

        <Typography fontWeight={600}>
          {user?.firstName ?? "--"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {user?.email ?? "--"}
        </Typography>
      </Box>

      {/* 🔹 MENU */}
      <Box mt={3}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Box
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`sidebar-menu-item ${isActive ? "active" : ""}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: 1.2,
                px: 1,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {item.icon}
              </Box>
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};

export default DashboardSidebar;
