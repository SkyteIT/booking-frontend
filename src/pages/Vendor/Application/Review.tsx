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
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import api from "../../../services/api";
import "./application.css";
//import { useAuth } from "../../../context/AuthContext";
const Review = () => {
  const navigate = useNavigate();
  const { data, resetApplication } = useVendorApplication();
  //const { markVendorApplicationSubmitted } = useAuth();
  const [checked, setChecked] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async () => {
    try {
      //create form data
      const formData = new FormData();

      // BUSINESS INFO
      formData.append("BusinessName", data.businessInfo.businessName);
      formData.append("BusinessType", data.businessInfo.businessType);
      formData.append("TaxId", data.businessInfo.taxId || "");
      formData.append("Website", data.businessInfo.website || "");
      formData.append("Address", data.businessInfo.address);

      // CONTACT INFO
      formData.append("FirstName", data.contactInfo.firstName);
      formData.append("LastName", data.contactInfo.lastName);
      formData.append("Email", data.contactInfo.email);
      formData.append("Phone", data.contactInfo.phone);

      // CATEGORIES (Simplified format for standard [FromForm] binding)
      data.categories.forEach((cat: string) => {
        formData.append("Categories", cat);
      });

      // DOCUMENTS (Matching controller parameter names exactly)
      if (data.documents.businessLicense) {
        formData.append("businessLicense", data.documents.businessLicense);
      }

      if (data.documents.insuranceCertificate) {
        formData.append(
          "insuranceCertificate",
          data.documents.insuranceCertificate,
        );
      }

      if (data.documents.taxDocument) {
        formData.append("taxDocument", data.documents.taxDocument);
      }

      // API CALL — routed through our shared api instance so the auth
      // token (and its automatic refresh-on-401) is handled consistently
      // with the rest of the app, instead of reading localStorage directly.
      await api.post("/vendor-register/submit", formData);

      // SUCCESS
      resetApplication();
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }  catch (err) {
      if (isAxiosError(err)) {
        console.error("Submission failed:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
    
        alert(
          `Submission failed.\nStatus: ${
            err.response?.status ?? "Unknown"
          }\n${JSON.stringify(err.response?.data) || err.message}`
        );
      } else {
        console.error("Submission failed:", err);
        alert("Submission failed. Check the browser console.");
      }
    }
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
                {data?.businessInfo?.businessName || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Business Type</span>
              <span className="summary-value">
                {data?.businessInfo?.businessType || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Tax ID</span>
              <span className="summary-value">
                {data?.businessInfo?.taxId || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Website</span>
              <span className="summary-value">
                {data?.businessInfo?.website || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Address</span>
              <span className="summary-value">
                {data?.businessInfo?.address || "-"}
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
              <span className="summary-label">First Name</span>
              <span className="summary-value">
                {data?.contactInfo?.firstName || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Last Name</span>
              <span className="summary-value">
                {data?.contactInfo?.lastName || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Email</span>
              <span className="summary-value">
                {data?.contactInfo?.email || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Phone</span>
              <span className="summary-value">
                {data?.contactInfo?.phone || "-"}
              </span>
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
                {data?.categories?.length ? data.categories.join(", ") : "-"}
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
                {data?.documents?.businessLicense ? "Uploaded" : "Not uploaded"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Insurance Certificate</span>
              <span className="summary-value">
                {data?.documents?.insuranceCertificate
                  ? "Uploaded"
                  : "Not uploaded"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Tax Document</span>
              <span className="summary-value">
                {data?.documents?.taxDocument ? "Uploaded" : "Not uploaded"}
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

        {/* ================= SUCCESS ================= */}
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
