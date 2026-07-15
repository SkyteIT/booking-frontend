import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const ContactInfo = (): JSX.Element => {
  const navigate = useNavigate();
  const { data, setData } = useVendorApplication();

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: data.contactInfo.firstName || "",
    lastName: data.contactInfo.lastName || "",
    email: data.contactInfo.email || "",
    phone: data.contactInfo.phone || "",
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<ContactFormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    return newErrors;
  };

  const handleContinue = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setData((prev) => ({
        ...prev,
        contactInfo: formData,
      }));
      navigate("/vendor/categories");
    }
  };

  return (
    <ApplicationLayout activeStep={1}>
      <Container className="vendor-container">
        <Typography className="vendor-title">Contact Information</Typography>

        <Box className="vendor-form-card">
          <Box className="vendor-form">
            {(Object.keys(formData) as (keyof ContactFormData)[]).map((key) => (
              <Box key={key}>
                <Typography className="field-label">
                  {key.replace(/([A-Z])/g, " $1")}
                </Typography>
                <TextField
                  fullWidth
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  error={!!errors[key]}
                  helperText={errors[key]}
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
