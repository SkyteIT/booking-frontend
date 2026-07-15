import {
  Container,
  Typography,
  Box,
  Button
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";

const Categories = (): JSX.Element => {
  const navigate = useNavigate();

  //  correct context usage
  const { data, setData } = useVendorApplication();

  const selectedCategories: string[] = data.categories;

  const [error, setError] = useState<string>("");

  // --- BACK BUTTON HANDLER ---
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handleBack);

    return () =>
      window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  // --- CATEGORY LIST ---
  const categories = [
    "Vehicles",
    "Equipment",
    "Hotels & Resorts",
    "Event Spaces",
    "Sports & Recreation",
    "Electronics",
    "Tools & Machinery",
    "Other"
  ];

  // --- HANDLE SELECT ---
  const handleSelect = (category: string) => {
    let updated: string[];


//for multi select logic
    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter(
        (item) => item !== category
      );
    } else {
      updated = [...selectedCategories, category];
    }

    //  save to global context
    setData(prev => ({
      ...prev,
      categories: updated
    }));

    if (error) setError("");
  };

  // --- CONTINUE ---
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

          <Typography
            className="category-description"
            sx={{ mb: 4 }}
          >
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
                  selectedCategories.includes(cat)
                    ? "selected"
                    : ""
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
              onClick={() =>
                navigate("/vendor/contactinfo")
              }
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