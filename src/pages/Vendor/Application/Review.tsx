import {
  Container,
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

const Review = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = () => {
    // Clear application data if needed
    localStorage.removeItem("businessInfo");
    localStorage.removeItem("contactInfo");
    localStorage.removeItem("categories");
    localStorage.removeItem("documents");
    localStorage.removeItem("review");

    // Show success message
    setOpenSnackbar(true);

    // ❌ Do NOT navigate anywhere
  };

  return (
    <ApplicationLayout activeStep={4}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">
          {/* Title */}
          <Typography className="vendor-title">
            Review & Submit
          </Typography>

          {/* Summary Box */}
          <Box className="vendor-summary">
            <div className="summary-item">
              <span className="summary-label">Business Name</span>
              <span className="summary-value">Acme Rentals LLC</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Contact Email</span>
              <span className="summary-value">contact@acmerentals.com</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Categories</span>
              <span className="summary-value">
                Vehicles, Equipment, Tools & Machinery
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Documents Uploaded</span>
              <span className="summary-value">
                3 of 3 required documents
              </span>
            </div>
          </Box>

          {/* Agreement Box */}
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
                  I certify that all information provided is accurate and I agree to UBE’s{" "}
                  <span className="agreement-link">Terms of Service</span> and{" "}
                  <span className="agreement-link">Vendor Agreement</span>.
                </span>
              }
            />
          </Box>

          {/* Buttons */}
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