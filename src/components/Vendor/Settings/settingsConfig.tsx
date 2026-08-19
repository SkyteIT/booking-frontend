import type {
  SettingSection,
  ProfileForm,
  PayoutForm,
} from "./types";

/* -----------------------------
   Tabs (minimal, no icons)
----------------------------- */

export const settingTabs = [
  { key: "profile", label: "Profile" },
  { key: "payout", label: "Payout" },
  { key: "security", label: "Security" },
  { key: "localization", label: "Localization" },
  { key: "notifications", label: "Notifications" },
] as const;

/* -----------------------------
   Section Meta
----------------------------- */

export const sectionMetaMap: Record<
  SettingSection,
  { title: string; subtitle: string }
> = {
  profile: {
    title: "Profile",
    subtitle: "Personal and business information",
  },
  payout: {
    title: "Payout",
    subtitle: "How you receive payments",
  },
  security: {
    title: "Security",
    subtitle: "Password and account safety",
  },
  localization: {
    title: "Localization",
    subtitle: "Language and region settings",
  },
  notifications: {
    title: "Notifications",
    subtitle: "Alerts and updates",
  },
};

/* -----------------------------
   Default Forms
----------------------------- */

export const defaultProfileForm: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  businessName: "",
  bio: "",
};

export const defaultPayoutForm: PayoutForm = {
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  branch: "",
};