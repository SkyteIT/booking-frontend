// src/components/cards/ListingCard.tsx
// Added useNavigate — clicking a card routes to /listing/:id
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Rating,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ListingCardProps {
  id?: string | number;
  image: string;
  title: string;
  description?: string;
  category: string;
  price: string;
  priceNumber?: number;
  rating: number;
  location: string;
  badge?: "Featured" | "Popular" | "New";
  offerLabel?: string;
  onClick?: () => void;
}




const ListingCard = ({
  id,
  image,
  title,
  category,
  price,
  rating,
  location,
  badge,
  offerLabel,
  onClick,
}: ListingCardProps) => {
  const navigate = useNavigate();


  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (id !== undefined) {
      navigate(`/view-product/${id}`);
    }
  };




  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Let customers choose dates, units, and quantity on the listing
    // details page before anything is added to their cart.
    handleClick();
  };



  return (
    <Card
      onClick={handleClick}
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        "&:hover": {
          boxShadow: "0 16px 40px rgba(17,24,39,0.08)",
          borderColor: "rgba(0,119,182,0.25)",
        },
      }}
    >
      {/* Image Container */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{ height: 200, objectFit: "cover" }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
          }}
        />

        {/* Badge */}
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: "rgba(17,24,39,0.75)",
              backdropFilter: "blur(6px)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.7rem",
              height: "24px",
            }}
          />
        )}

        {/* Offer badge - top-right, distinct from Featured/Popular/New (top-left) */}
        {offerLabel && (
          <Chip
            label={offerLabel}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "#E85D3D",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.7rem",
              height: "24px",
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Category */}
        <Typography
          variant="caption"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.68rem",
            letterSpacing: "0.08em",
          }}
        >
          {category}
        </Typography>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            color: "text.primary",
            mt: 0.5,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </Typography>

        {/* Location - opens the real address in Google Maps, not just
            static text. Stops propagation so it doesn't also trigger the
            card's own click-through to the listing. */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
              "_blank",
              "noopener,noreferrer"
            );
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 1,
            width: "fit-content",
            cursor: "pointer",
            "&:hover .listing-card-location-text": { textDecoration: "underline" },
          }}
        >
          <LocationOnIcon sx={{ fontSize: "0.9rem", color: "text.secondary" }} />
          <Typography
            variant="body2"
            className="listing-card-location-text"
            sx={{ color: "text.secondary", fontSize: "0.8rem" }}
          >
            {location}
          </Typography>
        </Box>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Rating
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#F5A623",
              },
              "& .MuiRating-iconEmpty": {
                color: "rgba(0,0,0,0.12)",
              },
            }}
          />
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
            ({rating})
          </Typography>
        </Box>
      </CardContent>

      {/* Footer — Price + Button */}
      <CardActions
        sx={{
          px: 2.5,
          pb: 2.5,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
            Starting from
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.2,
            }}
          >
            {price}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={handleBookNow}
          sx={{
            borderRadius: "999px",
            px: 2.2,
            py: 0.7,
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "none",
            borderColor: "divider",
            color: "text.primary",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "rgba(0,119,182,0.06)",
              color: "primary.main",
            },
          }}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default ListingCard;
