import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export interface BusinessFormData {
  businessName: string;
  businessType: string;
  taxId: string;
  website: string;
  address: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DocumentsData {
  businessLicense: File | null;
  insuranceCertificate: File | null;
  taxDocument: File | null;
}

export interface VendorApplicationData {
  businessInfo: BusinessFormData;
  contactInfo: ContactFormData;
  categories: string[];
  documents: DocumentsData;
}

export const defaultVendorApplicationState: VendorApplicationData = {
  businessInfo: {
    businessName: "",
    businessType: "",
    taxId: "",
    website: "",
    address: "",
  },
  contactInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  categories: [],
  documents: {
    businessLicense: null,
    insuranceCertificate: null,
    taxDocument: null,
  },
};

export interface VendorContextType {
  data: VendorApplicationData;
  setData: Dispatch<SetStateAction<VendorApplicationData>>;
  resetApplication: () => void;
}

export const VendorApplicationContext = createContext<VendorContextType | null>(null);
