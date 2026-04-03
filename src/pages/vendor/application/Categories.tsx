import {
  Container,
  Typography,
  Box,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

const Categories = (): JSX.Element => {
  const navigate = useNavigate();

  const categories = [
    "Vehicles",
    "Equipment",
    "Real Estate",
    "Event Spaces",
    "Sports & Recreation",
    "Electronics",
    "Tools & Machinery",
    "Other"
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

  const handleSelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }

    if (error) setError("");
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      setError("Please select at least one category");
      return;
    }

    navigate("/vendor/documents");
  };

  return (
    <ApplicationLayout activeStep={2}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">
          <Typography className="vendor-title">
            Service Categories
          </Typography>

          <Typography className="category-description" sx={{ mb: 4 }}>
            Select the categories that best describe your offerings.
          </Typography>

          <Box
            className="category-grid"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 3
            }}
          >
            {categories.map((cat) => (
              <Box
                key={cat}
                className={`category-box ${
                  selectedCategories.includes(cat) ? "selected" : ""
                }`}
                onClick={() => handleSelect(cat)}
                sx={{ cursor: "pointer" }}
              >
                {cat}
              </Box>
            ))}
          </Box>

          {error && (
            <Typography sx={{ color: "red", mt: 2 }}>
              {error}
            </Typography>
          )}

          <Box className="vendor-actions" sx={{ mt: 3 }}>
            <Button
              className="back"
              onClick={() => navigate("/vendor/contactinfo")}
            >
              Back
            </Button>
            <Button
              className="continue"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Container>
    </ApplicationLayout>
  );
};

export default Categories;