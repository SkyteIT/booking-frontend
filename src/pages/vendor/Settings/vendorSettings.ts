import type {
  LocalizationForm,
  ProfileForm,
  SecurityForm,
} from "../../../components/vendor/settings/types";


// Types

export type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
};


// Form Defaults

export const defaultSecurityForm: SecurityForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const defaultLocalizationForm: LocalizationForm = {
  language: "",
  timeZone: "",
  currency: "",
};


// Utility Functions

export function resolveAssetUrl(value?: string | null): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  if (!baseUrl) return value;

  return `${baseUrl.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
}

// Validators

export function validateProfileForm(form: ProfileForm): string {
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const phone = form.phone.trim();
  const businessName = form.businessName.trim();

  if (!firstName) return "First name is required";
  if (!lastName) return "Last name is required";
  if (!phone) return "Phone number is required";
  if (!/^\+?[\d\s\-()]{5,20}$/.test(phone)) return "Enter a valid phone number";
  if (!businessName) return "Business name is required";

  return "";
}
// Legacy validators were removed in favor of Zod schemas in
// `src/utils/validationSchemas.ts`. Keep defaults and small helpers here.
