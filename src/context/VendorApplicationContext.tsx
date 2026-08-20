import {
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import {
  VendorApplicationContext,
  defaultVendorApplicationState,
} from "./VendorApplicationContextObject";

// Types

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


/*Default state

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
}; */




// Create context (only once)

//export const VendorApplicationContext =
  //createContext<VendorContextType | null>(null);


// Provider

export const VendorApplicationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {


  // Load saved application data

  const [data, setData] =
    useState<VendorApplicationData>(() => {

      try {

        const saved =
          localStorage.getItem(
            "vendor_application"
          );


        return saved
          ? JSON.parse(saved)
          : defaultVendorApplicationState;


      } catch {

        return defaultVendorApplicationState;

      }

    });



  // Save whenever data changes

  useEffect(() => {

    localStorage.setItem(
      "vendor_application",
      JSON.stringify(data)
    );

  }, [data]);



  // Reset application

  const resetApplication = () => {

    setData(defaultVendorApplicationState);

    localStorage.removeItem(
      "vendor_application"
    );

  };



  return (

    <VendorApplicationContext.Provider
      value={{
        data,
        setData,
        resetApplication,
      }}
    >

      {children}

    </VendorApplicationContext.Provider>

  );

};