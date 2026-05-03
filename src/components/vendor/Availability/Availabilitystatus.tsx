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
      <LegendItem color="primary.main" label="Available" />
      <LegendItem color="grey.500" label="Booked" />
      <LegendItem color="error.main" label="Blocked" />
      <LegendItem color="primary.dark" label="Selected" />
    </Stack>
  );
}