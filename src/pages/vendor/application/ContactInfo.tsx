import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  useEffect(() => {
    const saved = localStorage.getItem("vendorContactInfo");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    localStorage.setItem("vendorContactInfo", JSON.stringify(updated));
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
      navigate("/vendor/categories");
    }
  };

  return (
    <ApplicationLayout activeStep={1}>
      <Container className="vendor-container">
        <Typography className="vendor-title">Contact Information</Typography>

        <Box className="vendor-form-card">
          <Box className="vendor-form">
            {Object.keys(formData).map((key) => (
              <Box key={key}>
                <Typography className="field-label">
                  {key.replace(/([A-Z])/g, " $1")}
                </Typography>
                <TextField
                  fullWidth
                  value={(formData as any)[key]}
                  onChange={(e) =>
                    handleChange(key as keyof ContactFormData, e.target.value)
                  }
                  error={!!errors[key as keyof ContactFormData]}
                  helperText={errors[key as keyof ContactFormData]}
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
