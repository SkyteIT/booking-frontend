import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

interface BusinessFormData {
  businessName: string;
  businessType: string;
  taxId: string;
  website: string;
  address: string;
}

const BusinessInfo = (): JSX.Element => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    businessType: "",
    taxId: "",
    website: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<BusinessFormData>>({});

  // ✅ Restore data
  useEffect(() => {
    const saved = localStorage.getItem("vendorBusinessInfo");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  const handleChange = (field: keyof BusinessFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    localStorage.setItem("vendorBusinessInfo", JSON.stringify(updated));

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<BusinessFormData> = {};
    if (!formData.businessName.trim()) newErrors.businessName = "Required";
    if (!formData.businessType.trim()) newErrors.businessType = "Required";
    if (!formData.taxId.trim()) newErrors.taxId = "Required";
    if (!formData.address.trim()) newErrors.address = "Required";
    return newErrors;
  };

  const handleContinue = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      navigate("/vendor/contactinfo");
    }
  };

  return (
    <ApplicationLayout activeStep={0}>
      <Container className="vendor-container">
        <Typography className="vendor-title">Business Information</Typography>

        <Box className="vendor-form-card">
          <Box className="vendor-form">
            {Object.keys(formData).map((key) => (
              <Box key={key} className={key === "address" ? "full-width" : ""}>
                <Typography className="field-label">
                  {key.replace(/([A-Z])/g, " $1")}
                </Typography>
                <TextField
                  fullWidth
                  value={(formData as any)[key]}
                  onChange={(e) =>
                    handleChange(key as keyof BusinessFormData, e.target.value)
                  }
                  error={!!errors[key as keyof BusinessFormData]}
                  helperText={errors[key as keyof BusinessFormData]}
                />
              </Box>
            ))}
          </Box>

          <Box className="vendor-actions">
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
