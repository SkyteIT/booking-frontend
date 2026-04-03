// src/components/navbars/MainNavbar.tsx
import { useState } from "react";
import {
  AppBar,Toolbar,Box,Button,IconButton,Typography,Container,Menu, MenuItem,Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import icon2 from "../../assets/icons/icon2.png";

interface MainNavbarProps {
  isAuthPage?: boolean;
}

const MainNavbar = ({ isAuthPage }: MainNavbarProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
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
            {/* Profile Dropdown */}
            {!isAuthPage && (
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
    to="/dashboard"       // User Dashboard route
    onClick={handleProfileClose}
  >
    Account
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
  onClick={() => navigate("/vendor/businessinfo")}   // ✅ updated path
  sx={{
    backgroundColor: "#ffffff",
    color: "#0077B6",
    border: "1.6px solid #0077B6",
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
      backgroundColor: "#5eb0dc",
      color: "#ffffff",
      boxShadow: "0px 4px 12px rgba(0,119,182,0.30)",
    },
  }}
>
  <AddIcon sx={{ fontSize: "1rem" }} />
  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
    List your property
  </Box>
  <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
    List
  </Box>
</Button>

            {/* Sign Up Link */}
            {isAuthPage ? (
              <Typography
                component={Link}
                to="/register"
                sx={{
                  color: "#374151",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { color: "#2563EB" },
                  transition: "color 0.2s ease",
                }}
              >
                Sign up
              </Typography>
            ) : (
              <Typography
                component={Link}
                to="/Login"
                sx={{
                  color: "#374151",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  display: { xs: "none", sm: "block" },
                  "&:hover": { color: "#2563EB" },
                  transition: "color 0.2s ease",
                }}
              >
                Sign in
              </Typography>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainNavbar;
