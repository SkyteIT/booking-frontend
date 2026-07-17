// src/components/navbars/VendorSidebar.tsx
import ReportsIcon from "@mui/icons-material/Assessment";
import AvailabilityIcon from "@mui/icons-material/CalendarMonth";
import SupportIcon from "@mui/icons-material/ContactSupport";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookingsIcon from "@mui/icons-material/EventNote";
import ListingsIcon from "@mui/icons-material/ListAlt";
import PricingIcon from "@mui/icons-material/LocalOffer";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/vendor/dashboard" },
    { text: "Bookings", icon: <BookingsIcon />, path: "/vendor/bookings" },
    { text: "Listings", icon: <ListingsIcon />, path: "/vendor/listings" },
    { text: "Availability", icon: <AvailabilityIcon />, path: "/vendor/availability" },
    { text: "Pricing & Promotions", icon: <PricingIcon />, path: "/vendor/pricing" },
    { text: "Reports", icon: <ReportsIcon />, path: "/vendor/reports" },
    { text: "Settings", icon: <SettingsIcon />, path: "/vendor/settings" },
    { text: "Support", icon: <SupportIcon />, path: "/vendor/support" },
];

const VendorSidebar = () => {
    const location = useLocation();

    return (
        <Box
            sx={{
                width: 280,
                height: "calc(100vh - 64px)",
                backgroundColor: "#0F5A8A",
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                position: "sticky",
                top: 64,
            }}
        >
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                    UBE VENDOR
                </Typography>
            </Box>

            <List sx={{ flexGrow: 1, px: 2 }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.text === "Listings" && location.pathname === "/vendor/listings/new");

                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                sx={{
                                    borderRadius: "12px",
                                    backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff", minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: "0.95rem",
                                        fontWeight: isActive ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ p: 2, textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    v1.0.0
                </Typography>
            </Box>
        </Box>
    );
};

export default VendorSidebar;
