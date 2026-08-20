import { useState } from "react";
import { Box, Button, FormControlLabel, MenuItem, Paper, Stack, Switch, TextField, Typography } from "@mui/material";

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

export default function SystemSettings() {
  const [form, setForm] = useState({
    timezone: "Asia/Colombo",
    currency: "LKR",
    dateFormat: "DD/MM/YYYY",
    language: "English",
    maintenanceMode: false,
  });

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          System
        </Typography>
        <Typography color="text.secondary">
          Defaults that affect the whole admin and platform experience.
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
            <TextField select label="Timezone" value={form.timezone} onChange={(e) => set("timezone", e.target.value)} fullWidth>
              <MenuItem value="Asia/Colombo">Asia/Colombo</MenuItem>
              <MenuItem value="Asia/Dubai">Asia/Dubai</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="Europe/London">Europe/London</MenuItem>
            </TextField>
            <TextField select label="Currency" value={form.currency} onChange={(e) => set("currency", e.target.value)} fullWidth>
              <MenuItem value="LKR">LKR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </TextField>
            <TextField label="Date Format" value={form.dateFormat} onChange={(e) => set("dateFormat", e.target.value)} fullWidth />
            <TextField label="Language" value={form.language} onChange={(e) => set("language", e.target.value)} fullWidth />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={form.maintenanceMode}
                onChange={(e) => set("maintenanceMode", e.target.checked)}
              />
            }
            label="Maintenance Mode"
          />

          <Box display="flex" gap={1} flexWrap="wrap">
            <Button size="small" variant="contained" sx={{ textTransform: "none", px: 1.5, py: 0.75, fontSize: 12 }}>
              Save System Settings
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
