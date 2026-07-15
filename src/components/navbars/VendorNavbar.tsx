import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon2 from "../../assets/icons/icon2.png";
import { useAuth } from "../../context/AuthContext";

export default function VendorNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        backdropFilter: "blur(14px)",
        background: "rgba(255,255,255,0.85)",
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
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                backgroundColor: "#ffffff",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={icon2}
                alt="logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#030c20",
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

          {/* 🔹 Right: Profile */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleProfileClick}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Avatar src={user?.profileImageUrl as string | undefined}>
                {user?.firstName?.[0]}
              </Avatar>
              <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
            </IconButton>

           
          </Box>
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
              <MenuItem
                component={Link}
                to="/vendor/dashboard"
                onClick={handleClose}
              >
                Vendor Dashboard
              </MenuItem>

              <MenuItem
                component={Link}
                to="/customer/dashboard"
                onClick={handleClose}
              >
                Customer View
              </MenuItem>

              <MenuItem
                component={Link}
                to="/settings"
                onClick={handleClose}
              >
                Settings
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
      </Container>
    </AppBar>
  );
}