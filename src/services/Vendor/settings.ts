import api from "../api";
import type { AxiosError } from "axios";

/* ==============================
   TYPES
============================== */

export type VendorProfileDto = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  businessName?: string;
  bio?: string;
  businessDescription?: string;
  profileImageUrl?: string;
};

export type UpdateVendorProfileDto = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessName: string;
  bio?: string;
};

export type VendorPayoutDto = {
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  routingNumber?: string;
  branch?: string;
};

export type UpdateVendorPayoutDto = {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  branch: string;
  routingNumber?: string;
};

export type VendorLocalizationDto = {
  language?: string;
  timeZone?: string;
  currency?: string;
};

export type UpdateLocalizationDto = {
  language: string;
  timeZone: string;
  currency: string;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/* ==============================
   PROFILE
============================== */

export const getVendorProfile = async (): Promise<VendorProfileDto> => {
  const res = await api.get<VendorProfileDto>("/api/vendor/profile");
  return res.data;
};

export const updateVendorProfile = async (
  payload: UpdateVendorProfileDto
): Promise<VendorProfileDto> => {
  const res = await api.put<VendorProfileDto>(
    "/api/vendor/profile",
    payload
  );
  return res.data;
};

export const uploadVendorProfileImage = async (
  file: File
): Promise<VendorProfileDto> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<VendorProfileDto>(
    "/api/vendor/profile/upload-image",
    formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
  );

  return res.data;
};

/* ==============================
   PAYOUT (with fallback)
============================== */

const PAYOUT_STORAGE_KEY = "vendorPayoutDraft";

const is404 = (error: unknown) =>
  (error as AxiosError)?.response?.status === 404;

export const getVendorPayout = async (): Promise<VendorPayoutDto> => {
  try {
    const res = await api.get<VendorPayoutDto>("/api/vendor/payout");
    return res.data ?? {};
  } catch (error) {
    if (is404(error)) {
      const stored = localStorage.getItem(PAYOUT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    }
    throw error;
  }
};

export const updateVendorPayout = async (
  payload: UpdateVendorPayoutDto
): Promise<VendorPayoutDto> => {
  try {
    const res = await api.put<VendorPayoutDto>(
      "/api/vendor/payout",
      payload
    );
    return res.data ?? payload;
  } catch (error) {
    if (is404(error)) {
      localStorage.setItem(PAYOUT_STORAGE_KEY, JSON.stringify(payload));
      return payload;
    }
    throw error;
  }
};

/* ==============================
   LOCALIZATION
============================== */

export const getLocalizationSettings = async (): Promise<VendorLocalizationDto> => {
  const res = await api.get<VendorLocalizationDto>(
    "/api/settings/localization"
  );
  return res.data;
};

export const updateLocalizationSettings = async (
  payload: UpdateLocalizationDto
): Promise<VendorLocalizationDto> => {
  const res = await api.put<VendorLocalizationDto>(
    "/api/settings/localization",
    payload
  );
  return res.data;
};

/* ==============================
   SECURITY
============================== */

export const changePassword = async (
  payload: ChangePasswordDto
): Promise<void> => {
  await api.put("/api/security/change-password", payload);
};