import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

const Categories = (): JSX.Element => {
  const navigate = useNavigate();

  const categories = [
    "Hotel",
    "Restaurant",
    "Car Rental",
    "Activity",
    "Event",
    "Equipment Rental",
    "Other",
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("vendorCategories");
    if (saved) setSelectedCategories(JSON.parse(saved));
  }, []);

  const handleSelect = (category: string) => {
    let updated: string[];
    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter((item) => item !== category);
    } else {
      updated = [...selectedCategories, category];
    }

    setSelectedCategories(updated);
    localStorage.setItem("vendorCategories", JSON.stringify(updated));
    setError("");
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      setError("Select at least one category");
      return;
    }
    navigate("/vendor/documents");
  };

  return (
    <ApplicationLayout activeStep={2}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">
          <Typography className="vendor-title">Service Categories</Typography>

          <Box className="category-grid">
            {categories.map((cat) => (
              <Box
                key={cat}
                className={`category-box ${
                  selectedCategories.includes(cat) ? "selected" : ""
                }`}
                onClick={() => handleSelect(cat)}
              >
                {cat}
              </Box>
            ))}
          </Box>

          {error && (
            <Typography sx={{ color: "red", mt: 2 }}>{error}</Typography>
          )}

          <Box className="vendor-actions">
            <Button
              className="back"
              onClick={() => navigate("/vendor/contactinfo")}
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

export default Categories;
