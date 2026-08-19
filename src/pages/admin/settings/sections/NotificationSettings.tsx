import { useState } from "react";
import { Box, Button, FormControlLabel, Paper, Stack, Switch, Typography } from "@mui/material";

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

export default function NotificationSettings() {
  const [form, setForm] = useState({
    newBookings: true,
    vendorApplications: true,
    criticalAlerts: true,
    weeklyDigest: false,
    email: true,
    sms: false,
  });

  const set = (field: keyof typeof form, value: boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Notifications
        </Typography>
        <Typography color="text.secondary">
          Choose what the admin team sees and how it is delivered.
        </Typography>
      </Box>

      <Paper sx={cardSx}>
        <Stack spacing={1.25}>
          <FormControlLabel
            control={<Switch checked={form.newBookings} onChange={(e) => set("newBookings", e.target.checked)} />}
            label="New booking notifications"
          />
          <FormControlLabel
            control={<Switch checked={form.vendorApplications} onChange={(e) => set("vendorApplications", e.target.checked)} />}
            label="Vendor application notifications"
          />
          <FormControlLabel
            control={<Switch checked={form.criticalAlerts} onChange={(e) => set("criticalAlerts", e.target.checked)} />}
            label="Critical system alerts"
          />
          <FormControlLabel
            control={<Switch checked={form.weeklyDigest} onChange={(e) => set("weeklyDigest", e.target.checked)} />}
            label="Weekly digest"
          />
          <FormControlLabel
            control={<Switch checked={form.email} onChange={(e) => set("email", e.target.checked)} />}
            label="Email notifications"
          />
          <FormControlLabel
            control={<Switch checked={form.sms} onChange={(e) => set("sms", e.target.checked)} />}
            label="SMS notifications"
          />

          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
            <Button size="small" variant="contained" sx={{ textTransform: "none", px: 1.5, py: 0.75, fontSize: 12 }}>
              Save Notifications
            </Button>
            <Button size="small" variant="outlined" sx={{ textTransform: "none", px: 1.5, py: 0.75, fontSize: 12 }}>
              Reset
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
