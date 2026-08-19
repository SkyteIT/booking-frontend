import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { isAxiosError } from "axios";
import { type ChangeEvent, useEffect, useState } from "react";
import TwoFactorSettings from "../../components/common/TwoFactorSettings";
import { useAuth } from "../../context/useAuth";
import { getCurrentUser, updateProfile, uploadProfileImage } from "../../services/authService";
import {
  createEmailChangeRequest,
  getMyEmailChangeRequests,
  type EmailChangeRequestDto,
} from "../../services/emailChangeService";
import { changePassword } from "../../services/Vendor/settings";
import { resolveAssetUrl } from "../Vendor/Settings/vendorSettings";

const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return "Something went wrong.";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return (data as { message?: string }).message ?? "Something went wrong.";
  }
  return "Something went wrong.";
};

const SECTIONS = [
  { key: "profile", label: "Profile", icon: PersonOutlineIcon, title: "Profile", subtitle: "Your personal information and photo" },
  { key: "security", label: "Security", icon: LockOutlinedIcon, title: "Security", subtitle: "Password and two-factor authentication" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

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

function ProfileTab() {
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

  if (loading) return null;

  return (
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
  );
}

function SecurityTab() {
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
    <Stack spacing={3}>
      <Box>
        <Typography variant="body2" fontWeight={600} mb={1.5}>
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
        <Typography variant="body2" fontWeight={600} mb={1.5}>
          Two-factor authentication
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Required for Admin/Finance/SuperAdmin accounts — this was already set up when you first
          logged in. Manage it here if you need to reset it.
        </Typography>
        <TwoFactorSettings />
      </Box>
    </Stack>
  );
}

export default function AdminSettingsPage() {
  const [section, setSection] = useState<SectionKey>("profile");
  const active = SECTIONS.find((s) => s.key === section)!;

  return (
    <>
      <Typography variant="h4" fontWeight={600}>
        Settings
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Your own account — profile and security. Platform-wide configuration lives elsewhere, not here.
      </Typography>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "240px 1fr" } }}>
        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", height: "fit-content" }}>
          <CardContent sx={{ p: 1 }}>
            <List disablePadding>
              {SECTIONS.map((s) => {
                const isActive = s.key === section;
                const Icon = s.icon;
                return (
                  <ListItemButton
                    key={s.key}
                    onClick={() => setSection(s.key)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      bgcolor: isActive ? (theme) => alpha(theme.palette.primary.main, 0.08) : "transparent",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: isActive ? "primary.main" : "text.secondary" }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={s.label}
                      primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: isActive ? 600 : 400 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: 3 }}>
            <Box mb={2.5}>
              <Typography variant="h5" fontWeight={500}>
                {active.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {active.subtitle}
              </Typography>
            </Box>
            {section === "profile" ? <ProfileTab /> : <SecurityTab />}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
