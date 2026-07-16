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
      <Typography sx={filterTitleSx}>Price range</Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="0"
          value={minPrice ?? ""}
          onChange={(event) => onMinPriceChange(event.target.value)}
          sx={{
            width: 86,
            "& .MuiInputBase-input": { fontSize: "0.85rem", py: 0.9, px: 1.2 },
            "& .MuiOutlinedInput-root": { borderRadius: "10px" },
          }}
        />
        <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>–</Typography>
        <TextField
          size="small"
          placeholder="1000"
          value={maxPrice ?? ""}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          sx={{
            width: 90,
            "& .MuiInputBase-input": { fontSize: "0.85rem", py: 0.9, px: 1.2 },
            "& .MuiOutlinedInput-root": { borderRadius: "10px" },
          }}
        />
      </Stack>
    </>
  );
};

export default PriceRangeFilterSection;
