// CategoriesSection.tsx
import { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../../cards/CategoryCard";
import { fetchCategories, type ApiCategory } from "../../../services/categoryService";

// Fallback images keyed by category name (case-insensitive).
// Any category not in this map gets a nice generic travel image.
const FALLBACK_IMAGES: Record<string, string> = {
  hotels: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  restaurants: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
  events: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
  activities: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600",
  "car rentals": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
  apartments: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600";

function getImage(name: string): string {
  return FALLBACK_IMAGES[name.toLowerCase()] ?? DEFAULT_IMAGE;
}

const CategoriesSection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) =>
        // Only show active categories on the landing page
        setCategories(data.filter((c) => c.isActive))
      )
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (name: string) => {
    navigate({
      pathname: "/search",
      search: new URLSearchParams({ category: name }).toString(),
    });
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="body2"
            sx={{
              color: "#2563EB",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.8rem",
              mb: 1,
            }}
          >
            Browse by Type
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              mb: 1.5,
            }}
          >
            Explore by Category
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 480,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            Find exactly what you're looking for — from luxury hotels to unique
            local experiences.
          </Typography>
        </Box>

        {/* Categories Grid */}
        <Grid container spacing={2.5}>
          {loading
            ? // Show skeleton placeholders while loading
              Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))
            : categories.map((category) => (
                <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <CategoryCard
                    image={getImage(category.name)}
                    label={category.name}
                    count={0}        // count can be wired up later via a listings-count endpoint
                    onClick={() => handleCategoryClick(category.name)}
                  />
                </Grid>
              ))}

          {/* If loaded but empty */}
          {!loading && categories.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
                <Typography>No categories available yet.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoriesSection;