import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Snackbar,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import api from "../../../services/api";
import "./application.css";
const Review = () => {
  const navigate = useNavigate();
  const { data, resetApplication } = useVendorApplication();
  const { markVendorApplicationSubmitted } = useAuth();
  const [checked, setChecked] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();

      formData.append("BusinessName", data.businessInfo.businessName);
      formData.append("BusinessType", data.businessInfo.businessType);
      formData.append("TaxId", data.businessInfo.taxId || "");
      formData.append("Website", data.businessInfo.website || "");
      formData.append("Address", data.businessInfo.address);

      formData.append("FirstName", data.contactInfo.firstName);
      formData.append("LastName", data.contactInfo.lastName);
      formData.append("Email", data.contactInfo.email);
      formData.append("Phone", data.contactInfo.phone);

      data.categories.forEach((cat: string) => {
        formData.append("Categories", cat);
      });

      if (data.documents.businessLicense) {
        formData.append("businessLicense", data.documents.businessLicense);
      }

      if (data.documents.insuranceCertificate) {
        formData.append("insuranceCertificate", data.documents.insuranceCertificate);
      }

      if (data.documents.taxDocument) {
        formData.append("taxDocument", data.documents.taxDocument);
      }

      await api.post("/vendor-register/submit", formData);

      markVendorApplicationSubmitted();
      resetApplication();
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 2000);
    } catch (err) {
      if (isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          err.message ??
          "Vendor application submission failed";
        setSubmitError(message);
        console.error("Submission failed:", err.response?.data ?? err.message);
      } else {
        setSubmitError("Vendor application submission failed");
        console.error("Submission failed:", err);
        alert("Submission failed. Check the browser console.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ApplicationLayout activeStep={4}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">
          <Typography className="vendor-title">Review & Submit Application</Typography>

          <Box className="vendor-summary">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Business Information
            </Typography>

            <div className="summary-item">
              <span className="summary-label">Business Name</span>
              <span className="summary-value">{data?.businessInfo?.businessName || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Business Type</span>
              <span className="summary-value">{data?.businessInfo?.businessType || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Tax ID</span>
              <span className="summary-value">{data?.businessInfo?.taxId || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Website</span>
              <span className="summary-value">{data?.businessInfo?.website || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Address</span>
              <span className="summary-value">{data?.businessInfo?.address || "-"}</span>
            </div>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box className="vendor-summary">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Information
            </Typography>

            <div className="summary-item">
              <span className="summary-label">First Name</span>
              <span className="summary-value">{data?.contactInfo?.firstName || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Last Name</span>
              <span className="summary-value">{data?.contactInfo?.lastName || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Email</span>
              <span className="summary-value">{data?.contactInfo?.email || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Phone</span>
              <span className="summary-value">{data?.contactInfo?.phone || "-"}</span>
            </div>
          </Box>

          <Divider sx={{ my: 3 }} />

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
                {data?.documents?.insuranceCertificate ? "Uploaded" : "Not uploaded"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Tax Document</span>
              <span className="summary-value">
                {data?.documents?.taxDocument ? "Uploaded" : "Not uploaded"}
              </span>
            </div>
          </Box>

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
                  I certify that all information provided is accurate and I agree to UBE&apos;s{" "}
                  <span className="agreement-link">Terms of Service</span> and{" "}
                  <span className="agreement-link">Vendor Agreement</span>.
                </span>
              }
            />
          </Box>

          <Box className="vendor-actions">
            <Button
              className="back"
              type="button"
              onClick={() => navigate("/vendor/documents")}
              disabled={submitting}
            >
              Back
            </Button>

            <Button
              className="continue"
              type="button"
              disabled={!checked || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </Box>

          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
        </Box>

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
