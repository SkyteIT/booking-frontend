import DescriptionIcon from "@mui/icons-material/Description";
import { Container, Typography, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

const Documents = (): JSX.Element => {
  const navigate = useNavigate();

  // --- STATE ---
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [insuranceCertificate, setInsuranceCertificate] = useState<File | null>(null);
  const [taxDocument, setTaxDocument] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  // --- BACK BUTTON HANDLER ---
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      navigate("/", { replace: true }); // Always go to landing page
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);
  // --- END BACK BUTTON HANDLER ---

  // --- FILE HANDLER ---
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (error) setError("");
    }
  };

  const handleContinue = () => {
    if (!businessLicense || !insuranceCertificate || !taxDocument) {
      setError("Please upload all required documents");
      return;
    }
    navigate("/vendor/review");
  };

  return (
    <ApplicationLayout activeStep={3}>
      <Container className="vendor-container">
        <Typography className="vendor-title">Required Documents</Typography>

        <Box className="vendor-form-card">
          {/* Hidden Inputs */}
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            style={{ display: "none" }}
            id="businessLicenseInput"
            onChange={(e) => handleFileChange(e, setBusinessLicense)}
          />
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            style={{ display: "none" }}
            id="insuranceInput"
            onChange={(e) => handleFileChange(e, setInsuranceCertificate)}
          />
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            style={{ display: "none" }}
            id="taxInput"
            onChange={(e) => handleFileChange(e, setTaxDocument)}
          />

          {/* Upload Sections */}
          <Box className="documents-section">
            {/* Business License */}
            <Box className="document-item">
              <Typography className="field-label">Business License</Typography>
              <Box
                className="upload-box"
                onClick={() => document.getElementById("businessLicenseInput")?.click()}
              >
                <DescriptionIcon className="upload-icon" />
                <Typography className="upload-text">
                  {businessLicense ? businessLicense.name : "Click to upload or drag and drop"}
                </Typography>
                <Typography className="upload-subtext">
                  PDF, JPG or PNG (Max 5MB)
                </Typography>
              </Box>
            </Box>

            {/* Insurance Certificate */}
            <Box className="document-item">
              <Typography className="field-label">Insurance Certificate</Typography>
              <Box
                className="upload-box"
                onClick={() => document.getElementById("insuranceInput")?.click()}
              >
                <DescriptionIcon className="upload-icon" />
                <Typography className="upload-text">
                  {insuranceCertificate ? insuranceCertificate.name : "Click to upload or drag and drop"}
                </Typography>
                <Typography className="upload-subtext">
                  PDF, JPG or PNG (Max 5MB)
                </Typography>
              </Box>
            </Box>

            {/* Tax Documents */}
            <Box className="document-item">
              <Typography className="field-label">Tax Documents</Typography>
              <Box
                className="upload-box"
                onClick={() => document.getElementById("taxInput")?.click()}
              >
                <DescriptionIcon className="upload-icon" />
                <Typography className="upload-text">
                  {taxDocument ? taxDocument.name : "Click to upload or drag and drop"}
                </Typography>
                <Typography className="upload-subtext">
                  PDF, JPG or PNG (Max 5MB)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Error message */}
          {error && (
            <Typography sx={{ color: "red", mt: 2 }}>
              {error}
            </Typography>
          )}

          {/* Buttons */}
          <Box className="vendor-actions">
            <Button className="back" onClick={() => navigate("/vendor/categories")}>
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

export default Documents;