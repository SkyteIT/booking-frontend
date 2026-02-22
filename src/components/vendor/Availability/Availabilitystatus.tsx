import { Box, Stack, Typography } from "@mui/material";


function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: color }} />
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
    </Stack>
  );
}

export default function AvailabilityLegend() {
  return (
    <Stack
      direction="row"
      spacing={3}
      alignItems="center"
      sx={{ pb: 2, borderBottom: "1px solid", borderColor: "divider" }}
      flexWrap="wrap"
    >
      <LegendItem color="#0077b6" label="Available" />
      <LegendItem color="#9CA3AF" label="Booked" />
      <LegendItem color="#DC2626" label="Blocked" />
      <LegendItem color="#1D4ED8" label="Selected" />
    </Stack>
  );
}