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

import SettingsSideNav from "../../../components/vendor/settings/SettingsSideNav";
import ProfileSettingsSection from "../../../components/vendor/settings/ProfileSettingsSection";
import PayoutSettingsSection from "../../../components/vendor/settings/PayoutSettingsSection";
import TeamRolesSection from "../../../components/vendor/settings/TeamRolesSection";
import SecuritySettingsSection from "../../../components/vendor/settings/SecuritySettingsSection";
import LocalizationSettingsSection from "../../../components/vendor/settings/LocalizationSettingsSection";
import NotificationsSection from "../../../components/vendor/settings/NotificationsSection";
import SnackbarAlert from "../../../components/common/SnackbarAlert";

import {
  sectionMetaMap,
} from "../../../components/vendor/settings/settingsConfig";

import { useVendorSettings } from "./useVendorSettings";

export default function Settings() {
  const {
    activeSection,
    setActiveSection,
    profileForm,
    payoutForm,
    securityForm,
    localizationForm,
    payoutSource,
    loading,
    saving,
    snackbar,
    setSnackbar,
    handleProfileChange,
    handlePayoutChange,
    handleSecurityChange,
    handleLocalizationChange,
    handleProfileImageUpload,
    handleSave,
  } = useVendorSettings();

  const sectionMeta = sectionMetaMap[activeSection];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account and preferences
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "260px 1fr" } }}>
        <Box sx={{ position: { md: "sticky" }, top: 100 }}>
          <SettingsSideNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </Box>

        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: (t) => `0 8px 20px ${alpha(t.palette.common.black, 0.06)}`,
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

              {activeSection === "profile" && (
                <ProfileSettingsSection
                  form={profileForm}
                  onFieldChange={handleProfileChange}
                  onUploadPhoto={handleProfileImageUpload}
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
        onClose={() => setSnackbar((prev: any) => ({ ...prev, open: false }))}
      />
    </Stack>
  );
}
