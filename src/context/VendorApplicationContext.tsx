import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  VendorApplicationContext,
  defaultVendorApplicationState,
} from "./VendorApplicationContextObject";
import type { VendorApplicationData } from "./VendorApplicationContextObject";

export const VendorApplicationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  //Initialize state
  const [data, setData] = useState<VendorApplicationData>(() => {
    try {
      //Attempt to load saved data from localStorage
      const saved = localStorage.getItem("vendor_application");

      return saved
        ? (JSON.parse(saved) as VendorApplicationData)
        : defaultVendorApplicationState;
    } catch {
      return defaultVendorApplicationState;
    }
  });

  // Whenever data changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem("vendor_application", JSON.stringify(data));
  }, [data]);

  /* reset */
  const resetApplication = () => {
    setData(defaultVendorApplicationState);
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
