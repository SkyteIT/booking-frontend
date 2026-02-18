// src/components/sections/landing/CategoriesSection.tsx
import { Box, Container, Typography, Grid } from "@mui/material";
import CategoryCard from "../../cards/CategoryCard";

const categories = [
  {
    id: 1,
    label: "Hotels",
    count: 1240,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  },
  {
    id: 2,
    label: "Restaurants",
    count: 856,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
  },
  {
    id: 3,
    label: "Events",
    count: 432,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
  },
  {
    id: 4,
    label: "Activities",
    count: 678,
    image: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600",
  },
  {
    id: 5,
    label: "Car Rentals",
    count: 324,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
  },
  {
    id: 6,
    label: "Apartments",
    count: 512,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  },
];

const CategoriesSection = () => {
  const handleCategoryClick = (label: string) => {
    console.log(`Navigating to category: ${label}`);
    // Later: navigate(`/listings?category=${label}`)
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
          {categories.map((category) => (
            <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CategoryCard
                image={category.image}
                label={category.label}
                count={category.count}
                onClick={() => handleCategoryClick(category.label)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoriesSection;
