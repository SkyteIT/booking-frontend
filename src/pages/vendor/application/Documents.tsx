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
import "./application.css";

const Review = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const businessInfo = JSON.parse(
    localStorage.getItem("vendorBusinessInfo") || "{}",
  );
  const contactInfo = JSON.parse(
    localStorage.getItem("vendorContactInfo") || "{}",
  );
  const categories = JSON.parse(
    localStorage.getItem("vendorCategories") || "[]",
  );

  const handleSubmit = () => {
    localStorage.clear();
    setOpenSnackbar(true);
  };

  return (
    <ApplicationLayout activeStep={4}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">
          <Typography className="vendor-title">Review & Submit</Typography>

          <Box className="vendor-summary">
            <div className="summary-item">
              <span className="summary-label">Business Name</span>
              <span className="summary-value">
                {businessInfo.businessName || "-"}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Contact Email</span>
              <span className="summary-value">{contactInfo.email || "-"}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Categories</span>
              <span className="summary-value">
                {categories.length > 0 ? categories.join(", ") : "-"}
              </span>
            </div>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
            label="I confirm the information is correct."
          />

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

        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity="success">Submitted Successfully!</Alert>
        </Snackbar>
      </Container>
    </ApplicationLayout>
  );
};

export default Review;
