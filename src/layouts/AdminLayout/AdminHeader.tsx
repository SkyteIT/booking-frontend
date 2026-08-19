import { Box, Typography, IconButton, InputBase, Avatar, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import icon2 from "../../assets/icons/icon2.png"; // same logo as MainNavbar

export default function AdminHeader() {
  return (
    <Box
      sx={{
        height: 70,
        bgcolor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        borderBottom: "1px solid #eee",
      }}
    >
      {/* Left Section — Logo + Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Logo */}
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
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Typography */}
        <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <Typography
            sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#030c20" }}
          >
            UBE
          </Typography>
          <Typography
            sx={{ fontSize: "0.55rem", fontWeight: 500, color: "#439096" }}
          >
            Unified Booking Engine
          </Typography>
        </Box>

        {/* Dashboard title */}
        <Typography variant="h6" fontWeight={600} sx={{ ml: 2 }}>
          Admin Panel
        </Typography>
      </Box>

      {/* Right Section */}
      <Box display="flex" alignItems="center" gap={2}>
        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f5f6fa",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            width: 250,
          }}
        >
          <SearchIcon sx={{ fontSize: 20, color: "gray", mr: 1 }} />
          <InputBase placeholder="Search..." fullWidth />
        </Box>

        {/* Notifications */}
        <IconButton>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Profile */}
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src="/assets/images/avatar.png" sx={{ width: 36, height: 36 }} />
          <Box>
            <Typography fontSize={14} fontWeight={600}>
              Super Admin
            </Typography>
            <Typography fontSize={12} color="gray">
              Admin
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}