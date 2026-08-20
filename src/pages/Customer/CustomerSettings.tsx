import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { isAxiosError } from "axios";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import NotificationPreferencesSection, {
  type PreferenceGroup,
} from "../../components/common/NotificationPreferencesSection";
import SegmentedTabs from "../../components/common/SegmentedTabs";
import SelfServiceEmailChangeSection from "../../components/common/SelfServiceEmailChangeSection";
import TwoFactorSettings from "../../components/common/TwoFactorSettings";
import { useAuth } from "../../context/useAuth";
import { getCurrentUser, updateProfile, uploadProfileImage } from "../../services/authService";
import { changePassword } from "../../services/Vendor/settings";
import { resolveAssetUrl } from "../Vendor/Settings/vendorSettings";
import CustomerPageLayout from "./CustomerPageLayout";

// Only customer-facing events that actually exist in the backend enum
// (Ube.Domain.Enums.Notifications.NotificationType) - kept in sync with
// the same list in UserNotifications.tsx's own preferences view.
const CUSTOMER_PREFERENCE_GROUPS: PreferenceGroup[] = [
  {
    label: "Bookings",
    items: [
      { key: "booking_conf", label: "Booking confirmations", notificationType: 2 }, // BookingConfirmation
      { key: "cancellations", label: "Cancellations", notificationType: 3 }, // Cancellation
    ],
  },
  {
    label: "Payments",
    items: [
      { key: "pay_failed", label: "Payment failed", notificationType: 6 }, // PaymentFailed
      { key: "refund", label: "Refund updates", notificationType: 12 }, // RefundPending
    ],
  },
  {
    label: "Reviews",
    items: [
      { key: "review_resp", label: "Review responses", notificationType: 8 }, // ReviewResponse
    ],
  },
  {
    label: "Account",
    items: [
      { key: "security", label: "Security alerts", notificationType: 9 }, // SecurityAlert
      { key: "acc_updates", label: "Account updates", notificationType: 10 }, // AccountUpdate
    ],
  },
];

const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return "Something went wrong.";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return (data as { message?: string }).message ?? "Something went wrong.";
  }
  return "Something went wrong.";
};

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
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), phoneNumber: phoneNumber.trim() || undefined });
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
        <SelfServiceEmailChangeSection currentEmail={email} />
        <TextField label="Phone number" size="small" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        {error && <Alert severity="error">{error}</Alert>}
        {saved && <Alert severity="success" onClose={() => setSaved(false)}>Profile updated.</Alert>}
        <Button
          variant="contained"
          disabled={saving || !firstName.trim() || !lastName.trim()}
          onClick={handleSave}
          sx={{ alignSelf: "flex-start" }}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>
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
          {saved && <Alert severity="success" onClose={() => setSaved(false)}>Password updated.</Alert>}
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
        <TwoFactorSettings />
      </Box>
    </Stack>
  );
}

export default function CustomerSettings() {
  const [tab, setTab] = useState<"profile" | "security" | "notifications">("profile");

  return (
    <CustomerPageLayout title="Settings" subtitle="Update your account settings.">
      <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider", boxShadow: "0 12px 32px rgba(15,27,45,0.06)" }}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <SegmentedTabs
            options={["profile", "security", "notifications"] as const}
            labels={{ profile: "Profile", security: "Security", notifications: "Notifications" }}
            value={tab}
            onChange={setTab}
          />
        </Box>
        <CardContent sx={{ p: 3 }}>
          {tab === "profile" && <ProfileTab />}
          {tab === "security" && <SecurityTab />}
          {tab === "notifications" && <NotificationPreferencesSection groups={CUSTOMER_PREFERENCE_GROUPS} />}
        </CardContent>
      </Card>
    </CustomerPageLayout>
  );
}
