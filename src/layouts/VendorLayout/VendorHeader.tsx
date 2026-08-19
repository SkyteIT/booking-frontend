// src/layouts/VendorLayout/VendorHeader.tsx
import { Box, Typography, IconButton, Badge, Avatar, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import icon2 from "../../assets/icons/icon2.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { belongsToPortal } from "../../utils/notificationPortals";

export default function VendorHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id ?? null;
  const { notifications } = useNotifications(userId);
  // Same account can also hold customer-context notifications - the bell
  // badge only ever counts this account's vendor-context ones.
  const unreadCount = notifications.filter((n) => !n.isRead && belongsToPortal(n.type, "vendor")).length;
  return (
    <Box
      sx={{
        height: 70,
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        borderBottom: "1px solid #eee",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            width: 42, height: 42, bgcolor: "#fff", borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}
        >
          <Box component="img" src={icon2} alt="logo" sx={{ width: "100%", objectFit: "cover" }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#030c20", lineHeight: 1.1 }}>
            UBE
          </Typography>
          <Typography sx={{ fontSize: "0.55rem", fontWeight: 500, color: "#439096" }}>
            Unified Booking Engine
          </Typography>
        </Box>
      </Box>

      {/* Right actions */}
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#0077B6", "&:hover": { bgcolor: "#005A8D" },
            textTransform: "none", borderRadius: 2, fontSize: 13,
          }}
        >
          List your item
        </Button>

        <IconButton onClick={() => navigate("/vendor/notifications")}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            sx={{ width: 34, height: 34, bgcolor: "#0077B6", fontSize: 13, fontWeight: 700 }}
          >
            VU
          </Avatar>
          <Box>
            <Typography fontSize={13} fontWeight={600}>Vendor User</Typography>
            <Typography fontSize={11} color="text.secondary">Vendor</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
