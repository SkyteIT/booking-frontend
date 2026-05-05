import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TuneIcon from "@mui/icons-material/Tune";

export default function BookingsToolbar({
  search,
  onSearchChange,
  dateRange,
  onDateRangeClick,
  onFiltersClick,
  onClear,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  onDateRangeClick: () => void;
  onFiltersClick: () => void;
  onClear: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",

        px: 2.5,
        py: 2,

        borderRadius: 4,

        // 🔥 glass container
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",

        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
      }}
    >
      {/* 🔍 SEARCH */}
      <TextField
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search bookings..."
        size="small"
        fullWidth
        sx={{
          maxWidth: 520,

          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "background.paper",

            transition: "all 0.2s ease",

            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            },

            "&.Mui-focused": {
              boxShadow: "0 6px 18px rgba(37,99,235,0.12)",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
            </InputAdornment>
          ),
        }}
      />

      {/* ACTIONS */}
      <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
        
        {/* DATE RANGE */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            onClick={onDateRangeClick}
            startIcon={<CalendarMonthIcon />}
            sx={(theme) => ({
              borderRadius: 2,
              textTransform: "none",
              px: 2,
              fontWeight: 400,

              bgcolor: alpha(theme.palette.primary.main, 0.06),
              color: theme.palette.primary.main,

              border: "1px solid",
              borderColor: alpha(theme.palette.primary.main, 0.12),

              transition: "all 0.2s ease",

              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                transform: "translateY(-1px)",
              },
            })}
          >
            Date Range
          </Button>

          {dateRange?.startDate && dateRange?.endDate && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                mt: 0.5,
                ml: 0.5,
              }}
            >
              {dateRange.startDate} — {dateRange.endDate}
            </Typography>
          )}
        </Box>

        {/* FILTER */}
        <Button
          onClick={onFiltersClick}
          startIcon={<TuneIcon />}
          sx={(theme) => ({
            borderRadius: 2,
            textTransform: "none",
            px: 2,
            fontWeight: 400,

            bgcolor: alpha(theme.palette.primary.main, 0.06),
            color: alpha(theme.palette.primary.main, 0.9),

            border: "1px solid",
            borderColor: "divider",

            transition: "all 0.2s ease",

            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              transform: "translateY(-1px)",
            },
          })}
        >
          Filters
        </Button>

        {/* CLEAR */}
        <Button
          onClick={onClear}
          sx={{
            textTransform: "none",
            fontWeight: 300,
            color: "text.secondary",

            "&:hover": {
              color: "primary.main",
              bgcolor: "transparent",
            },
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}