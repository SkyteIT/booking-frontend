import { useState } from "react";
import { Box, Button, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

export default function SecuritySettings() {
  const [form, setForm] = useState({
    require2FA: true,
    sessionTimeout: "30",
    passwordRotation: true,
    loginAlerts: true,
    apiAccessEnabled: false,
  });

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Security
        </Typography>
        <Typography color="text.secondary">
          Protect privileged access, sessions, and login activity.
        </Typography>
      </Box>

      <Paper sx={cardSx}>
        <Stack spacing={1.25}>
          <TextField
            label="Session Timeout (minutes)"
            type="number"
            value={form.sessionTimeout}
            onChange={(e) => set("sessionTimeout", e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={form.require2FA} onChange={(e) => set("require2FA", e.target.checked)} />}
            label="Require 2FA"
          />
          <FormControlLabel
            control={<Switch checked={form.passwordRotation} onChange={(e) => set("passwordRotation", e.target.checked)} />}
            label="Password rotation reminders"
          />
          <FormControlLabel
            control={<Switch checked={form.loginAlerts} onChange={(e) => set("loginAlerts", e.target.checked)} />}
            label="Login alerts"
          />
          <FormControlLabel
            control={<Switch checked={form.apiAccessEnabled} onChange={(e) => set("apiAccessEnabled", e.target.checked)} />}
            label="API access for integrations"
          />

          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
            <Button size="small" variant="contained" sx={{ textTransform: "none", px: 1.5, py: 0.75, fontSize: 12 }}>
              Save Security
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
