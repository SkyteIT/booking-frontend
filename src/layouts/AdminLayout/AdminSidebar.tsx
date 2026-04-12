import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BookIcon from '@mui/icons-material/Book';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PaymentIcon from '@mui/icons-material/Payment';
import CategoryIcon from '@mui/icons-material/Category';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

import { useNavigate, useLocation } from "react-router-dom";

// Removed "Logout" from menuItems
const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { label: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
  { label: 'Vendor Management', icon: <StorefrontIcon />, path: '/admin/vendors' },
  { label: 'Booking Oversight', icon: <BookIcon />, path: '/admin/bookings' },
  { label: 'Dispute and Refunds', icon: <ReportProblemIcon />, path: '/admin/disputes' },
  { label: 'Finance and Payment', icon: <PaymentIcon />, path: '/admin/finance' },
  { label: 'Content Management', icon: <CategoryIcon />, path: '/admin/content' },
  { label: 'Reports and Analytics', icon: <BarChartIcon />, path: '/admin/reports' },
  { label: 'Notifications', icon: <NotificationsIcon />, path: '/admin/notifications' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 260,
        height: "calc(100vh - 70px)", // Sidebar below header
        bgcolor: "#fff",
        color: "#4A5565",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      {/* Menu */}
      <Box>
        <List>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: active ? "#0077B6" : "transparent",
                  
                  "&:hover": { bgcolor: "#005A8D" },
                  "&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-primary": {
                    color: "#fff",
                  }
                }}
              >
                <ListItemIcon sx={{minWidth: 36, 
                  color: active ? "#fff" : "#4A5565",
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#fff" : "#4A5565",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom Logout */}
      <Box>
        <ListItemButton
          onClick={() => navigate('/logout')}
          sx={{
            borderRadius: 2,
            "&:hover": { bgcolor: "#005A8D" },
            "&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-primary": {
              color: "#fff",
            }
          }}
        >
          <ListItemIcon sx={{ color: "#ea1717b3", minWidth: 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ color: "#ea1717b3" }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}