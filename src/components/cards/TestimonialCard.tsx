// src/components/cards/TestimonialCard.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
}

const TestimonialCard = ({
  name,
  role,
  avatar,
  rating,
  review,
}: TestimonialCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        p: 1,
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Quote Icon + Rating Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormatQuoteIcon
            sx={{
              fontSize: "2.5rem",
              color: "#2563EB",
              opacity: 0.8,
            }}
          />
          <Rating
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#F59E0B",
              },
            }}
          />
        </Box>

        {/* Review Text */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.7,
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          "{review}"
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            height: "1px",
            backgroundColor: "divider",
            width: "100%",
          }}
        />

        {/* Reviewer Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={avatar}
            alt={name}
            sx={{
              width: 44,
              height: 44,
              border: "2px solid",
              borderColor: "#2563EB",
            }}
          />
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.78rem",
                color: "text.secondary",
                lineHeight: 1.3,
              }}
            >
              {role}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
