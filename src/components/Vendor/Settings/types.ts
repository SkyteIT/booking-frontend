export type SettingSection =
  | "profile"
  | "payout"
  | "team"
  | "security"
  | "localization"
  | "notifications";

export type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  bio: string;
  profileImageUrl?: string;
};

export type PayoutForm = {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  branch: string;
};

export type SecurityForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type LocalizationForm = {
  language: string;
  timeZone: string;
  currency: string;
};
