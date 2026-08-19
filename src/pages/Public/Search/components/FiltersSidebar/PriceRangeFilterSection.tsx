// Price range section: controls min and max price inputs.
// Uses local state to buffer input so the API is only triggered when the user
// leaves the field (onBlur) or presses Enter — not on every keystroke.
import { useState, useEffect } from "react";
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
  // Local draft values so typing doesn't fire API calls on every character.
  const [minDraft, setMinDraft] = useState(minPrice !== undefined ? String(minPrice) : "");
  const [maxDraft, setMaxDraft] = useState(maxPrice !== undefined ? String(maxPrice) : "");

  // Sync local draft if external filter is cleared (e.g. "Clear All" button).
  useEffect(() => {
    setMinDraft(minPrice !== undefined ? String(minPrice) : "");
  }, [minPrice]);

  useEffect(() => {
    setMaxDraft(maxPrice !== undefined ? String(maxPrice) : "");
  }, [maxPrice]);

  return (
    <>
      <Typography sx={filterTitleSx}>Price range</Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.2 }}>
        <TextField
          size="small"
          placeholder="0"
          value={minDraft}
          onChange={(e) => setMinDraft(e.target.value)}
          onBlur={() => onMinPriceChange(minDraft)}
          onKeyDown={(e) => { if (e.key === "Enter") onMinPriceChange(minDraft); }}
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
          value={maxDraft}
          onChange={(e) => setMaxDraft(e.target.value)}
          onBlur={() => onMaxPriceChange(maxDraft)}
          onKeyDown={(e) => { if (e.key === "Enter") onMaxPriceChange(maxDraft); }}
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