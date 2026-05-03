import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
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
};

export default function SecuritySettingsSection({ form, onFieldChange }: SecuritySettingsSectionProps) {
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
        </Box>

          <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
            }}
            >
            <Button
                variant="text"
                sx={{
                textTransform: "none",
                fontWeight: 500,
                }}
            >
                Cancel
            </Button>

            <Button
                variant="contained"
                sx={{
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 2,
                }}
            >
                Save
            </Button>
        </Box>
      </Stack>
    </Box>
  );
}