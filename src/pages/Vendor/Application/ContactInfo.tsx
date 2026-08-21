import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import { vendorContactInfoSchema } from "../../../utils/validationSchemas";
import { zodErrorToFieldErrors } from "../../../utils/zodUtils";
import "./application.css";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const FIELD_LABELS: Record<keyof ContactFormData, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
};

const MAX_LENGTHS: Record<keyof ContactFormData, number> = {
  firstName: 100,
  lastName: 100,
  email: 256,
  phone: 20,
};

const ContactInfo = (): JSX.Element => {
  const navigate = useNavigate();
  const { data, setData } = useVendorApplication();

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: data.contactInfo.firstName || "",
    lastName: data.contactInfo.lastName || "",
    email: data.contactInfo.email || "",
    phone: data.contactInfo.phone || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleContinue = () => {
    const result = vendorContactInfoSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodErrorToFieldErrors(result.error));
      return;
    }
    setErrors({});
    setData((prev) => ({
      ...prev,
      contactInfo: formData,
    }));
    navigate("/vendor/categories");
  };

  return (
    <ApplicationLayout activeStep={1}>
      <Container className="vendor-container">
        <Typography className="vendor-title">Contact Information</Typography>

        <Box className="vendor-form-card">
          <Box className="vendor-form">
            {(Object.keys(formData) as (keyof ContactFormData)[]).map((key) => (
              <Box key={key}>
                <Typography className="field-label">{FIELD_LABELS[key]}</Typography>
                <TextField
                  fullWidth
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  error={!!errors[key]}
                  helperText={errors[key]}
                  inputProps={{ maxLength: MAX_LENGTHS[key] }}
                />
              </Box>
            ))}
          </Box>

          <Box className="vendor-actions">
            <Button
              className="back"
              onClick={() => navigate("/vendor/businessinfo")}
            >
              Back
            </Button>
            <Button className="continue" onClick={handleContinue}>
              Continue
            </Button>
          </Box>
        </Box>
      </Container>
    </ApplicationLayout>
  );
};

export default ContactInfo;
