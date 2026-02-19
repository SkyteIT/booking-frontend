import { Box, Card, CardContent, Divider, Link as MuiLink, Stack, Typography } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import type { ActivityItem } from "./types";

type Props = {
  items: ActivityItem[];
  loading?: boolean;
  error?: string | null;
};

export default function RecentActivityCard({ items, loading = false, error = null }: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <NotificationsNoneOutlinedIcon fontSize="small"  />
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Recent Activity
          </Typography>
        </Stack>

        {error ? (
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#FDE2E2", color: "#B91C1C" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Failed to load activity
            </Typography>
            <Typography variant="caption">{error}</Typography>
          </Box>
        ) : loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading activity...
          </Typography>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recent activity yet.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {items.map((a, idx) => (
              <Box key={a.id}>
                <Stack direction="row" spacing={1.2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#0077b6",
                      mt: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.time}
                    </Typography>
                  </Box>
                </Stack>

                {idx !== items.length - 1 ? <Divider sx={{ mt: 1.5 }} /> : null}
              </Box>
            ))}
          </Stack>
        )}

        <Box sx={{ mt: 2, textAlign: "right" }}>
          <MuiLink component="button" underline="none" sx={{ fontSize: "0.85rem" }}>
            View all activity
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
}
