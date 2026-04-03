import { Card, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const DashboardSidebar = () => {
  return (
    <Card className="sidebar-card" sx={{ p: 3 }}>

      <Box textAlign="center">
        <Box className="user-avatar">
          <PersonIcon />
        </Box>

        <Typography fontWeight={600}>
          --
        </Typography>

        <Typography variant="body2" color="text.secondary">
          --
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