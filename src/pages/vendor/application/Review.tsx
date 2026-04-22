import {
  Container,
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

const Review = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // ✅ Get all stored data
  const businessInfo = JSON.parse(
    localStorage.getItem("vendorBusinessInfo") || "{}",
  );

  const contactInfo = JSON.parse(
    localStorage.getItem("vendorContactInfo") || "{}",
  );

  const categories = JSON.parse(
    localStorage.getItem("vendorCategories") || "[]",
  );

  const businessLicense = localStorage.getItem("businessLicense");
  const insuranceCertificate = localStorage.getItem("insuranceCertificate");
  const taxDocument = localStorage.getItem("taxDocument");

  const handleSubmit = () => {
    localStorage.clear();
    setOpenSnackbar(true);
  };

  return (
    <ApplicationLayout activeStep={4}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">
          <Typography className="vendor-title">
            Review & Submit Application
          </Typography>

          {/* ================= BUSINESS INFO ================= */}
          <Box className="vendor-summary">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Business Information
            </Typography>

            <div className="summary-item">
              <span className="summary-label">Business Name</span>
              <span className="summary-value">
                {businessInfo.businessName || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Business Type</span>
              <span className="summary-value">
                {businessInfo.businessType || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Tax ID</span>
              <span className="summary-value">{businessInfo.taxId || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Website</span>
              <span className="summary-value">
                {businessInfo.website || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Address</span>
              <span className="summary-value">
                {businessInfo.address || "-"}
              </span>
            </div>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ================= CONTACT INFO ================= */}
          <Box className="vendor-summary">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Information
            </Typography>

            <div className="summary-item">
              <span className="summary-label">Full Name</span>
              <span className="summary-value">
                {contactInfo.firstName || "-"} {contactInfo.lastName || ""}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Email</span>
              <span className="summary-value">{contactInfo.email || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Phone</span>
              <span className="summary-value">{contactInfo.phone || "-"}</span>
            </div>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ================= CATEGORIES ================= */}
          <Box className="vendor-summary">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Selected Categories
            </Typography>

            <div className="summary-item">
              <span className="summary-value">
                {categories.length > 0 ? categories.join(", ") : "-"}
              </span>
            </div>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ================= DOCUMENTS ================= */}
          <Box className="vendor-summary">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Uploaded Documents
            </Typography>

            <div className="summary-item">
              <span className="summary-label">Business License</span>
              <span className="summary-value">
                {businessLicense || "Not uploaded"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Insurance Certificate</span>
              <span className="summary-value">
                {insuranceCertificate || "Not uploaded"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Tax Document</span>
              <span className="summary-value">
                {taxDocument || "Not uploaded"}
              </span>
            </div>
          </Box>

          {/* ================= AGREEMENT ================= */}
          <Box className="agreement-box">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              }
              label={
                <span className="agreement-text">
                  I certify that all information provided is accurate and I
                  agree to UBE’s{" "}
                  <span className="agreement-link">Terms of Service</span> and{" "}
                  <span className="agreement-link">Vendor Agreement</span>.
                </span>
              }
            />
          </Box>

          {/* ================= BUTTONS ================= */}
          <Box className="vendor-actions">
            <Button
              className="back"
              onClick={() => navigate("/vendor/documents")}
            >
              Back
            </Button>

            <Button
              className="continue"
              disabled={!checked}
              onClick={handleSubmit}
            >
              Submit Application
            </Button>
          </Box>
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Submitted Successfully!
          </Alert>
        </Snackbar>
      </Container>
    </ApplicationLayout>
  );
};

export default Review;
