
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Box, Typography, Divider, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { NavLink, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: DashboardOutlinedIcon, path: "/admin/dashboard" },
  { label: "User Management", icon: GroupOutlinedIcon, path: "/admin/users" },
  { label: "Vendor Management", icon: StorefrontOutlinedIcon, path: "/admin/vendors" },
  { label: "Booking Oversight", icon: EventNoteOutlinedIcon, path: "/admin/bookings" },
  { label: "Disputes & Refunds", icon: ReceiptLongOutlinedIcon, path: "/admin/disputes" },
  { label: "Finance & Payments", icon: AccountBalanceOutlinedIcon, path: "/admin/finance" },
  { label: "Content Management", icon: ArticleOutlinedIcon, path: "/admin/content" },
  { label: "Reports & Analytics", icon: BarChartOutlinedIcon, path: "/admin/reports" },
  { label: "Notifications", icon: NotificationsNoneOutlinedIcon, path: "/admin/notifications" },
  { label: "Settings", icon: SettingsOutlinedIcon, path: "/admin/settings" },
] as const;

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <Box
      sx={(theme) => ({
        height: "100%",
        borderRadius: 4,
        p: 1.5,

        bgcolor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: "blur(14px)",

        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: "0 8px 25px rgba(15,23,42,0.05)",
      })}
    >
      {/* 🔹 SECTION LABEL */}
      <Typography
        sx={{
          px: 1.25,
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.6px",
          color: "text.secondary",
          mb: 1,
        }}
      >
        NAVIGATION
      </Typography>

      <Stack spacing={0.5}>
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Box
              key={item.label}
              component={NavLink}
              to={item.path}
              end
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1.1,
                borderRadius: 2.5,
                textDecoration: "none",

                transition: "all 0.2s ease",

                ...(isActive
                  ? {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                    }
                  : {
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.action.hover, 0.06),
                        color: theme.palette.primary.main,
                        transform: "translateX(3px)",

                        "& .sidebar-icon": {
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                        },
                      },
                    }),
              })}
            >
              {/* ICON */}
              <Box
                className="sidebar-icon"
                sx={(theme) => ({
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  transition: "all 0.2s ease",

                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.12)
                    : "transparent",

                  color: isActive
                    ? theme.palette.primary.main
                    : alpha(theme.palette.text.primary, 0.6),
                })}
              >
                <Icon sx={{ fontSize: 18 }} />
              </Box>

              {/* LABEL */}
              <Typography
                sx={{
                  fontSize: "0.92rem",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      <Divider sx={{ my: 1.5, opacity: 0.6 }} />

      {/* 🔹 LOGOUT */}
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1.5,
          py: 1.1,
          borderRadius: 2.5,
          color: theme.palette.error.main,
          cursor: "pointer",

          transition: "all 0.2s ease",

          "&:hover": {
            bgcolor: alpha(theme.palette.error.main, 0.08),
            transform: "translateX(3px)",
          },
        })}
      >
        <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
        <Typography sx={{ fontSize: "0.92rem", fontWeight: 700 }}>
          Logout
        </Typography>
      </Box>
    </Box>
  );
}