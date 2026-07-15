// Shows title, location, rating, category badge, about section,
// amenities grid and guest reviews — all driven by the Listing prop.
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PoolIcon from "@mui/icons-material/Pool";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WifiIcon from "@mui/icons-material/Wifi";
import {
  Box,
  Typography,
  Chip,
  Rating,
  Divider,
  Avatar,
} from "@mui/material";
import type { Listing } from "../../../Search/utils/types";

// Static amenities — swap out per category in a real app
const AMENITIES = [
  { icon: <WifiIcon fontSize="small" />, label: "Free WiFi" },
  { icon: <PoolIcon fontSize="small" />, label: "Swimming Pool" },
  { icon: <RestaurantIcon fontSize="small" />, label: "Restaurant" },
  { icon: <FitnessCenterIcon fontSize="small" />, label: "Fitness Center" },
];

// Static reviews — in a real app these come from the API
const MOCK_REVIEWS = [
  {
    name: "Sarah Johnson",
    date: "2 months ago",
    rating: 5,
    text: "Absolutely amazing experience! The service was impeccable and the views were breathtaking.",
    avatar: "S",
  },
  {
    name: "Michael Chen",
    date: "1 month ago",
    rating: 5,
    text: "Best vacation ever. The staff went above and beyond to make our stay special.",
    avatar: "M",
  },
  {
    name: "Emma Williams",
    date: "3 weeks ago",
    rating: 4,
    text: "Beautiful resort with excellent facilities. Would definitely recommend!",
    avatar: "E",
  },
];

interface ProductDetailsProps {
  listing: Listing;
}

const ProductDetails = ({ listing }: ProductDetailsProps) => {
  return (
    <Box>
      {/* Category label */}
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: "0.7rem",
        }}
      >
        {listing.category}
      </Typography>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, color: "text.primary", mt: 0.5, mb: 1, letterSpacing: "-0.5px" }}
      >
        {listing.title}
      </Typography>

      {/* Rating + Location row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Rating
            value={listing.rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{ "& .MuiRating-iconFilled": { color: "#F59E0B" } }}
          />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {listing.rating} ({listing.reviews} reviews)
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {listing.location}
          </Typography>
        </Box>

        <Chip
          label={listing.isAvailable ? "Available" : "Unavailable"}
          size="small"
          sx={{
            backgroundColor: listing.isAvailable ? "#dcfce7" : "#fee2e2",
            color: listing.isAvailable ? "#16a34a" : "#dc2626",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* About */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        About this place
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
        Experience outstanding quality at {listing.title}, located in {listing.location}.
        Featuring world-class amenities, exceptional service, and an unforgettable atmosphere
        designed for your comfort. Whether you're here for leisure or adventure, we make sure
        every moment of your stay exceeds expectations.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Amenities */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Amenities
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mb: 3,
        }}
      >
        {AMENITIES.map((a) => (
          <Box
            key={a.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "10px",
              px: 2,
              py: 1.25,
              color: "text.secondary",
            }}
          >
            <Box sx={{ color: "primary.main", display: "flex" }}>{a.icon}</Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {a.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Guest Reviews */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Guest Reviews
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {MOCK_REVIEWS.map((review, i) => (
          <Box
            key={i}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "14px",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    bgcolor: "primary.main",
                  }}
                >
                  {review.avatar}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {review.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {review.date}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`★ ${review.rating}`}
                size="small"
                sx={{
                  backgroundColor: review.rating >= 5 ? "#dcfce7" : "#fef9c3",
                  color: review.rating >= 5 ? "#16a34a" : "#ca8a04",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65 }}>
              {review.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProductDetails;