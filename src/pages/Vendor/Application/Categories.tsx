import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorApplication } from "../../../context/useVendorApplication";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";
import { fetchCategories, type ApiCategory } from "../../../services/categoryService";

const Categories = (): JSX.Element => {
  const navigate = useNavigate();
  const { data, setData } = useVendorApplication();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    data.categories || [],
  );
  const [error, setError] = useState<string>("");

  // Load active categories from the database
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.filter((c) => c.isActive)))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

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
  const fallbackCategories = [
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

    if (error) setError("");
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      setError("Please select at least one category");
      return;
    }
    navigate("/vendor/documents");
  };

  const visibleCategories =
    categories.length > 0 ? categories.map((category) => category.name) : fallbackCategories;

  return (
    <ApplicationLayout activeStep={2}>
      <Container className="vendor-container">
        <Box className="vendor-form-card">
          <Typography className="vendor-title">Service Categories</Typography>

          <Typography className="category-description" sx={{ mb: 4 }}>
            Select the categories that best describe your offerings.
          </Typography>

          {loadingCategories ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              className="category-grid"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 3,
              }}
            >
              {visibleCategories.map((cat) => (
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
          )}

          {error && <Typography sx={{ color: "red", mt: 2 }}>{error}</Typography>}

          <Box className="vendor-actions" sx={{ mt: 3 }}>
            <Button className="back" onClick={() => navigate("/vendor/contactinfo")}>
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
