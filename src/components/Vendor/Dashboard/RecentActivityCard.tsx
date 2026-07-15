import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ActivityItem } from "./types";

type Props = {
  items: ActivityItem[];
  loading?: boolean;
  error?: string | null;
};

export default function RecentActivityCard({
  items,
  loading = false,
  error = null,
}: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* 🔹 Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <NotificationsNoneOutlinedIcon
            fontSize="small"
            sx={{ color: "text.secondary" }}
          />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Recent activity
          </Typography>
        </Stack>

        {/* 🔹 Error */}
        {error ? (
          <Box
            sx={(t) => ({
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(t.palette.error.main, 0.08),
              border: `1px solid ${alpha(t.palette.error.main, 0.2)}`,
            })}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "error.main" }}
            >
              Failed to load activity
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {error}
            </Typography>
          </Box>
        ) : loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading activity...
          </Typography>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recent activity yet
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {items.map((a, idx) => (
              <Box key={a.id}>
                <Stack direction="row" spacing={1.2} alignItems="flex-start">
                  {/* 🔹 Dot */}
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mt: "6px",
                      flexShrink: 0,
                    }}
                  />

                  {/* 🔹 Content */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                        lineHeight: 1.4,
                      }}
                    >
                      {a.title}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {a.time}
                    </Typography>
                  </Box>
                </Stack>

                {idx !== items.length - 1 && (
                  <Divider sx={{ mt: 1.5, opacity: 0.6 }} />
                )}
              </Box>
            ))}
          </Stack>
        )}

        {/* 🔹 Footer */}
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <MuiLink
            component="button"
            underline="none"
            sx={{
              fontSize: "0.85rem",
              color: "primary.main",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            View all activity
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
}