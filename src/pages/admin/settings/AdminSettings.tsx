import { Outlet, NavLink } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const navItems = [
  { key: "profile", label: "Profile" },
  { key: "system", label: "System" },
  { key: "booking", label: "Booking" },
  { key: "notifications", label: "Notifications" },
  { key: "users-vendor", label: "Users & Vendor" },
  { key: "security", label: "Security" },
] as const;

const shellSx = {
  p: { xs: 0, md: 0 },
  borderRadius: 4,
  overflow: "hidden",
  border: "1px solid rgba(15,23,42,0.06)",
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
  bgcolor: "#fff",
};

export default function AdminSettings() {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 180px)",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "260px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Paper sx={{ ...shellSx, p: 1 }}>
          <Stack spacing={0.5}>
            {navItems.map((item) => (
              <Box
                key={item.key}
                component={NavLink}
                to={`/admin/settings/${item.key}`}
                className={({ isActive }) => (isActive ? "active settings-nav-link" : "settings-nav-link")}
                sx={(theme) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 1.1,
                  borderRadius: 2,
                  textDecoration: "none",
                  color: theme.palette.text.secondary,
                  transition: "all 0.2s ease",
                  "&.active": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.text.primary,
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                  },
                })}
              >
                <Box
                  sx={(theme) => ({
                    width: 3,
                    height: 18,
                    borderRadius: 2,
                    bgcolor: "transparent",
                    flexShrink: 0,
                    ".active &": {
                      bgcolor: theme.palette.primary.main,
                    },
                  })}
                />
                <Typography fontWeight={600} fontSize={14}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={{ ...shellSx, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
}
