
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Box, Typography, Divider, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

// roles omitted = admin-only (the default for most of the portal).
// SuperAdmin always sees the full menu regardless of what's listed here -
// filtered out below before that special case even applies.
const menu = [
  { label: "Dashboard", icon: DashboardOutlinedIcon, path: "/admin/dashboard" },
  { label: "User Management", icon: GroupOutlinedIcon, path: "/admin/users" },
  { label: "Role Requests", icon: HowToRegOutlinedIcon, path: "/admin/role-requests", roles: ["superadmin"] },
  { label: "Email Requests", icon: MarkEmailReadOutlinedIcon, path: "/admin/email-requests", roles: ["superadmin"] },
  { label: "Vendor Management", icon: StorefrontOutlinedIcon, path: "/admin/vendors" },
  { label: "Booking Oversight", icon: EventNoteOutlinedIcon, path: "/admin/bookings" },
  { label: "Disputes & Refunds", icon: ReceiptLongOutlinedIcon, path: "/admin/disputes", roles: ["admin", "finance", "superadmin"] },
  { label: "Fraud Review", icon: GppMaybeOutlinedIcon, path: "/admin/fraud-review", roles: ["admin", "finance", "superadmin"] },
  { label: "Finance & Payments", icon: AccountBalanceOutlinedIcon, path: "/admin/finance", roles: ["admin", "finance", "superadmin"] },
  { label: "Content Management", icon: ArticleOutlinedIcon, path: "/admin/content" },
  { label: "Reports & Analytics", icon: BarChartOutlinedIcon, path: "/admin/reports" },
  { label: "Notifications", icon: NotificationsNoneOutlinedIcon, path: "/admin/notifications" },
  { label: "Settings", icon: SettingsOutlinedIcon, path: "/admin/settings", roles: ["admin", "finance", "superadmin"] },
] as const;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const role = String(user?.role ?? "").toLowerCase();
  const visibleMenu = menu.filter((item) => {
    const allowedRoles: readonly string[] = "roles" in item ? item.roles : ["admin"];
    return role === "superadmin" || allowedRoles.includes(role);
  });

  return (
    <Box
      sx={(theme) => ({
        height: "100%",
        borderRadius: 3,
        p: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.96),
        backdropFilter: "blur(18px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
        boxShadow: "0 22px 55px rgba(15,23,42,0.09)",
      })}
    >
      <Stack spacing={0.75}>
        {visibleMenu.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

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
                py: 1.15,
                borderRadius: 3,
                textDecoration: "none",
                transition: "all 0.24s ease",
                border: "1px solid transparent",
                ...(isActive
                  ? {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: theme.palette.primary.main,
                      borderColor: alpha(theme.palette.primary.main, 0.22),
                      boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.16)}`,
                    }
                  : {
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        transform: "translateX(2px)",
                      },
                    }),
              })}
            >
              {/* ICON */}
              <Box
                className="sidebar-icon"
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  transition: "all 0.24s ease",
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.18)
                    : alpha(theme.palette.primary.main, 0.06),
                  color: isActive
                    ? theme.palette.primary.main
                    : alpha(theme.palette.text.primary, 0.72),
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

      <Divider sx={{ my: 2, opacity: 0.35 }} />

      {/* 🔹 LOGOUT */}
      <Box
        onClick={() => {
          logout();
          navigate("/login");
        }}
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1.5,
          py: 1.15,
          borderRadius: 3,
          color: theme.palette.error.main,
          cursor: "pointer",
          transition: "all 0.24s ease",
          bgcolor: alpha(theme.palette.error.main, 0.08),
          '&:hover': {
            bgcolor: alpha(theme.palette.error.main, 0.18),
            transform: "translateX(2px)",
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