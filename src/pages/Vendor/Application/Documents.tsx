import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

  // Official documents only - PDF or DOCX. Matches the backend's own
  // check (VendorRegisterController.ValidateDocument) - this is a UX
  // shortcut, not the real enforcement, since a client-side check alone
  // is trivially bypassed.
  const ALLOWED_TYPES = [".pdf", ".docx"];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

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
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_TYPES.includes(extension)) {
      setError("Only PDF or DOCX files are allowed");
      return;
    }
    if (file.size === 0) {
      setError("The selected file is empty");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File must not exceed 5MB");
      return;
    }

    setData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));

    setError("");
  };

  /* =======================
     CONTINUE
  ======================= */
  const handleContinue = () => {
    if (!(businessLicense instanceof File)) {
      setError("Please upload your business license");
      return;
    }

    navigate("/vendor/review");
  };

  return (
    <ApplicationLayout activeStep={3}>
      <Container className="vendor-container">
        <Typography className="vendor-title">Business Documents</Typography>

        <Box className="vendor-form-card">
          <Typography className="category-description">
            Business license is required. Insurance and tax documents are
            optional. PDF or DOCX only, up to 5MB each.
          </Typography>
          {/* Hidden Inputs */}
          <input
            type="file"
            hidden
            id="businessLicenseInput"
            accept=".pdf,.docx"
            onChange={(e) => handleFileChange(e, "businessLicense")}
          />

          <input
            type="file"
            hidden
            id="insuranceInput"
            accept=".pdf,.docx"
            onChange={(e) => handleFileChange(e, "insuranceCertificate")}
          />

          <input
            type="file"
            hidden
            id="taxInput"
            accept=".pdf,.docx"
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
              sx={
                businessLicense
                  ? {
                      borderColor: "success.main",
                      borderStyle: "solid",
                      background: "rgba(16,185,129,0.06)",
                    }
                  : undefined
              }
            >
              {businessLicense ? (
                <CheckCircleIcon
                  className="upload-icon"
                  sx={{ color: "success.main !important" }}
                />
              ) : (
                <DescriptionIcon className="upload-icon" />
              )}
              <Typography className="upload-text">
                {businessLicense
                  ? businessLicense.name
                  : "Upload Business License"}
              </Typography>
            </Box>

            {/* Insurance */}
            <Box
              className="upload-box"
              onClick={() => document.getElementById("insuranceInput")?.click()}
              sx={
                insuranceCertificate
                  ? {
                      borderColor: "success.main",
                      borderStyle: "solid",
                      background: "rgba(16,185,129,0.06)",
                    }
                  : undefined
              }
            >
              {insuranceCertificate ? (
                <CheckCircleIcon
                  className="upload-icon"
                  sx={{ color: "success.main !important" }}
                />
              ) : (
                <DescriptionIcon className="upload-icon" />
              )}
              <Typography className="upload-text">
                {insuranceCertificate
                  ? insuranceCertificate.name
                  : "Upload Insurance Certificate (optional)"}
              </Typography>
            </Box>

            {/* Tax */}
            <Box
              className="upload-box"
              onClick={() => document.getElementById("taxInput")?.click()}
              sx={
                taxDocument
                  ? {
                      borderColor: "success.main",
                      borderStyle: "solid",
                      background: "rgba(16,185,129,0.06)",
                    }
                  : undefined
              }
            >
              {taxDocument ? (
                <CheckCircleIcon
                  className="upload-icon"
                  sx={{ color: "success.main !important" }}
                />
              ) : (
                <DescriptionIcon className="upload-icon" />
              )}
              <Typography className="upload-text">
                {taxDocument
                  ? taxDocument.name
                  : "Upload Tax Document (optional)"}
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
