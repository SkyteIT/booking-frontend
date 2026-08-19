import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import TwoFactorSettings from "../../common/TwoFactorSettings";
import type { SecurityForm } from "./types";

const inputSx = {
  "& .MuiInputLabel-root": {
    color: "text.secondary",
    "&.Mui-focused": { color: "text.primary" },
  },
};

type SecuritySettingsSectionProps = {
  form: SecurityForm;
  onFieldChange: (field: keyof SecurityForm, value: string) => void;
  errors?: Record<string, string>;
};

export default function SecuritySettingsSection({ form, onFieldChange, errors = {} }: SecuritySettingsSectionProps) {
  return (
    <Box>
      <Stack spacing={3}>
        {/* Change Password */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
            Change password
          </Typography>

          <Stack spacing={1.5}>
            <TextField
              label="Current password"
              type="password"
              size="small"
              fullWidth
              margin="dense"
              value={form.currentPassword}
              onChange={(e) => onFieldChange("currentPassword", e.target.value)}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              sx={inputSx}
            />

            <TextField
              label="New password"
              type="password"
              size="small"
              fullWidth
              margin="dense"
              value={form.newPassword}
              onChange={(e) => onFieldChange("newPassword", e.target.value)}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              sx={inputSx}
            />

            <TextField
              label="Confirm password"
              type="password"
              size="small"
              fullWidth
              margin="dense"
              value={form.confirmPassword}
              onChange={(e) => onFieldChange("confirmPassword", e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={inputSx}
            />
          </Stack>
        </Box>

        <Divider />

        {/* 2FA */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
            Two-factor authentication
          </Typography>
          <TwoFactorSettings />
        </Box>
      </Stack>
    </Box>
  );
}
