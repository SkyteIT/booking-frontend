import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ContactErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const ContactInfo = (): JSX.Element => {
  const navigate = useNavigate();

  // --- STATE WITH LOCALSTORAGE RESTORE ---
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [errors, setErrors] = useState<ContactErrors>({});


  // --- BACK BUTTON HANDLER (GLOBAL) ---
  useEffect(() => {
    const handleBackButton = () => {
      navigate("/", { replace: true });
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [navigate]);
  // --- END BACK BUTTON HANDLER ---

  const handleChange = (field: keyof ContactFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    localStorage.setItem("vendorContactInfo", JSON.stringify(updated)); // save in localStorage
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): ContactErrors => {
    const newErrors: ContactErrors = {};
    const { firstName, lastName, email, phone } = formData;

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      newErrors.email = "Enter a valid email address";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{5,20}$/.test(phone.trim()))
      newErrors.phone = "Enter a valid phone number";

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
            <Box>
              <Typography className="field-label">First Name</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Box>

            <Box>
              <Typography className="field-label">Last Name</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Box>

            <Box>
              <Typography className="field-label">Email</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Box>

            <Box>
              <Typography className="field-label">Phone</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Box>
          </Box>

          <Box className="vendor-actions">
            <Button className="back" onClick={() => navigate("/vendor/businessinfo")}>
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