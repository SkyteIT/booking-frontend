// src/components/sections/userDashboard/DashboardSideBar.tsx
import { Card, Typography, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface DashboardSidebarProps {
  activePage?: string;
}

const menuItems = [
  { label: "Dashboard",       icon: <DashboardIcon fontSize="small" />,     route: "/user/dashboard"      },
  { label: "My Bookings",     icon: <CalendarMonthIcon fontSize="small" />, route: "/user/bookings"       },
  { label: "My Reviews",      icon: <StarIcon fontSize="small" />,          route: "/user/reviews"        },
  { label: "Payment Methods", icon: <CreditCardIcon fontSize="small" />,    route: "/user/payments"       },
  { label: "Notifications",   icon: <NotificationsIcon fontSize="small" />, route: "/user/notifications"  },
  { label: "Settings",        icon: <SettingsIcon fontSize="small" />,      route: "/user/settings"       },
];

const DashboardSidebar = ({ activePage = "Dashboard" }: DashboardSidebarProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="sidebar-card"
      sx={{
        p: 0,
        overflow: "hidden",
        borderRadius: "16px !important",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07) !important",
        height: "fit-content",
        position: "sticky",
        top: 24,
      }}
    >
      {/* Profile header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)",
          px: 3,
          pt: 3,
          pb: 2.5,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 68,
            height: 68,
            background: "rgba(255,255,255,0.2)",
            border: "3px solid rgba(255,255,255,0.5)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <PersonIcon sx={{ fontSize: 32, color: "#fff" }} />
        </Box>
        <Typography fontWeight={700} color="#fff" fontSize={15} lineHeight={1.2}>
          My Account
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12, mt: 0.5 }}>
          Manage your profile
        </Typography>
      </Box>

      {/* Nav items */}
      <Box sx={{ px: 1.5, py: 1.5 }}>
        {menuItems.map((item, index) => {
          const isActive = item.label === activePage;
          return (
            <Box key={item.label}>
            <Box
              onClick={() => navigate(item.route)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                  py: 1.1,
                px: 1.5,
                  borderRadius: "10px",
                cursor: "pointer",
                  position: "relative",
                  bgcolor: isActive ? "#e3f2fd" : "transparent",
                  color: isActive ? "#1565c0" : "#4a5568",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.15s ease",
                  mb: 0.3,
                  "&:hover": {
                    bgcolor: isActive ? "#e3f2fd" : "#f7faff",
                    color: isActive ? "#1565c0" : "#1976d2",
                  },
              }}
            >
                {isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      height: "60%",
                      width: 3,
                      bgcolor: "#1565c0",
                      borderRadius: "0 3px 3px 0",
                    }}
                  />
                )}
                <Box sx={{ display: "flex", alignItems: "center", color: isActive ? "#1565c0" : "#90a4ae" }}>
                {item.icon}
              </Box>
                <Typography variant="body2" fontWeight={isActive ? 600 : 400} fontSize={13.5} flex={1}>
                {item.label}
              </Typography>
                {isActive && <ChevronRightIcon sx={{ fontSize: 16, color: "#1565c0", opacity: 0.7 }} />}
              </Box>

              {index === menuItems.length - 2 && (
                <Divider sx={{ my: 1, borderColor: "#f0f4f8" }} />
              )}
            </Box>
          );
        })}

        {/* Vendor Dashboard */}
        <Box
          onClick={() => navigate("/vendor/dashboard")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 1.1,
            px: 1.5,
            borderRadius: "10px",
            cursor: "pointer",
            bgcolor: "#fff8e1",
            color: "#e65100",
            mt: 0.3,
            transition: "all 0.15s ease",
            "&:hover": { bgcolor: "#fff3cd" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", color: "#f59e0b" }}>
            <StorefrontIcon fontSize="small" />
          </Box>
          <Typography variant="body2" fontWeight={600} fontSize={13.5} flex={1} color="#e65100">
            Vendor Dashboard
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 16, color: "#e65100", opacity: 0.6 }} />
        </Box>
      </Box>
    </Card>
  );
};

export default DashboardSidebar;
