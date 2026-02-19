import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

type Props = {
  loading?: boolean;
  error?: string | null;
};

export default function RevenueOverviewCard({ loading = false, error = null }: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Revenue Overview
          </Typography>

         
        </Stack>

        {error ? (
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#FDE2E2", color: "#B91C1C" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Failed to load revenue overview
            </Typography>
            <Typography variant="caption">{error}</Typography>
          </Box>
        ) : (
          <Box
            sx={(t) => ({
              height: 260,
              borderRadius: 2,
              border: `1px solid ${t.palette.divider}`,
              bgcolor: t.palette.background.paper,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              px: 3,
              pb: 2,
              opacity: loading ? 0.6 : 1,
            })}
          >
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <Typography key={d} variant="caption" color="text.secondary">
                {d}
              </Typography>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
