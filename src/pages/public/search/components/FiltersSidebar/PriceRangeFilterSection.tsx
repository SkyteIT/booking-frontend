// Price range section: controls min and max price inputs.
// Input values are sanitized/processed inside the hook handlers.
import { Stack, TextField, Typography } from "@mui/material";
import { filterTitleSx } from "./styles";

interface PriceRangeFilterSectionProps {
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

const PriceRangeFilterSection = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceRangeFilterSectionProps) => {
  return (
    <>
      <Typography sx={filterTitleSx}>Price Range</Typography>
      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 2.8 }}>
        <TextField
          size="small"
          placeholder="0"
          value={minPrice ?? ""}
          onChange={(event) => onMinPriceChange(event.target.value)}
          sx={{
            width: 84,
            "& .MuiInputBase-input": { fontSize: "0.82rem", py: 0.9, px: 1.2 },
            "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#FFFFFF" },
          }}
        />
        <Typography sx={{ color: "#94A3B8", fontSize: "0.9rem" }}>-</Typography>
        <TextField
          size="small"
          placeholder="1000"
          value={maxPrice ?? ""}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          sx={{
            width: 88,
            "& .MuiInputBase-input": { fontSize: "0.82rem", py: 0.9, px: 1.2 },
            "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#FFFFFF" },
          }}
        />
      </Stack>
    </>
  );
};

export default PriceRangeFilterSection;
