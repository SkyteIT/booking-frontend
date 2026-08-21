import { z } from "zod";

//  Email validation
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(100, "Email is too long");

// Password validation (min 8, uppercase, lowercase, number, special char)
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password is too long")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/\d/, "Password must contain a number")
  .regex(/[\W_]/, "Password must contain a special character");

//  Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(50, "Password is too long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long")
    .regex(/^[a-zA-Z\s\-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .regex(/\s/, "Please enter both first and last name"),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

//  Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
// Reset Password Schema
export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
// Contact Info Schema (optional for vendor forms)
export const contactInfoSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^(0\d{9}|\+94\d{9})$/, "Phone must be 10 digits starting with 0, or start with +94"),
  address: z.string().min(1, "Address is required").min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required").regex(/^[\d-]+$/, "Enter a valid zip code"),
  country: z.string().min(1, "Country is required"),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

// 🔹 Vendor Profile Settings Schema
export const profileSettingsSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  email: emailSchema,
  phone: z.string().min(1, "Phone is required").regex(/^(0\d{9}|\+94\d{9})$/, "Phone must be 10 digits starting with 0, or start with +94"),
  businessName: z.string().min(1, "Business name is required").min(3, "Business name must be at least 3 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),
});

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

//  Vendor Payout Settings Schema
export const payoutSettingsSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountHolderName: z.string().min(1, "Account holder name is required").min(3, "Name must be at least 3 characters"),
  accountNumber: z.string().min(1, "Account number is required").regex(/^\d+$/, "Account number must contain only digits"),
  branch: z.string().min(1, "Branch is required"),
});

export type PayoutSettingsFormData = z.infer<typeof payoutSettingsSchema>;

//  Vendor Security Settings Schema
export const securitySettingsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>;

//  Vendor Localization Settings Schema
export const localizationSettingsSchema = z.object({
  language: z.string().min(1, "Language is required"),
  timeZone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(1, "Currency is required"),
});

export type LocalizationSettingsFormData = z.infer<typeof localizationSettingsSchema>;

//  Availability Block/Unblock Schema
export const availabilitySchema = z.object({
  dates: z.array(z.string()).min(1, "Select at least one date"),
  reason: z.string().optional(),
});

export type AvailabilityFormData = z.infer<typeof availabilitySchema>;

//  Checkout Schema (Cart -> Checkout contact + billing address form)
export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  email: emailSchema,
  phone: z.string().min(1, "Phone is required").regex(/^(0\d{9}|\+94\d{9})$/, "Phone must be 10 digits starting with 0, or start with +94"),
  address: z.string().min(1, "Address is required").min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required").regex(/^[\d-]+$/, "Enter a valid ZIP code"),
  country: z.string().min(1, "Country is required"),
  specialRequests: z.string().optional(),
  agreeToTerms: z.boolean().refine((v) => v === true, { message: "You must agree to the terms" }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

//  Payment Schema (Cart -> Payment card form - the payment gateway itself
//  is still mocked, see PaymentPage.tsx, but the form is real UI a user
//  can mistype into, so it gets real validation).
export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .refine((v) => v.replace(/\s/g, "").length >= 13, "Invalid card number"),
  cardName: z.string().min(1, "Cardholder name is required"),
  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2]) \/ \d{2}$/, "Enter a valid expiry date (MM / YY)"),
  cvv: z.string().regex(/^\d{3}$/, "CVV must be 3 digits"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

//  Vendor Application - Business Info step
export const vendorBusinessInfoSchema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .min(3, "Business name must be at least 3 characters")
    .max(200, "Business name is too long"),

  businessType: z
    .string()
    .min(1, "Business type is required")
    .max(200, "Business type is too long"),

  taxId: z
    .string()
    .trim()
    .max(100, "Tax ID is too long")
    .refine(
      (value) => value === "" || /^[A-Za-z0-9-]{4,100}$/.test(value),
      "Tax ID must be 4-100 alphanumeric characters"
    )
    .optional(),

  website: z
    .string()
    .max(300, "Website URL is too long")
    .optional()
    .or(z.literal(""))
    .refine(
      (value) =>
        !value ||
        /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(value),
      "Enter a valid website URL"
    ),

  address: z
    .string()
    .min(1, "Business address is required")
    .min(5, "Address is too short")
    .max(500, "Address is too long"),
});

export type VendorBusinessInfoFormData = z.infer<typeof vendorBusinessInfoSchema>;

//  Vendor Application - Contact Info step (previously only checked
//  "required", not real email/phone format - a real gap, not a style choice)
export const vendorContactInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name is too long"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name is too long"),
  email: emailSchema,
  phone: z.string().min(1, "Phone is required").regex(/^(0\d{9}|\+94\d{9})$/, "Phone must be 10 digits starting with 0, or start with +94"),
});

export type VendorContactInfoFormData = z.infer<typeof vendorContactInfoSchema>;

//  Booking Filter Schema
export const bookingFilterSchema = z.object({
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  listingId: z.string().optional(),
  searchQuery: z.string().optional(),
});

export type BookingFilterFormData = z.infer<typeof bookingFilterSchema>;
