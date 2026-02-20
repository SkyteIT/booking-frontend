import { useState } from "react";
import { Outlet } from "react-router-dom";

interface VendorData {
  businessInfo?: any;
  contactInfo?: any;
  documents?: any;
}

function VendorApplication(): JSX.Element {
  const [vendorData, setVendorData] = useState<VendorData>({});

  return (
    <Outlet context={{ vendorData, setVendorData }} />
  );
}

export default VendorApplication;
