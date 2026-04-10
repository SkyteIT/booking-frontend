// src/components/sections/landing/FeaturedSection.tsx
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ListingCard from "../../cards/ListingCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const listings = [
  {
    id: 1,
    title: "Grand Plaza Hotel & Spa",
    category: "Hotel",
    price: "$120/night",
    priceNumber: 120,
    rating: 4.8,
    location: "New York, USA",
    badge: "Featured" as const,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  },
  {
    id: 2,
    title: "Ocean View Restaurant",
    category: "Restaurant",
    price: "$45/person",
    priceNumber: 45,
    rating: 4.6,
    location: "Miami, USA",
    badge: "Popular" as const,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
  },
  {
    id: 3,
    title: "Safari Adventure Tour",
    category: "Activity",
    price: "$89/person",
    priceNumber: 89,
    rating: 4.9,
    location: "Nairobi, Kenya",
    badge: "New" as const,
    image: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600",
  },
  {
    id: 4,
    title: "BMW 5 Series Rental",
    category: "Car Rental",
    price: "$95/day",
    priceNumber: 95,
    rating: 4.7,
    location: "Los Angeles, USA",
    badge: "Featured" as const,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
  },
  {
    id: 5,
    title: "Downtown Luxury Apartment",
    category: "Apartment",
    price: "$150/night",
    priceNumber: 150,
    rating: 4.5,
    location: "Chicago, USA",
    badge: "Popular" as const,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  },
  {
    id: 6,
    title: "Jazz Night Live Event",
    category: "Event",
    price: "$35/ticket",
    priceNumber: 35,
    rating: 4.8,
    location: "New Orleans, USA",
    badge: "New" as const,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
  },
];

const FeaturedSection = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/search");
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: "#F8FAFC",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: { xs: 4, md: 6 },
          }}
        >
          {/* Left — Title */}
          <Box>
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
              Hand Picked For You
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                mb: 1,
              }}
            >
              Featured Listings
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: 420,
              }}
            >
              Explore our top-rated listings carefully selected for quality and
              value.
            </Typography>
          </Box>

          {/* Right — View All Button */}
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={handleViewAll}
            sx={{
              borderRadius: "8px",
              px: 3,
              py: 1.25,
              fontSize: "0.9rem",
              fontWeight: 600,
              borderColor: "#2563EB",
              color: "#2563EB",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": {
                backgroundColor: "#EFF6FF",
                borderColor: "#1D4ED8",
              },
            }}
          >
            View All Listings
          </Button>
        </Box>

        {/* Listings Grid */}
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ListingCard
                id={listing.id}
                image={listing.image}
                title={listing.title}
                category={listing.category}
                price={listing.price}
                priceNumber={listing.priceNumber}
                rating={listing.rating}
                location={listing.location}
                badge={listing.badge}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedSection;
