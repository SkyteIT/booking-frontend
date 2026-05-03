import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import SettingsSideNav from "../../components/vendor/settings/SettingsSideNav";
import ProfileSettingsSection from "../../components/vendor/settings/ProfileSettingsSection";
import PayoutSettingsSection from "../../components/vendor/settings/PayoutSettingsSection";
import TeamRolesSection from "../../components/vendor/settings/TeamRolesSection";
import SecuritySettingsSection from "../../components/vendor/settings/SecuritySettingsSection";
import LocalizationSettingsSection from "../../components/vendor/settings/LocalizationSettingsSection";
import NotificationsSection from "../../components/vendor/settings/NotificationsSection";
import SnackbarAlert from "../../components/common/SnackbarAlert";

import {
  defaultPayoutForm,
  defaultProfileForm,
  sectionMetaMap,
} from "../../components/vendor/settings/settingsConfig";

import type {
  LocalizationForm,
  PayoutForm,
  ProfileForm,
  SecurityForm,
  SettingSection,
} from "../../components/vendor/settings/types";

import {
  changePassword,
  getLocalizationSettings,
  getVendorPayout,
  getVendorProfile,
  updateLocalizationSettings,
  updateVendorPayout,
  updateVendorProfile,
} from "../../services/Vendor/settings";

const defaultSecurityForm: SecurityForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const defaultLocalizationForm: LocalizationForm = {
  language: "",
  timeZone: "",
  currency: "",
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info";
};

export default function Settings() {
  const [activeSection, setActiveSection] =
    useState<SettingSection>("profile");

  const [profileForm, setProfileForm] =
    useState<ProfileForm>(defaultProfileForm);

  const [payoutForm, setPayoutForm] =
    useState<PayoutForm>(defaultPayoutForm);

  const [securityForm, setSecurityForm] =
    useState<SecurityForm>(defaultSecurityForm);

  const [localizationForm, setLocalizationForm] =
    useState<LocalizationForm>(defaultLocalizationForm);

  const [payoutSource, setPayoutSource] =
    useState<"api" | "local">("api");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const sectionMeta = sectionMetaMap[activeSection];

  // ==============================
  // Load Data
  // ==============================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [profile, localization] = await Promise.all([
          getVendorProfile(),
          getLocalizationSettings(),
        ]);

        setProfileForm({
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          email: profile.email ?? "",
          phone: profile.phoneNumber ?? "",
          businessName: profile.businessName ?? "",
          bio: profile.bio ?? "",
          
        });

        setLocalizationForm({
          language: localization.language ?? "",
          timeZone: localization.timeZone ?? "",
          currency: localization.currency ?? "",
        });

        try {
          const payout = await getVendorPayout();
          setPayoutForm({
            bankName: payout.bankName ?? "",
            accountHolderName: payout.accountHolderName ?? "",
            accountNumber: payout.accountNumber ?? "",
            branch: payout.branch ?? "",
          });
          setPayoutSource("api");
        } catch {
          setPayoutSource("local");
        }
      } catch {
        setSnackbar({
          open: true,
          message: "Failed to load settings",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ==============================
  // Handlers
  // ==============================
  const updateForm =
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (field: keyof T, value: string) =>
      setter((prev) => ({ ...prev, [field]: value }));

  const handleProfileChange = updateForm(setProfileForm);
  const handlePayoutChange = updateForm(setPayoutForm);
  const handleSecurityChange = updateForm(setSecurityForm);
  const handleLocalizationChange = updateForm(setLocalizationForm);

  const showSuccess = (message: string) =>
    setSnackbar({ open: true, message, severity: "success" });

  const showError = (message: string) =>
    setSnackbar({ open: true, message, severity: "error" });

  const handleSave = async () => {
    try {
      setSaving(true);

      switch (activeSection) {
        case "profile":
          await updateVendorProfile({
            firstName: profileForm.firstName,
            lastName: profileForm.lastName,
            phoneNumber: profileForm.phone,
            businessName: profileForm.businessName,
            bio: profileForm.bio,
          });
          showSuccess("Profile updated");
          break;

        case "payout":
          try {
            await updateVendorPayout(payoutForm);
            setPayoutSource("api");
            showSuccess("Payout updated");
          } catch {
            setPayoutSource("local");
            showSuccess("Saved locally (backend unavailable)");
          }
          break;

        case "security":
          await changePassword(securityForm);
          setSecurityForm(defaultSecurityForm);
          showSuccess("Password updated");
          break;

        case "localization":
          await updateLocalizationSettings(localizationForm);
          showSuccess("Localization updated");
          break;

        default:
          showSuccess("Saved");
      }
    } catch {
      showError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account and preferences
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
        }}
      >
        {/* Sidebar */}
        <Box sx={{ position: { md: "sticky" }, top: 100 }}>
          <SettingsSideNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </Box>

        {/* Content */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: (t) =>
              `0 8px 20px ${alpha(t.palette.common.black, 0.06)}`,
          }}
        >
          <CardContent>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  {sectionMeta.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sectionMeta.subtitle}
                </Typography>
              </Box>

              {/* Sections */}
              {activeSection === "profile" && (
                <ProfileSettingsSection
                  form={profileForm}
                  onFieldChange={handleProfileChange}
                />
              )}

              {activeSection === "payout" && (
                <>
                  {payoutSource === "local" && (
                    <Typography color="warning.main">
                      Backend unavailable. Saving locally.
                    </Typography>
                  )}
                  <PayoutSettingsSection
                    form={payoutForm}
                    onFieldChange={handlePayoutChange}
                  />
                </>
              )}

              {activeSection === "security" && (
                <SecuritySettingsSection
                  form={securityForm}
                  onFieldChange={handleSecurityChange}
                />
              )}

              {activeSection === "localization" && (
                <LocalizationSettingsSection
                  form={localizationForm}
                  onFieldChange={handleLocalizationChange}
                />
              )}

              {activeSection === "team" && <TeamRolesSection />}
              {activeSection === "notifications" && <NotificationsSection />}

              <Divider />

              {/* Actions */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={handleSave}
                  disabled={saving || loading}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
      />
    </Stack>
  );
}