// src/components/cards/CategoryCard.tsx
import { Box, Card, CardMedia, Typography } from "@mui/material";

interface CategoryCardProps {
  image: string;
  label: string;
  count: number;
  onClick?: () => void;
}

const CategoryCard = ({ image, label, count, onClick }: CategoryCardProps) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        position: "relative",
        height: 160,
        cursor: "pointer",
        borderRadius: "12px",
        overflow: "hidden",
        border: "none",
      }}
    >
      {/* Background Image */}
      <CardMedia
        component="img"
        image={image}
        alt={label}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />

      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Text Content */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "0.75rem",
            mt: 0.25,
          }}
        >
          {count} Listings
        </Typography>
      </Box>
    </Card>
  );
};

export default CategoryCard;
