import { useState } from "react";
import { Box, Button, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

export default function ProfileSettings() {
  const [form, setForm] = useState({
    platformName: "UBE Booking",
    adminName: "Admin User",
    supportEmail: "support@ubebooking.com",
    contactPhone: "+94 77 123 4567",
    publicBranding: true,
  });

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Profile
        </Typography>
        <Typography color="text.secondary">
          Platform identity and admin contact details.
        </Typography>
      </Box>

      <Paper sx={cardSx}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Platform Name"
              value={form.platformName}
              onChange={(e) => set("platformName", e.target.value)}
              fullWidth
            />
            <TextField
              label="Admin Name"
              value={form.adminName}
              onChange={(e) => set("adminName", e.target.value)}
              fullWidth
            />
            <TextField
              label="Support Email"
              value={form.supportEmail}
              onChange={(e) => set("supportEmail", e.target.value)}
              fullWidth
            />
            <TextField
              label="Contact Phone"
              value={form.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              fullWidth
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={form.publicBranding}
                onChange={(e) => set("publicBranding", e.target.checked)}
              />
            }
            label="Show branding on public pages"
          />

          <Box display="flex" gap={1} flexWrap="wrap">
            <Button size="small" variant="contained" sx={{ textTransform: "none", px: 1.5, py: 0.75, fontSize: 12 }}>
              Save Profile
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
