// Sidebar header: shows title and triggers "clear all filters".
import { Box, Button, Typography } from "@mui/material";

interface FiltersHeaderProps {
  onClearAll: () => void;
}

const FiltersHeader = ({ onClearAll }: FiltersHeaderProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography sx={{ fontSize: "1.05rem", fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1 }}>
        Filters
      </Typography>
      <Button
        size="small"
        onClick={onClearAll}
        sx={{
          textTransform: "none",
          color: "text.secondary",
          fontSize: "0.8rem",
          fontWeight: 500,
          px: 0,
          minWidth: "auto",
          "&:hover": { backgroundColor: "transparent", color: "primary.main" },
        }}
      >
        Clear all
      </Button>
    </Box>
  );
};

export default FiltersHeader;
