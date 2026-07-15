import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

interface BusinessFormData {
  businessName: string;
  businessType: string;
  taxId: string;
  website: string;
  address: string;
}

interface BusinessErrors {
  businessName?: string;
  businessType?: string;
  taxId?: string;
  website?: string;
  address?: string;
}

const BusinessInfo = (): JSX.Element => {
  const navigate = useNavigate();
  const { data, setData } = useVendorApplication();

  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: data.businessInfo.businessName || "",
    businessType: data.businessInfo.businessType || "",
    taxId: data.businessInfo.taxId || "",
    website: data.businessInfo.website || "",
    address: data.businessInfo.address || "",
  });

  const [errors, setErrors] = useState<BusinessErrors>({});

  // --- BACK BUTTON HANDLER ---
  useEffect(() => {
    // Push fake state to prevent going back
    window.history.pushState(null, "", window.location.href);

    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      navigate("/", { replace: true }); // Always go to landing page
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);
  // --- END BACK BUTTON HANDLER ---

  const handleChange = (field: keyof BusinessFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): BusinessErrors => {
    const newErrors: BusinessErrors = {};

    const name = formData.businessName.trim();
    const type = formData.businessType.trim();
    const taxId = formData.taxId.trim();
    const website = formData.website.trim();
    const address = formData.address.trim();

    if (!name) newErrors.businessName = "Business name is required";
    else if (name.length < 3)
      newErrors.businessName = "Business name must be at least 3 characters";

    if (!type) newErrors.businessType = "Business type is required";
    if (!taxId) newErrors.taxId = "Tax ID / EIN is required";

    if (
      website &&
      !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(website)
    ) {
      newErrors.website = "Enter a valid website URL";
    }

    if (!address) newErrors.address = "Business address is required";
    else if (address.length < 5) newErrors.address = "Address is too short";

    return newErrors;
  };

  // --- CONTINUE ---
  const handleContinue = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Save to context
      setData((prev) => ({
        ...prev,
        businessInfo: formData,
      }));
      navigate("/vendor/contactinfo");
    }
  };

  return (
    <ApplicationLayout activeStep={0}>
      <Container className="vendor-container">
        <Typography className="vendor-title">Business Information</Typography>

        <Box className="vendor-form-card">
          <Box className="vendor-form">
            <Box>
              <Typography className="field-label">Business Name</Typography>
              <TextField
                placeholder="Acme Rentals LLC"
                fullWidth
                variant="outlined"
                value={formData.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                error={!!errors.businessName}
                helperText={errors.businessName}
              />
            </Box>

            <Box>
              <Typography className="field-label">Business Type</Typography>
              <TextField
                placeholder="Travel & Accomdation,Transport,Activities etc."
                fullWidth
                variant="outlined"
                value={formData.businessType}
                onChange={(e) => handleChange("businessType", e.target.value)}
                error={!!errors.businessType}
                helperText={errors.businessType}
              />
            </Box>

            <Box>
              <Typography className="field-label">Tax ID / EIN</Typography>
              <TextField
                placeholder="12-3456789"
                fullWidth
                variant="outlined"
                value={formData.taxId}
                onChange={(e) => handleChange("taxId", e.target.value)}
                error={!!errors.taxId}
                helperText={errors.taxId}
              />
            </Box>

            <Box>
              <Typography className="field-label">
                Business Website (optional)
              </Typography>
              <TextField
                placeholder="https://example.com"
                fullWidth
                variant="outlined"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                error={!!errors.website}
                helperText={errors.website}
              />
            </Box>

            <Box className="full-width">
              <Typography className="field-label">Business Address</Typography>
              <TextField
                placeholder="123 Main St, City, State, ZIP"
                fullWidth
                variant="outlined"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Box>
          </Box>

          {/* BUTTONS */}
          <Box className="vendor-actions">
            <Button className="back">Back</Button>
            <Button className="continue" onClick={handleContinue}>
              Continue
            </Button>
          </Box>
        </Box>
      </Container>
    </ApplicationLayout>
  );
};

export default BusinessInfo;
