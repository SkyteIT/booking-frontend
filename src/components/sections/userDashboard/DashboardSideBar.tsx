import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Avatar, Card, Typography, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { resolveAssetUrl } from "../../../pages/Vendor/Settings/vendorSettings";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const role = String(user?.role ?? "").toLowerCase();
  const isVendor = role === "vendor";
  const isAdmin = role === "admin" || role === "superadmin";

  // BASE MENU
  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/customer/dashboard" },
    { label: "My Bookings", icon: <CalendarMonthIcon fontSize="small" />, path: "/customer/bookings" },
    { label: "My Reviews", icon: <StarIcon fontSize="small" />, path: "/customer/reviews" },
    { label: "Notifications", icon: <NotificationsIcon fontSize="small" />, path: "/customer/notifications" },
    { label: "Settings", icon: <SettingsIcon fontSize="small" />, path: "/customer/settings" },
  ];

  //ADD VENDOR DASHBOARD ONLY IF ROLE = VENDOR
  if (isVendor) {
    menuItems.push({
      label: "Vendor Dashboard",
      icon: <StorefrontIcon fontSize="small" />,
      path: "/vendor/dashboard",
    });
  }

  // ADD ADMIN PORTAL ONLY IF ROLE = ADMIN / SUPERADMIN
  if (isAdmin) {
    menuItems.push({
      label: "Admin Portal",
      icon: <AdminPanelSettingsIcon fontSize="small" />,
      path: "/admin/dashboard",
    });
  }

  return (
    <Card className="sidebar-card" sx={{ overflow: "hidden" }}>
      {/* 🔹 PROFILE - gradient header, matches the theme accent used
          across the rest of the redesigned pages. */}
      <Box
        sx={{
          textAlign: "center",
          pt: 3.5,
          pb: 3,
          px: 2,
          background: "linear-gradient(160deg, #005a8d, #0077b6)",
        }}
      >
        <Avatar
          src={resolveAssetUrl(user?.profileImageUrl as string | undefined) || undefined}
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 1.5,
            border: "3px solid rgba(255,255,255,0.35)",
            bgcolor: "rgba(255,255,255,0.15)",
          }}
        >
          <PersonIcon sx={{ color: "#fff" }} />
        </Avatar>

        <Typography sx={{ fontWeight: 700, color: "#fff" }}>
          {user?.firstName ?? "--"}
        </Typography>

        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
          {user?.email ?? "--"}
        </Typography>
      </Box>

      {/* 🔹 MENU */}
      <Box sx={{ p: 2 }}>
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
                  backgroundColor: "rgba(0,119,182,0.06)",
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
