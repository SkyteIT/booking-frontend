import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Button, Typography, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import CartButton from "../buttons/CartButton";

const NAV_LINKS = [
  { label: "Explore", to: "/search", dot: "primary.main" },
  { label: "Categories", to: "/search", dot: "success.main" },
];

export default function CustomerNavbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isVendor = String(user?.role ?? "").toLowerCase() === "vendor";
  const displayName = [user?.firstName, user?.lastName?.[0] ? `${user.lastName[0]}.` : ""]
    .filter(Boolean)
    .join(" ");

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
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "calc(100% - 32px)", sm: "calc(100% - 48px)", lg: "calc(100% - 500px)" },
        maxWidth: "none",
        zIndex: (t) => t.zIndex.appBar,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        borderRadius: 999,
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: alpha(theme.palette.text.primary, 0.06),
        boxShadow: scrolled
          ? `0 10px 24px ${alpha(theme.palette.text.primary, 0.06)}`
          : `0 4px 12px ${alpha(theme.palette.text.primary, 0.03)}`,
        transition: "box-shadow 0.25s ease",
      }}
    >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            flexShrink: 0,
            "&:hover .ube-logo-ring": { transform: "rotate(90deg)" },
          }}
        >
          <Box
            className="ube-logo-ring"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: "primary.main",
              display: "grid",
              placeItems: "center",
              position: "relative",
              transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "primary.main" }} />
            <Box
              sx={{
                position: "absolute",
                inset: "-6px",
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.35),
                borderRadius: "50%",
                transform: "rotateX(65deg)",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "0.03em",
            }}
          >
            UBE
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3 }}>
          {NAV_LINKS.map((link) => (
            <Box
              key={link.label}
              component={Link}
              to={link.to}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: "0.88rem",
                fontWeight: 500,
                color: "text.secondary",
                textDecoration: "none",
                transition: "color 0.2s ease",
                "&:hover": { color: "text.primary" },
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: link.dot }} />
              {link.label}
            </Box>
          ))}
        </Box>

        {/* Right */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}>
          {!isAuthenticated && (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{
                  borderRadius: 999,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  color: "primary.main",
                  "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                }}
              >
                Sign in
              </Button>
              <Button
                onClick={handleBecomeVendor}
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  fontWeight: 600,
                  textTransform: "none",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                Become Vendor
              </Button>
              <CartButton />
            </>
          )}

          {isAuthenticated && (
            <>
              <CartButton />

              <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
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
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.firstName?.[0]}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", lineHeight: 1.1 }}>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "text.primary" }}>
                    {displayName || "Account"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: "primary.main", fontWeight: 500 }}>
                    {isVendor ? "Vendor" : "Customer"}
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
                <MenuItem component={Link} to="/customer/dashboard" onClick={() => setAnchorEl(null)}>
                  Dashboard
                </MenuItem>

                <MenuItem component={Link} to="/settings" onClick={() => setAnchorEl(null)}>
                  Settings
                </MenuItem>

                <Divider />

                {isVendor && !isVendorRoute && (
                  <MenuItem component={Link} to="/vendor/dashboard" onClick={() => setAnchorEl(null)}>
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
      </Box>
  );
}
