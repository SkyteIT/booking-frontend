import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import { useAuth } from "../../../context/useAuth";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import api from "../../../services/api";
import {
  clearRejectedVendorApplicationAcknowledgement,
  getMyVendorApplicationStatus,
} from "../../../services/vendorRegistrationService";
import {
  vendorBusinessInfoSchema,
  vendorCategoriesSchema,
  vendorContactInfoSchema,
} from "../../../utils/validationSchemas";
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
    setSubmitError(null);
    setSubmitting(true);
    try {
      const businessResult = vendorBusinessInfoSchema.safeParse(data.businessInfo);
      if (!businessResult.success) {
        setSubmitError(
          `Business information is incomplete: ${businessResult.error.issues[0]?.message ?? "check the required fields"}.`,
        );
        return;
      }

      const contactResult = vendorContactInfoSchema.safeParse(data.contactInfo);
      if (!contactResult.success) {
        setSubmitError(
          `Contact information is incomplete: ${contactResult.error.issues[0]?.message ?? "check the required fields"}.`,
        );
        return;
      }

      const categoriesResult = vendorCategoriesSchema.safeParse(data.categories);
      if (!categoriesResult.success) {
        setSubmitError(categoriesResult.error.issues[0]?.message ?? "Select a service category.");
        return;
      }

      const existingApplication = await getMyVendorApplicationStatus();
      if (
        existingApplication?.status === "Pending" ||
        existingApplication?.status === "Approved"
      ) {
        navigate("/vendor/application-status", { replace: true });
        return;
      }

      const formData = new FormData();

      if (!(data.documents.businessLicense instanceof File)) {
        setSubmitError(
          "Your business license is required. Please return to Documents and upload it again.",
        );
        return;
      }

      const applicationData = {
        businessInfo: businessResult.data,
        contactInfo: contactResult.data,
        categories: categoriesResult.data,
      };

      formData.append("BusinessName", applicationData.businessInfo.businessName);
      formData.append("BusinessType", applicationData.businessInfo.businessType);
      if (applicationData.businessInfo.taxId)
        formData.append("TaxId", applicationData.businessInfo.taxId);
      if (applicationData.businessInfo.website)
        formData.append("Website", applicationData.businessInfo.website);
      formData.append("Address", applicationData.businessInfo.address);

      formData.append("FirstName", applicationData.contactInfo.firstName);
      formData.append("LastName", applicationData.contactInfo.lastName);
      formData.append("Email", applicationData.contactInfo.email);
      formData.append("Phone", applicationData.contactInfo.phone);

      applicationData.categories.forEach((cat: string) => {
        formData.append("Categories", cat);
      });

      formData.append("businessLicense", data.documents.businessLicense);

      if (data.documents.insuranceCertificate instanceof File) {
        formData.append(
          "insuranceCertificate",
          data.documents.insuranceCertificate,
        );
      }

      if (data.documents.taxDocument instanceof File) {
        formData.append("taxDocument", data.documents.taxDocument);
      }

      // API CALL — routed through our shared api instance so the auth
      // token (and its automatic refresh-on-401) is handled consistently
      // with the rest of the app, instead of reading localStorage directly.
      // Content-Type must be set explicitly here - the api instance's
      // default "application/json" header otherwise wins over FormData's
      // own multipart boundary, which is what was causing the 415.
      await api.post("/vendor-register/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearRejectedVendorApplicationAcknowledgement();
      markVendorApplicationSubmitted();

      resetApplication();
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/customer/notifications");
      }, 2000);
    } catch (err) {
      const responseData = isAxiosError(err) ? err.response?.data : undefined;
      const problem =
        responseData && typeof responseData === "object"
          ? (responseData as {
              message?: string;
              error?: string;
              detail?: string;
              title?: string;
              errors?: Record<string, string[] | string>;
            })
          : undefined;
      const validationMessages = problem?.errors
        ? Object.values(problem.errors)
            .flatMap((value) => (Array.isArray(value) ? value : [value]))
            .join(" ")
        : undefined;
      const serverMsg =
        typeof responseData === "string"
          ? responseData
          : (problem?.message ??
            problem?.error ??
            problem?.detail ??
            validationMessages ??
            problem?.title);
      setSubmitError(
        serverMsg ?? "Couldn't submit your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ApplicationLayout activeStep={4}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">
          <Typography className="vendor-title">
            Review & Submit Application
          </Typography>

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
              <span className="summary-label">Tax ID (optional)</span>
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
              <span className="summary-label">
                Insurance Certificate (optional)
              </span>
              <span className="summary-value">
                {data?.documents?.insuranceCertificate
                  ? "Uploaded"
                  : "Not uploaded"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Tax Document (optional)</span>
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
                  I certify that all information provided is accurate and I
                  agree to UBE&apos;s{" "}
                  <span className="agreement-link">Terms of Service</span> and{" "}
                  <span className="agreement-link">Vendor Agreement</span>.
                </span>
              }
            />
          </Box>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "14px" }}>
              {submitError}
            </Alert>
          )}

          {/* ================= BUTTONS ================= */}
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
              disabled={!checked || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </Box>
        </Box>

        {/* ================= SUCCESS ================= */}
        <SnackbarAlert
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          message="Application submitted successfully!"
        />
      </Container>
    </ApplicationLayout>
  );
};

export default Review;
