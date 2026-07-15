import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import icon2 from "../../assets/icons/icon2.png";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.75)",

        // softer bottom line
        borderBottom: "1px solid rgba(0,0,0,0.04)",

        boxShadow: "0 6px 20px rgba(15,23,42,0.04)",
        color: "text.primary",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            minHeight: 68,
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 0, sm: 1 },
          }}
        >
          {/* 🔹 LEFT (LOGO + TITLE) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5}}>
            {/* Logo Circle */}
            <Box
                sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                
                }}
            >
                <Box
                component="img"
                src={icon2}
                alt="UBE"
                
                />
            </Box>

            {/* Text */}
             <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "text.secondary",
                  lineHeight: 1.2,
                }}
              >
                UBE
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 500,
                  color: "#439096",
                  lineHeight: 1,
                }}
              >
                Unified Booking Engine
              </Typography>
            </Box>
            </Box>
          {/* 🔹 RIGHT (ACTIONS) */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Notification */}
            <IconButton
              sx={{
                bgcolor: "rgba(0,0,0,0.04)",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.08)",
                },
              }}
            >
              <NotificationsNoneOutlinedIcon fontSize="small" />
            </IconButton>

            {/* Profile */}
            <Box
              onClick={handleProfileClick}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: 999,
                    cursor: "pointer",

                    "&:hover": {
                    bgcolor: "rgba(0,0,0,0.05)",
                    },
                }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.85rem",
                  bgcolor: "primary.main",
                }}
              >
                A
              </Avatar>
            
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: 1 }}
                >
                  Admin
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Super Admin
                </Typography>
              </Box>

              <KeyboardArrowDownOutlinedIcon
                sx={{ fontSize: 18, color: "text.secondary" }}
              />
            </Box>
          </Stack>
        </Toolbar>
        <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  width: 200,
                  mt: 1,
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
                  "& .MuiMenuItem-root": {
                    fontSize: "0.9rem",
                    px: 2,
                    py: 1,
                  },
                },
              }}
            >
              <MenuItem component={RouterLink} to="/customer/dashboard" onClick={handleClose}>
                Customer View
              </MenuItem>

              <MenuItem component={RouterLink} to="/admin/settings" onClick={handleClose}>
                Settings
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
      </Container>
    </AppBar>
  );
}