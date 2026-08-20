import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Avatar,
  Menu,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenuItem from "../common/ProfileMenuItem";
import UbeLogo from "../common/UbeLogo";
import { useAuth } from "../../context/useAuth";

export default function VendorNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const shortName = [user?.firstName, user?.lastName?.[0] ? `${user.lastName[0]}.` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
        backdropFilter: "blur(14px)",
        background:
          "radial-gradient(ellipse 60% 220% at 50% 50%, rgba(0,119,182,0.16), transparent 70%), #ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            height: 64,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* 🔹 Left: Logo */}
          <UbeLogo subtitle="Unified Booking Engine" />

          {/* 🔹 Right: Profile */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              onClick={handleProfileClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                borderRadius: 999,
                pl: 0.5,
                pr: 1.25,
                py: 0.5,
                transition: "background-color 0.2s ease",
                "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.06) },
              }}
            >
              <Avatar
                src={user?.profileImageUrl as string | undefined}
                sx={{
                  width: 34,
                  height: 34,
                  background: "linear-gradient(160deg, #005a8d, #0077b6)",
                }}
              >
                {user?.firstName?.[0]}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", lineHeight: 1.1 }}>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "text.primary" }}>
                  {shortName || "Vendor"}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: "primary.main", fontWeight: 500 }}>
                  Vendor
                </Typography>
              </Box>
              <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                list: { sx: { p: 0 } },
                paper: {
                  elevation: 0,
                  sx: {
                    width: 208,
                    mt: 1.5,
                    overflow: "hidden",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: alpha(theme.palette.text.primary, 0.06),
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(20px)",
                    boxShadow: `0 24px 60px ${alpha(theme.palette.text.primary, 0.16)}`,
                  },
                },
              }}
            >
              {/* Profile header */}
              <Box
                sx={{
                  px: 2.25,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  background: `linear-gradient(160deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.05)})`,
                  borderBottom: "1px solid",
                  borderColor: alpha(theme.palette.text.primary, 0.06),
                }}
              >
                <Avatar
                  src={user?.profileImageUrl as string | undefined}
                  sx={{
                    width: 42,
                    height: 42,
                    border: "2px solid #fff",
                    boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, 0.2)}`,
                  }}
                >
                  {user?.firstName?.[0]}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "text.primary",
                    }}
                  >
                    {displayName || "Vendor"}
                  </Typography>
                  <Typography noWrap sx={{ fontSize: "0.76rem", color: "text.secondary" }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 1 }}>
                <ProfileMenuItem
                  icon={<DashboardOutlinedIcon sx={{ fontSize: 16 }} />}
                  label="Vendor Dashboard"
                  accent={theme.palette.primary.main}
                  component={Link}
                  to="/vendor/dashboard"
                  onClick={handleClose}
                />
                <ProfileMenuItem
                  icon={<PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} />}
                  label="Customer View"
                  accent={theme.palette.primary.main}
                  component={Link}
                  to="/customer/dashboard"
                  onClick={handleClose}
                />
                <ProfileMenuItem
                  icon={<SettingsOutlinedIcon sx={{ fontSize: 16 }} />}
                  label="Settings"
                  accent={theme.palette.primary.main}
                  component={Link}
                  to="/vendor/settings"
                  onClick={handleClose}
                />
                <ProfileMenuItem
                  icon={<LogoutOutlinedIcon sx={{ fontSize: 16 }} />}
                  label="Logout"
                  accent={theme.palette.error.main}
                  onClick={handleLogout}
                />
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
