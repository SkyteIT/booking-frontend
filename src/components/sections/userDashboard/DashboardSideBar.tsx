import { Card, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";

const DashboardSidebar = () => {
  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
    { label: "My Bookings", icon: <CalendarMonthIcon fontSize="small" /> },
    { label: "My Reviews", icon: <StarIcon fontSize="small" /> },
    { label: "Payment Methods", icon: <CreditCardIcon fontSize="small" /> },
    { label: "Notifications", icon: <NotificationsIcon fontSize="small" /> },
    { label: "Settings", icon: <SettingsIcon fontSize="small" /> },
    { label: "Vendor Dashboard", icon: <StorefrontIcon fontSize="small" /> },
  ];

  return (
    <Card className="sidebar-card" sx={{ p: 3 }}>
      <Box textAlign="center">
        <Box className="user-avatar">
          <PersonIcon />
        </Box>

        <Typography fontWeight={600}>--</Typography>

        <Typography variant="body2" color="text.secondary">
          --
        </Typography>
      </Box>

      <Box mt={3}>
        {menuItems.map((item, index) => (
          <Box
            key={item.label}
            className={`sidebar-menu-item ${index === 0 ? "active" : ""}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 1.2,
              px: 1,
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {item.icon}
            </Box>
            <Typography variant="body2">{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default DashboardSidebar;
