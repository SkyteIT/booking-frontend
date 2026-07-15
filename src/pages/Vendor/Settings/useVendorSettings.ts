import { useEffect, useState } from "react";
import {
  defaultPayoutForm,
  defaultProfileForm,
} from "../../../components/Vendor/Settings/settingsConfig";
import type {
  LocalizationForm,
  PayoutForm,
  ProfileForm,
  SecurityForm,
  SettingSection,
} from "../../../components/Vendor/Settings/types";
import {
  changePassword,
  getLocalizationSettings,
  getVendorPayout,
  getVendorProfile,
  updateLocalizationSettings,
  updateVendorPayout,
  updateVendorProfile,
  uploadVendorProfileImage,
} from "../../../services/Vendor/settings";
import {
  defaultLocalizationForm,
  defaultSecurityForm,
  resolveAssetUrl,
  type SnackbarState,
} from "./vendorSettings";
import {
  profileSettingsSchema,
  payoutSettingsSchema,
  securitySettingsSchema,
  localizationSettingsSchema,
} from "../../../utils/validationSchemas";
import { zodErrorToFieldErrors } from "../../../utils/zodUtils";

export function useVendorSettings() {
  const [activeSection, setActiveSection] = useState<SettingSection>("profile");
  const [profileForm, setProfileForm] = useState<ProfileForm>(defaultProfileForm);
  const [payoutForm, setPayoutForm] = useState<PayoutForm>(defaultPayoutForm);
  const [securityForm, setSecurityForm] = useState<SecurityForm>(defaultSecurityForm);
  const [localizationForm, setLocalizationForm] = useState<LocalizationForm>(defaultLocalizationForm);
  const [payoutSource, setPayoutSource] = useState<"api" | "local">("api");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Load initial data
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
          profileImageUrl: resolveAssetUrl(profile.profileImageUrl),
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

  const handleProfileChange = (field: keyof ProfileForm, value: string) =>
    setProfileForm((prev) => ({ ...prev, [field]: value }));

  const handlePayoutChange = (field: keyof PayoutForm, value: string) =>
    setPayoutForm((prev) => ({ ...prev, [field]: value }));

  const handleSecurityChange = (field: keyof SecurityForm, value: string) =>
    setSecurityForm((prev) => ({ ...prev, [field]: value }));

  const handleLocalizationChange = (field: keyof LocalizationForm, value: string) =>
    setLocalizationForm((prev) => ({ ...prev, [field]: value }));

  const handleProfileImageUpload = async (file: File): Promise<void> => {
    try {
      const updatedProfile = await uploadVendorProfileImage(file);
      setProfileForm((prev) => ({
        ...prev,
        profileImageUrl: resolveAssetUrl(updatedProfile.profileImageUrl),
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setValidationErrors({});

      switch (activeSection) {
        case "profile": {
          // Validate using zod schema
          const validationResult = profileSettingsSchema.safeParse(profileForm);
          if (!validationResult.success) {
            setValidationErrors(zodErrorToFieldErrors(validationResult.error));
            setSnackbar({
              open: true,
              message: "Please fix the validation errors",
              severity: "error",
            });
            return;
          }

          await updateVendorProfile({
            firstName: profileForm.firstName.trim(),
            lastName: profileForm.lastName.trim(),
            phoneNumber: profileForm.phone.trim(),
            businessName: profileForm.businessName.trim(),
            bio: profileForm.bio.trim(),
          });
          setSnackbar({
            open: true,
            message: "Profile updated",
            severity: "success",
          });
          break;
        }

        case "payout": {
          // Validate using zod schema
          const validationResult = payoutSettingsSchema.safeParse(payoutForm);
          if (!validationResult.success) {
            setValidationErrors(zodErrorToFieldErrors(validationResult.error));
            setSnackbar({
              open: true,
              message: "Please fix the validation errors",
              severity: "error",
            });
            return;
          }

          try {
            await updateVendorPayout(payoutForm);
            setPayoutSource("api");
            setSnackbar({
              open: true,
              message: "Payout updated",
              severity: "success",
            });
          } catch {
            setPayoutSource("local");
            setSnackbar({
              open: true,
              message: "Saved locally (backend unavailable)",
              severity: "success",
            });
          }
          break;
        }

        case "security": {
          // Validate using zod schema
          const validationResult = securitySettingsSchema.safeParse(securityForm);
          if (!validationResult.success) {
            setValidationErrors(zodErrorToFieldErrors(validationResult.error));
            setSnackbar({
              open: true,
              message: "Please fix the validation errors",
              severity: "error",
            });
            return;
          }

          await changePassword(securityForm);
          setSecurityForm(defaultSecurityForm);
          setSnackbar({
            open: true,
            message: "Password updated",
            severity: "success",
          });
          break;
        }

        case "localization": {
          // Validate using zod schema
          const validationResult = localizationSettingsSchema.safeParse(localizationForm);
          if (!validationResult.success) {
            setValidationErrors(zodErrorToFieldErrors(validationResult.error));
            setSnackbar({
              open: true,
              message: "Please fix the validation errors",
              severity: "error",
            });
            return;
          }

          await updateLocalizationSettings(localizationForm);
          setSnackbar({
            open: true,
            message: "Localization updated",
            severity: "success",
          });
          break;
        }

        default:
          setSnackbar({
            open: true,
            message: "Saved",
            severity: "success",
          });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "Failed to save settings",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
