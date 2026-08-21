import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Alert, Avatar, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { isAxiosError } from "axios";
import { type ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../../../../context/useAuth";
import { getCurrentUser, updateProfile, uploadProfileImage } from "../../../../services/authService";
import {
  createEmailChangeRequest,
  getMyEmailChangeRequests,
  type EmailChangeRequestDto,
} from "../../../../services/emailChangeService";
import { resolveAssetUrl } from "../../../Vendor/Settings/vendorSettings";

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

// Changing your own email is never self-service, regardless of role - it
// always queues a request that only a SuperAdmin can approve.
function EmailChangeSection({ currentEmail }: { currentEmail: string }) {
  const [pending, setPending] = useState<EmailChangeRequestDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const loadMine = () => {
    setLoading(true);
    getMyEmailChangeRequests()
      .then((requests) => setPending(requests.find((r) => r.status === "Pending") ?? null))
      .catch(() => setPending(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMine();
  }, []);

  const handleSubmit = async () => {
    if (!newEmail.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await createEmailChangeRequest(newEmail.trim(), reason.trim() || undefined);
      setNewEmail("");
      setReason("");
      setRequesting(false);
      setSubmitted(true);
      loadMine();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <TextField label="Email" size="small" fullWidth value={currentEmail} disabled />

      {loading ? null : pending ? (
        <Alert severity="info" sx={{ mt: 1.5 }}>
          Change to <strong>{pending.requestedEmail}</strong> is pending SuperAdmin approval.
        </Alert>
      ) : requesting ? (
        <Stack spacing={1.5} mt={1.5}>
          <TextField
            label="New email address"
            size="small"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <TextField
            label="Reason (optional)"
            size="small"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" disabled={submitting || !newEmail.trim()} onClick={handleSubmit}>
              {submitting ? "Submitting..." : "Submit request"}
            </Button>
            <Button
              variant="text"
              size="small"
              disabled={submitting}
              onClick={() => {
                setRequesting(false);
                setNewEmail("");
                setReason("");
                setError("");
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={1} mt={1}>
          {submitted && (
            <Alert severity="success" onClose={() => setSubmitted(false)}>
              Request submitted.
            </Alert>
          )}
          <Button
            size="small"
            variant="text"
            sx={{ textTransform: "none", fontWeight: 500, alignSelf: "flex-start" }}
            onClick={() => setRequesting(true)}
          >
            Request email change
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default function ProfileSettings() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setFirstName(user.firstName ?? "");
        setLastName(user.lastName ?? "");
        setEmail(user.email ?? "");
        setPhoneNumber(user.phoneNumber ?? "");
        setProfileImageUrl(resolveAssetUrl(user.profileImageUrl));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
      });
      await refreshUser();
      setSaved(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const updated = await uploadProfileImage(file);
      setProfileImageUrl(resolveAssetUrl(updated.profileImageUrl));
      await refreshUser();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Profile
        </Typography>
        <Typography color="text.secondary">
          Your personal information and photo.
        </Typography>
      </Box>

      <Paper sx={cardSx}>
        {loading ? null : (
          <Stack spacing={3} maxWidth={480}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={profileImageUrl || undefined}
                sx={(theme) => ({
                  width: 64,
                  height: 64,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: "primary.main",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                })}
              >
                <PersonOutlineIcon />
              </Avatar>
              <Stack spacing={0.5}>
                <Button
                  size="small"
                  variant="text"
                  startIcon={<CloudUploadOutlinedIcon />}
                  component="label"
                  disabled={uploading}
                  sx={{ textTransform: "none", fontWeight: 500, alignSelf: "flex-start" }}
                >
                  {uploading ? "Uploading..." : "Upload photo"}
                  <input hidden accept="image/*" type="file" onChange={handlePhotoChange} />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  JPG or PNG (max 2MB)
                </Typography>
              </Stack>
            </Box>

            <Stack spacing={2}>
              <TextField label="First name" size="small" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <TextField label="Last name" size="small" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <EmailChangeSection currentEmail={email} />
              <TextField label="Phone number" size="small" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}
            {saved && (
              <Alert severity="success" onClose={() => setSaved(false)}>
                Profile updated.
              </Alert>
            )}
            <Button
              variant="contained"
              disabled={saving || !firstName.trim() || !lastName.trim()}
              onClick={handleSave}
              sx={{ alignSelf: "flex-start" }}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
