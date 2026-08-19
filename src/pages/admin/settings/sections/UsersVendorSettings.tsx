import { useState } from "react";
import { Box, Button, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

export default function UsersVendorSettings() {
  const [form, setForm] = useState({
    vendorApprovalRequired: true,
    userSelfRegistration: true,
    vendorCanEditListings: true,
    roleChangeApproval: true,
    vendorOnboardingNote: "Provide legal and payment details before publishing.",
  });

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Users & Vendor
        </Typography>
        <Typography color="text.secondary">
          Control onboarding and approval flows for users and vendors.
        </Typography>
      </Box>

      <Paper sx={cardSx}>
        <Stack spacing={1.25}>
          <FormControlLabel
            control={<Switch checked={form.userSelfRegistration} onChange={(e) => set("userSelfRegistration", e.target.checked)} />}
            label="Allow user self registration"
          />
          <FormControlLabel
            control={<Switch checked={form.vendorApprovalRequired} onChange={(e) => set("vendorApprovalRequired", e.target.checked)} />}
            label="Require vendor approval"
          />
          <FormControlLabel
            control={<Switch checked={form.vendorCanEditListings} onChange={(e) => set("vendorCanEditListings", e.target.checked)} />}
            label="Vendor can edit listings"
          />
          <FormControlLabel
            control={<Switch checked={form.roleChangeApproval} onChange={(e) => set("roleChangeApproval", e.target.checked)} />}
            label="Require approval for role changes"
          />

          <TextField
            label="Vendor onboarding note"
            fullWidth
            multiline
            rows={3}
            value={form.vendorOnboardingNote}
            onChange={(e) => set("vendorOnboardingNote", e.target.value)}
          />

          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
            <Button size="small" variant="contained" sx={{ textTransform: "none", px: 1.5, py: 0.75, fontSize: 12 }}>
              Save Access Rules
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
