// Shows title, location, rating, category badge, real description and
// real amenities — all driven directly by the Listing prop. No fabricated
// copy, amenities, or reviews: if the backend didn't return it, we don't
// show it.
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Box, Typography, Chip, Rating, Divider } from "@mui/material";
import type { Listing } from "../../../Search/utils/types";

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
          color: "primary.main",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontSize: "0.72rem",
        }}
      >
        {listing.category}
      </Typography>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          color: "text.primary",
          mt: 0.5,
          mb: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {listing.title}
      </Typography>

      {/* Rating + Location + Vendor row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3 }}>
        {listing.reviews > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Rating
              value={listing.rating}
              precision={0.5}
              readOnly
              size="small"
              sx={{ "& .MuiRating-iconFilled": { color: "#F5A623" } }}
            />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {listing.rating.toFixed(1)} ({listing.reviews} review{listing.reviews === 1 ? "" : "s"})
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {listing.location}
          </Typography>
        </Box>

        {listing.vendorName && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StorefrontOutlinedIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {listing.vendorName}
            </Typography>
          </Box>
        )}

        <Chip
          label={listing.isAvailable ? "Available" : "Unavailable"}
          size="small"
          sx={{
            backgroundColor: listing.isAvailable ? "rgba(16,185,129,0.12)" : "rgba(220,38,38,0.1)",
            color: listing.isAvailable ? "success.main" : "error.main",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* About */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, letterSpacing: "-0.01em" }}>
        About this listing
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
        {listing.description?.trim() || "No description provided for this listing yet."}
      </Typography>

      {/* Amenities — only shown when the backend actually returned some */}
      {listing.amenities.length > 0 && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, letterSpacing: "-0.01em" }}>
            What's included
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mb: 1,
            }}
          >
            {listing.amenities.map((item) => (
              <Box
                key={item}
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
                <CheckCircleOutlineIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProductDetails;
