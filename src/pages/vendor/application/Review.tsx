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
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import { useVendorApplication } from "../../../context/VendorApplicationContext";
import "./application.css";

const Review = () => {
  const navigate = useNavigate();

  // ✅ correct context usage
  const { data, resetApplication } = useVendorApplication();

  const [checked, setChecked] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async () => {
    try {
      // TODO: send full payload to backend
      // await api.post("/vendor/submit", data);

      // ✅ reset EVERYTHING after submit
      resetApplication();

      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ApplicationLayout activeStep={4}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">

          <Typography className="vendor-title">
            Review & Submit
          </Typography>

          {/* SUMMARY */}
          <Box className="vendor-summary">

            <div className="summary-item">
              <span className="summary-label">Business Name</span>
              <span className="summary-value">
                {data.businessInfo.businessName || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Business Type</span>
              <span className="summary-value">
                {data.businessInfo.businessType || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Tax ID</span>
              <span className="summary-value">
                {data.businessInfo.taxId || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Website</span>
              <span className="summary-value">
                {data.businessInfo.website || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Address</span>
              <span className="summary-value">
                {data.businessInfo.address || "-"}
              </span>
            </div>

          </Box>

          {/* AGREEMENT */}
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

          {/* BUTTONS */}
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

        {/* SUCCESS */}
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