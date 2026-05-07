import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

/* =======================
   TYPES
======================= */

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

const defaultState: VendorApplicationData = {
  businessInfo: {
    businessName: "",
    businessType: "",
    taxId: "",
    website: "",
    address: ""
  },
  contactInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  },
  categories: [],
  documents: {
    businessLicense: null,
    insuranceCertificate: null,
    taxDocument: null
  }
};

/* =======================
   CONTEXT TYPE
======================= */

interface VendorContextType {
  data: VendorApplicationData;
  setData: React.Dispatch<
    React.SetStateAction<VendorApplicationData>
  >;
  resetApplication: () => void;
}

/* =======================
   CONTEXT
======================= */

const VendorApplicationContext =
  createContext<VendorContextType | null>(null);

/* =======================
   PROVIDER
======================= */

export const VendorApplicationProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  //Initialize state
  const [data, setData] =
    useState<VendorApplicationData>(() => {
      try {
        //Attempt to load saved data from localStorage
        const saved =
          localStorage.getItem("vendor_application");

        return saved
          ? (JSON.parse(saved) as VendorApplicationData)
          : defaultState;
      } catch {
        return defaultState;
      }
    });

  // Whenever data changes, save it to localStorage
  
  useEffect(() => {
    localStorage.setItem(
      "vendor_application",
      JSON.stringify(data)
    );
  }, [data]);

  /* reset */
  const resetApplication = () => {
    setData(defaultState);
    localStorage.removeItem("vendor_application");
  };

  return (
    <VendorApplicationContext.Provider
      value={{ data, setData, resetApplication }}
    >
      {children}
    </VendorApplicationContext.Provider>
  );
};

/*HOOK*/
//how pages access shared data
export const useVendorApplication = () => {
    const context = useContext(VendorApplicationContext);
  
    if (!context) {
      throw new Error(
        "useVendorApplication must be used inside VendorApplicationProvider"
      );
    }
  
    return context;
  };