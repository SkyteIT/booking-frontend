import DescriptionIcon from "@mui/icons-material/Description";
import { Container, Typography, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

const Documents = () => {
  const navigate = useNavigate();

  const { data, setData } = useVendorApplication();
  const { businessLicense, insuranceCertificate, taxDocument } = data.documents;

  const [error, setError] = useState<string>("");

  /* =======================
     BACK BUTTON HANDLER
  ======================= */
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  /* =======================
     FILE CHANGE
  ======================= */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "businessLicense" | "insuranceCertificate" | "taxDocument",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; //file upload

      setData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file,
        },
      }));

      setError("");
    }
  };

  /* =======================
     CONTINUE
  ======================= */
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
            hidden
            id="businessLicenseInput"
            onChange={(e) => handleFileChange(e, "businessLicense")}
          />

          <input
            type="file"
            hidden
            id="insuranceInput"
            onChange={(e) => handleFileChange(e, "insuranceCertificate")}
          />

          <input
            type="file"
            hidden
            id="taxInput"
            onChange={(e) => handleFileChange(e, "taxDocument")}
          />

          {/* Upload UI */}
          <Box className="documents-section">
            {/* Business License */}
            <Box
              className="upload-box"
              onClick={() =>
                document.getElementById("businessLicenseInput")?.click()
              }
            >
              <DescriptionIcon />
              <Typography>
                {businessLicense
                  ? businessLicense.name
                  : "Upload Business License"}
              </Typography>
            </Box>

            {/* Insurance */}
            <Box
              className="upload-box"
              onClick={() => document.getElementById("insuranceInput")?.click()}
            >
              <DescriptionIcon />
              <Typography>
                {insuranceCertificate
                  ? insuranceCertificate.name
                  : "Upload Insurance Certificate"}
              </Typography>
            </Box>

            {/* Tax */}
            <Box
              className="upload-box"
              onClick={() => document.getElementById("taxInput")?.click()}
            >
              <DescriptionIcon />
              <Typography>
                {taxDocument ? taxDocument.name : "Upload Tax Document"}
              </Typography>
            </Box>
          </Box>

          {/* Error */}
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}

          {/* Actions */}
          <Box className="vendor-actions">
            <Button
              className="back"
              onClick={() => navigate("/vendor/categories")}
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

export default Documents;
