// Rating section: allows selecting a minimum rating threshold
// or resetting back to "All Ratings".
import StarIcon from "@mui/icons-material/Star";
import { Button, Stack, Typography } from "@mui/material";
import {
  filterTitleSx,
  getOptionButtonStateSx,
  optionButtonBaseSx,
} from "./styles";

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
  return (
    <>
      <Typography sx={filterTitleSx}>Minimum Rating</Typography>
      <Stack spacing={0.6}>
        <Button
          variant="text"
          onClick={() => onMinRatingChange(undefined)}
          startIcon={
            <StarIcon
              sx={{
                fontSize: "1rem",
                color: minRating === undefined ? "#0284C7" : "#64748B",
              }}
            />
          }
          sx={{ ...optionButtonBaseSx, ...getOptionButtonStateSx(minRating === undefined) }}
        >
          All Ratings
        </Button>

        {ratingOptions.map((rating) => {
          const isSelected = minRating === rating;

          return (
            <Button
              key={rating}
              variant="text"
              onClick={() => onMinRatingChange(rating)}
              startIcon={
                <StarIcon
                  sx={{
                    fontSize: "1rem",
                    color: isSelected ? "#0284C7" : "#64748B",
                  }}
                />
              }
              sx={{ ...optionButtonBaseSx, ...getOptionButtonStateSx(isSelected) }}
            >
              {rating}+ Stars
            </Button>
          );
        })}
      </Stack>
    </>
  );
};

export default RatingFilterSection;
