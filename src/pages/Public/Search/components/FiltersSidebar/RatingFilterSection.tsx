// Rating section: allows selecting a minimum rating threshold
// or resetting back to "All Ratings". Rendered as wrapping pill chips.
import StarIcon from "@mui/icons-material/Star";
import { Box, Button, Typography } from "@mui/material";
import { filterTitleSx } from "./styles";

interface RatingFilterSectionProps {
  minRating?: number;
  ratingOptions: readonly number[];
  onMinRatingChange: (value?: number) => void;
}

const RatingFilterSection = ({
  minRating,
  ratingOptions,
  onMinRatingChange,
}: RatingFilterSectionProps) => {
  const options: { label: string; value?: number }[] = [
    { label: "All ratings", value: undefined },
    ...ratingOptions.map((rating) => ({ label: `${rating}+`, value: rating })),
  ];

  return (
    <>
      <Typography sx={filterTitleSx}>Minimum rating</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
        {options.map((opt) => {
          const isSelected = minRating === opt.value;

          return (
            <Button
              key={opt.label}
              onClick={() => onMinRatingChange(opt.value)}
              startIcon={
                opt.value !== undefined ? (
                  <StarIcon sx={{ fontSize: "0.85rem", color: isSelected ? "#fff" : "#F5A623" }} />
                ) : undefined
              }
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                fontSize: "0.82rem",
                fontWeight: isSelected ? 600 : 500,
                px: 1.6,
                py: 0.75,
                minWidth: "auto",
                border: "1px solid",
                borderColor: isSelected ? "primary.main" : "divider",
                backgroundColor: isSelected ? "primary.main" : "background.paper",
                color: isSelected ? "#fff" : "text.secondary",
                boxShadow: isSelected ? "none" : "0 1px 2px rgba(17,24,39,0.04)",
                "&:hover": {
                  backgroundColor: isSelected ? "primary.dark" : "action.hover",
                  borderColor: isSelected ? "primary.dark" : "divider",
                },
              }}
            >
              {opt.label}
            </Button>
          );
        })}
      </Box>
    </>
  );
};

export default RatingFilterSection;
