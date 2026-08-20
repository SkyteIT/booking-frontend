import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import { Box, Card, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import type { ListingResponse } from "../../../../services/Vendor/listingService";

type ListingCardProps = {
  listing: ListingResponse;
  fallbackImage: string;
  onMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
};

// A single listing tile - glass-surface card matching the app-wide standard
// (20px radius, soft shadow, subtle border) rather than the old harder-edged
// version with its own one-off palette.
export default function ListingCard({ listing, fallbackImage, onMenuOpen }: ListingCardProps) {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(15,27,45,0.06)",
        boxShadow: "0 12px 32px rgba(15,27,45,0.06)",
        background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px rgba(15,27,45,0.1)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={listing.primaryImage || fallbackImage}
          alt={listing.title}
        />
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            px: 1.25,
            py: 0.35,
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 700,
            bgcolor: listing.isActive ? "rgba(16,185,129,0.14)" : "rgba(100,116,139,0.14)",
            color: listing.isActive ? "#059669" : "#475569",
          }}
        >
          {listing.isActive ? "Live" : "Inactive"}
        </Box>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 0.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {listing.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {listing.categoryName}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            {listing.currency} {listing.price}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {listing.totalReviews} reviews
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <StarIcon sx={{ fontSize: "1rem", color: "#FBBF24" }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {listing.averageRating > 0 ? listing.averageRating.toFixed(1) : "New"}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Box
            component={Link}
            to={`/vendor/listings/edit/${listing.id}`}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              py: 1,
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "#fff",
              background: "linear-gradient(160deg, #005a8d, #0077b6)",
              "&:hover": { background: "linear-gradient(160deg, #004a75, #005a8d)" },
            }}
          >
            <EditIcon sx={{ fontSize: "1.05rem" }} />
            Edit
          </Box>
          <IconButton
            onClick={onMenuOpen}
            sx={{
              border: "1px solid rgba(15,27,45,0.1)",
              borderRadius: "999px",
              color: "text.secondary",
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  );
}
