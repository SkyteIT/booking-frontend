import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ApplicationLayout from "../../../layouts/VendorLayout/ApplicationLayout";
import "./application.css";
import { fetchCategories, type ApiCategory } from "../../../services/categoryService";

const Categories = (): JSX.Element => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Load active categories from the database
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.filter((c) => c.isActive)))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  // --- BACK BUTTON HANDLER ---
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);
  // --- END BACK BUTTON HANDLER ---

  const handleSelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
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
                gap: 3
              }}
            >
              {categories.map((cat) => (
                <Box
                  key={cat.id}
                  className={`category-box ${
                    selectedCategories.includes(cat.name) ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(cat.name)}
                  sx={{ cursor: "pointer" }}
                >
                  {cat.name}
                </Box>
              ))}
            </Box>
          )}

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
