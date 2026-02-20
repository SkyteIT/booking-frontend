import {
  Box,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TuneIcon from "@mui/icons-material/Tune";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  onDateRangeClick?: () => void;
  onFiltersClick?: () => void;
};

export default function BookingsToolbar({
  search,
  onSearchChange,
  onDateRangeClick,
  onFiltersClick,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 2,
      }}
    >
      {/* Search */}
      <TextField
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search bookings..."
        size="small"
        fullWidth
        sx={{
          maxWidth: 520,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "#fff",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
        <Button
          variant="outlined"
          onClick={onDateRangeClick}
          startIcon={<CalendarMonthIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2,
            borderColor: "#E5E7EB",
            color: "#0F172A",
            "&:hover": { borderColor: "#CBD5E1", bgcolor: "#F8FAFC" },
          }}
        >
          Date Range
        </Button>

        <Button
          variant="outlined"
          onClick={onFiltersClick}
          startIcon={<TuneIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2,
            borderColor: "#E5E7EB",
            color: "#0F172A",
            "&:hover": { borderColor: "#CBD5E1", bgcolor: "#F8FAFC" },
          }}
        >
          Filters
        </Button>
      </Box>
    </Box>
  );
}