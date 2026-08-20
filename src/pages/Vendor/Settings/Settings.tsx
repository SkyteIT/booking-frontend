import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
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
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import LocalizationSettingsSection from "../../../components/Vendor/Settings/LocalizationSettingsSection";
import NotificationsSection from "../../../components/Vendor/Settings/NotificationsSection";
import PayoutSettingsSection from "../../../components/Vendor/Settings/PayoutSettingsSection";
import ProfileSettingsSection from "../../../components/Vendor/Settings/ProfileSettingsSection";
import SecuritySettingsSection from "../../../components/Vendor/Settings/SecuritySettingsSection";
import {
  sectionMetaMap,
} from "../../../components/Vendor/Settings/settingsConfig";
import SettingsSideNav from "../../../components/Vendor/Settings/SettingsSideNav";
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
    validationErrors,
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
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
          }}
        >
          Settings
          <Box component="span" sx={{ width: 8, height: 8, borderRadius: "3px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
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
            background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
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
                  errors={validationErrors}
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
                    errors={validationErrors}
                  />
                </>
              )}

              {activeSection === "security" && (
                <SecuritySettingsSection
                  form={securityForm}
                  onFieldChange={handleSecurityChange}
                  errors={validationErrors}
                />
              )}

              {activeSection === "localization" && (
                <LocalizationSettingsSection
                  form={localizationForm}
                  onFieldChange={handleLocalizationChange}
                  errors={validationErrors}
                />
              )}

              {activeSection === "notifications" && <NotificationsSection />}

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={handleSave}
                  disabled={saving || loading}
                  sx={{ borderRadius: "999px" }}
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
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Stack>
  );
}
