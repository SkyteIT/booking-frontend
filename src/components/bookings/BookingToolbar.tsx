import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TuneIcon from "@mui/icons-material/Tune";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };

  onDateRangeClick?: () => void;
  onFiltersClick?: () => void;
  onClear?: () => void;
};

export default function BookingsToolbar({
  search,
  onSearchChange,
  dateRange,
  onDateRangeClick,
  onFiltersClick,
  onClear,
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
            bgcolor: "background.paper",
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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Button
            variant="outlined"
            onClick={onDateRangeClick}
            startIcon={<CalendarMonthIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 2,
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "text.secondary", bgcolor: "secondary.light" },
            }}
          >
            Date Range
          </Button>
          {dateRange?.startDate && dateRange?.endDate && (
            <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>
              {dateRange.startDate} - {dateRange.endDate}
            </Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          onClick={onFiltersClick}
          startIcon={<TuneIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2,
            borderColor: "divider",
            color: "text.primary",
            "&:hover": { borderColor: "text.secondary", bgcolor: "secondary.light" },
          }}
        >
          Filters
        </Button>

        <Button size="small" onClick={onClear}>
          Clear
        </Button>
      </Box>
    </Box>
  );
}