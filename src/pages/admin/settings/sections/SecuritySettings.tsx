import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { useState } from "react";
import TwoFactorSettings from "../../../../components/common/TwoFactorSettings";
import { changePassword } from "../../../../services/Vendor/settings";

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return "Something went wrong.";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return (data as { message?: string }).message ?? "Something went wrong.";
  }
  return "Something went wrong.";
};

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Security
        </Typography>
        <Typography color="text.secondary">
          Protect your account and privileged access.
        </Typography>
      </Box>

      <Paper sx={cardSx}>
        <Stack spacing={3}>
          <Box>
            <Typography fontWeight={700} mb={1.5}>
              Change password
            </Typography>
            <Stack spacing={1.5} maxWidth={480}>
              <TextField
                label="Current password"
                type="password"
                size="small"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                label="New password"
                type="password"
                size="small"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirm new password"
                type="password"
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword.length > 0 && confirmPassword !== newPassword}
                helperText={confirmPassword.length > 0 && confirmPassword !== newPassword ? "Passwords don't match" : " "}
              />
              {error && <Alert severity="error">{error}</Alert>}
              {saved && (
                <Alert severity="success" onClose={() => setSaved(false)}>
                  Password updated.
                </Alert>
              )}
              <Button
                variant="contained"
                disabled={saving || !currentPassword || !newPassword || newPassword !== confirmPassword}
                onClick={handleChangePassword}
                sx={{ alignSelf: "flex-start" }}
              >
                {saving ? "Saving..." : "Update password"}
              </Button>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography fontWeight={700} mb={1.5}>
              Two-factor authentication
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Required for Admin/Finance/SuperAdmin accounts - this was already
              set up when you first logged in. Manage it here if you need to
              reset it.
            </Typography>
            <TwoFactorSettings />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
