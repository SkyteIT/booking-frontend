import { Container, Typography, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

const Categories = (): JSX.Element => {
  const navigate = useNavigate();
  const { data, setData } = useVendorApplication();

  //  use local state (initialize from context)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    data.categories || [],
  );

  const [error, setError] = useState<string>("");

  //  BACK BUTTON HANDLER (only once)
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  // --- CATEGORY LIST ---
  const categories = [
    "Hotel",
    "Restaurant",
    "Car Rental",
    "Activity",
    "Event",
    "Equipment Rental",
    "Other",
  ];

  const handleSelect = (category: string) => {
    let updated: string[];


//for multi select logic
    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter((item) => item !== category);
    } else {
      updated = [...selectedCategories, category];
    }

    // update local state (drives the checkbox UI)
    setSelectedCategories(updated);

    // update global context (persists across wizard steps)
    setData((prev) => ({
      ...prev,
      categories: updated,
    }));

    // persist
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

          <Typography className="category-description" sx={{ mb: 4 }}>
            Select the categories that best describe your offerings.
          </Typography>

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
