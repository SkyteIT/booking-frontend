import { useEffect, useState } from "react";
import { Card, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

// ✅ Define correct user type
type User = {
  name: string;
  email: string;
};

const DashboardSidebar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        setUser(data);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Card className="sidebar-card" sx={{ p: 3 }}>

      <Box textAlign="center">
        <Box className="user-avatar">
          <PersonIcon />
        </Box>

        <Typography fontWeight={600}>
          {user?.name || "--"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {user?.email || "--"}
        </Typography>
      </Box>

      <Box mt={3}>

        <Box className="sidebar-menu-item active">Dashboard</Box>
        <Box className="sidebar-menu-item">My Bookings</Box>
        <Box className="sidebar-menu-item">My Reviews</Box>
        <Box className="sidebar-menu-item">Payment Methods</Box>
        <Box className="sidebar-menu-item">Notifications</Box>
        <Box className="sidebar-menu-item">Settings</Box>

        <Box mt={2} className="sidebar-menu-item">
          Vendor Dashboard
        </Box>

      </Box>

    </Card>
  );
};

export default DashboardSidebar;