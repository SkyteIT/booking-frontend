import { useContext } from "react";
import { VendorApplicationContext } from "./VendorApplicationContextObject";

export const useVendorApplication = () => {
  const context = useContext(VendorApplicationContext);

  if (!context) {
    throw new Error(
      "useVendorApplication must be used inside VendorApplicationProvider"
    );
  }

  return context;
};
