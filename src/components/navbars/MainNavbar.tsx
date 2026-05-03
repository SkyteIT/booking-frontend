// src/components/navbars/MainNavbar.tsx
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Container,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import icon2 from "../../assets/icons/icon2.png";
import { useAuth } from "../../context/AuthContext";

interface MainNavbarProps {
  isAuthPage?: boolean;
  variant?: "main" | "vendor";
}

const MainNavbar = ({ isAuthPage, variant = "main" }: MainNavbarProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isVendor: isVendorUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(anchorEl);

  const isVendor = variant === "vendor" || isVendorUser;

const colors = {
  appBarBg: "#ffffff",
  border: "#E5E7EB",
  vendorBlue: "#0077B6",
  vendorBlueDark: "#005a8d",
};


  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileClose();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        top: 0,
        zIndex: 50,
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          sx={{
            height: 64,
            px: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left — Logo */}
          <Box
            component={Link}
            to={isVendor ? "/vendor/dashboard" : "/"}
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
                overflow: "hidden", // clips image to fit inside border
              }}
            >
              <Box
                component="img"
                src={icon2}
                alt="logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // fills the entire box
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

          {/* Right — Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isVendor && !isAuthPage && !isAuthenticated && (
              <Button
                component={Link}
                to="/login"
                sx={{
                  backgroundColor: "#ffffff",
                  color: colors.vendorBlue,
                  fontWeight: 600,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  borderRadius: "12px",
                  border: `1.6px solid ${colors.vendorBlue}`,
                  "&:hover": {
                    backgroundColor: "rgba(0, 119, 182, 0.06)",
                    borderColor: colors.vendorBlueDark,
                    color: colors.vendorBlueDark,
                  },
                }}
              >
                Sign in
              </Button>
            )}

            {/* Profile Dropdown */}
            {!isAuthPage && isAuthenticated && (
              <>
                <IconButton
                  onClick={handleProfileClick}

                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    borderRadius: "8px",
                    px: 1,
                    py: 0.75,
                    "&:hover": { backgroundColor: "#F9FAFB" },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#E5E7EB",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: "1rem", color: "#4B5563" }} />
                  </Box>
                  <KeyboardArrowDownIcon
                    sx={{
                      fontSize: "1rem",
                      color: "#6B7280",
                      display: { xs: "none", sm: "block" },
                    }}
                  />
                </IconButton>

                {/* Profile Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={profileMenuOpen}
                  onClose={handleProfileClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      width: 192,
                      mt: 1,
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
                      "& .MuiMenuItem-root": {
                        fontSize: "0.9rem",
                        color: "#374151",
                        px: 2,
                        py: 1,
                        "&:hover": { backgroundColor: "#F9FAFB" },
                      },
                    },
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/customer/dashboard"
                    onClick={handleProfileClose}
                  >
                    Account
                  </MenuItem>
                    <MenuItem
                      component={Link}
                      to={isVendorUser ? "/customer/dashboard" : "/vendor/dashboard"}
                      onClick={handleProfileClose}
                    >
                      {isVendorUser ? "Switch to customer portal" : "Switch to vendor portal"}
                    </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/settings"
                    onClick={handleProfileClose}
                  >
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}

            {/* List Your Property Button */}
            <Button
              onClick={() =>
                navigate(isVendor ? "/vendor/listings/":"/vendor/dashboard")
              }
              sx={{
                backgroundColor: "#ffffff",
                color: isVendor ? colors.vendorBlue : "linear-gradient(to bottom, #0077b6, #005a8d)",
                border: `1.6px solid ${isVendor ? colors.vendorBlue : "#0077B6"}`,
                px: 2,
                py: 1,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isVendor ? colors.vendorBlue : colors.vendorBlueDark,
                  color: "#ffffff",
                  boxShadow: "0px 4px 12px rgba(0,119,182,0.30)",
                },
              }}
            >
              <AddIcon sx={{ fontSize: "1rem" }} />
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                {isVendor ? "Create Listing" : "List your property"}
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                {isVendor ? "Create" : "List"}
              </Box>
            </Button>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainNavbar;
