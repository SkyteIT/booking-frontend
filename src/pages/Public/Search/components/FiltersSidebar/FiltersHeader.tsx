// Sidebar header: shows title and triggers "clear all filters".
import { Box, Button, Typography } from "@mui/material";

interface FiltersHeaderProps {
  onClearAll: () => void;
}

const FiltersHeader = ({ onClearAll }: FiltersHeaderProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.2 }}>
      <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1 }}>
        Filters
      </Typography>
      <Button
        size="small"
        onClick={onClearAll}
        sx={{
          textTransform: "none",
          color: "#0284C7",
          fontSize: "0.82rem",
          fontWeight: 600,
          px: 0,
          minWidth: "auto",
          "&:hover": { backgroundColor: "transparent", color: "#0369A1" },
        }}
      >
        Clear All
      </Button>
    </Box>
  );
};

export default FiltersHeader;
