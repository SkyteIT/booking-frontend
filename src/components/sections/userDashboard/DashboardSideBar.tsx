import React, { useState, useEffect } from "react";
import { Card, Typography, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";

const DashboardSidebar = () => {
  const [userName, setUserName] = useState<string>("User");

  const navigate = useNavigate();
  const location = useLocation(); //  to detect active route

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardIcon fontSize="small" />,
      path: "/dashboard",
    },
    {
      label: "My Bookings",
      icon: <CalendarMonthIcon fontSize="small" />,
      path: "",
    },
    {
      label: "My Reviews",
      icon: <StarIcon fontSize="small" />,
      path: "",
    },
    {
      label: "Payment Methods",
      icon: <CreditCardIcon fontSize="small" />,
      path: "",
    },
    {
      label: "Notifications",
      icon: <NotificationsIcon fontSize="small" />,
      path: "",
    },
    {
      label: "Settings",
      icon: <SettingsIcon fontSize="small" />,
      path: "",
    },
    {
      label: "Vendor Dashboard",
      icon: <StorefrontIcon fontSize="small" />,
      path: "/vendor/VendorDashboard",
    },
  ];

  return (
    <Card className="sidebar-card" sx={{ p: 3 }}>
      {/* User Info */}
      <Box textAlign="center" mb={3}>
        <Box
          className="user-avatar"
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "#f0f2f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            border: "2px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <PersonIcon sx={{ fontSize: 48, color: "#757575" }} />
        </Box>

        <Typography variant="h6" fontWeight={700} sx={{ color: "#333" }}>
          {userName}
        </Typography>
        <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>
          Member since 2024
        </Typography>
      </Box>

      {/* Menu Items */}
      <Box mt={3}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Box
              key={item.label}
              className={`sidebar-menu-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)} //  navigation here
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: 1.2,
                px: 1,
                borderRadius: 2,
                cursor: "pointer",
                backgroundColor: isActive ? "#e3f2fd" : "transparent",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {item.icon}
              </Box>
              <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};

export default DashboardSidebar;
