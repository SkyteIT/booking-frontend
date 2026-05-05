import {
  AppBar,
  Toolbar,
  Box,
  Button,
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
import { useAuth } from "../../context/AuthContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { alpha, useTheme } from "@mui/material/styles";
import icon2 from "../../assets/icons/icon2.png";
import { useLocation } from "react-router-dom";
import CartButton from "../buttons/CartButton";


export default function CustomerNavbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isVendor =
    String(user?.role ?? "").toLowerCase() === "vendor";

  const handleBecomeVendor = () => {
    if (!isAuthenticated) {
      navigate("/login?next=/vendor/businessinfo");
      return;
    }
    navigate("/vendor/businessinfo");
  };
  const isVendorRoute = location.pathname.startsWith("/vendor");
   const handleClose = () => setAnchorEl(null);
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.75)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between" }}>
           {/* Left — Logo */}
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

          {/* 🔹 Right */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            
            {/* 🔸 GUEST */}
            {!isAuthenticated && (
              <>
                <Button component={Link} to="/login"
                  sx={{
                    borderRadius: 999,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    color: "theme.palette.primary.main",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  Sign in
                </Button>
                 <Button
                    onClick={handleBecomeVendor}
                    sx={{
                      borderRadius: 999,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    
                      color: "theme.palette.primary.main",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    Become Vendor
                  </Button>

                <CartButton />
              </>
            )}

            {/* 🔸 AUTH USER */}
            {isAuthenticated && (
              <>
                {/* ✅ ONLY CUSTOMER SEES BUTTON */}
                <CartButton />

                {/* 🔹 Profile */}
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar src={user?.profileImageUrl as string | undefined}>
                    {user?.firstName?.[0]}
                  </Avatar>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                </IconButton>

                {/* 🔹 Dropdown */}
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
                    to="/customer/dashboard"
                    onClick={() => setAnchorEl(null)}
                  >
                    Dashboard
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to="/settings"
                    onClick={() => setAnchorEl(null)}
                  >
                    Settings
                  </MenuItem>

                  <Divider />

                  {/* ONLY VENDOR */}
                  {isVendor && !isVendorRoute && (
                    <MenuItem
                      component={Link}
                      to="/vendor/dashboard"
                      onClick={() => setAnchorEl(null)}
                    >
                      Vendor Portal
                    </MenuItem>
                  )}

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      logout();
                      setAnchorEl(null);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}