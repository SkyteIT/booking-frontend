// Interactive date/unit/quantity selection, living in the main content
// column (next to photos/description) instead of the narrow sticky
// sidebar - a real seat grid or fleet list needs room to breathe.
// PriceCard just reads the selection made here and shows a summary +
// Add to cart.
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";
import type { ListingUnitDto } from "../../../../../services/Vendor/listingUnitsService";
import type { Listing } from "../../../Search/utils/types";
import { getQuantityConfig } from "../../utils/quantityConfig";

// Shared field treatment for this section - a soft tinted fill instead of
// a plain white outline, consistent with the rest of the redesigned page
// (PriceCard's tinted selection box, the gradient hero).
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "rgba(0,119,182,0.04)",
    "&.Mui-focused": { backgroundColor: "transparent" },
  },
};

interface BookingOptionsProps {
  listing: Listing;
  units: ListingUnitDto[] | null;
  unitsLoading: boolean;
  selectedUnitId: string;
  onSelectUnit: (id: string) => void;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  guests: number;
  onGuestsChange: (n: number) => void;
}

const BookingOptions = ({
  listing,
  units,
  unitsLoading,
  selectedUnitId,
  onSelectUnit,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  guests,
  onGuestsChange,
}: BookingOptionsProps) => {
  if (unitsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const seatUnits = units?.filter((u) => u.kind === "Seat") ?? [];
  const timeSlotUnits = units?.filter((u) => u.kind === "TimeSlot") ?? [];
  const genericUnits = units?.filter((u) => u.kind === "Generic") ?? [];
  const quantityConfig = getQuantityConfig(listing);

  // Real 2D seat-map layout for Kind=Seat units (concerts/theater) -
  // seats already carry real rowIndex/columnIndex, just render them
  // aligned to it instead of a flat wrapped list.
  const maxColumn = seatUnits.reduce((m, u) => Math.max(m, u.columnIndex ?? 0), 0);

  return (
    <Box
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "24px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "0 12px 32px rgba(15,27,45,0.06)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 3 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(160deg, #005a8d, #0077b6)",
          }}
        >
          <TuneOutlinedIcon sx={{ fontSize: "1.1rem", color: "#fff" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Select your options
        </Typography>
      </Box>

      {/* Date Pickers - hidden for time-slot listings, which pick a single day below instead */}
      {timeSlotUnits.length === 0 && (
        <>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}>
            Select dates
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 3, maxWidth: 480 }}>
            <TextField
              label="Check-in"
              type="date"
              size="small"
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />
            <TextField
              label="Check-out"
              type="date"
              size="small"
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />
          </Box>
        </>
      )}

      {/* Generic units (room types / fleet vehicles / ticket tiers) */}
      {genericUnits.length > 0 && (
        <FormControl fullWidth size="small" sx={{ mb: 3, maxWidth: 480 }}>
          <InputLabel>Choose an option</InputLabel>
          <Select
            value={selectedUnitId}
            label="Choose an option"
            onChange={(e) => onSelectUnit(e.target.value)}
            sx={{ borderRadius: "12px", backgroundColor: "rgba(0,119,182,0.04)" }}
          >
            {genericUnits.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
                {u.priceOverride ? ` — $${u.priceOverride}` : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Seat map (events/concerts) - real 2D grid aligned to each
          seat's actual rowIndex/columnIndex, now with room to show a
          large venue instead of being squeezed into a 360px sidebar. */}
      {seatUnits.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}>
            <EventSeatOutlinedIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Choose a seat
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "center",
              py: 1,
              mb: 2.5,
              borderRadius: "999px",
              background: "linear-gradient(160deg, #005a8d, #0077b6)",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
            }}
          >
            STAGE
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${maxColumn + 1}, 38px)`,
              gridAutoRows: "38px",
              gap: "8px",
              justifyContent: "center",
              overflowX: "auto",
              pb: 1,
            }}
          >
            {seatUnits.map((u) => {
              const isSelected = selectedUnitId === u.id;
              return (
                <Box
                  key={u.id}
                  component="button"
                  type="button"
                  title={u.code ?? u.name}
                  onClick={() => onSelectUnit(u.id)}
                  sx={{
                    gridColumn: (u.columnIndex ?? 0) + 1,
                    gridRow: (u.rowIndex ?? 0) + 1,
                    width: 38,
                    height: 38,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    bgcolor: isSelected ? "primary.main" : "rgba(0,119,182,0.04)",
                    color: isSelected ? "primary.contrastText" : "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: isSelected ? "0 6px 14px rgba(0,119,182,0.35)" : "none",
                    transition: "all 0.15s ease",
                    "&:hover": { borderColor: "primary.main", transform: "translateY(-1px)" },
                  }}
                >
                  {u.code ?? u.name}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Time slots (restaurants, guided tours, showtimes) */}
      {timeSlotUnits.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Date"
            type="date"
            size="small"
            value={checkIn}
            onChange={(e) => {
              onCheckInChange(e.target.value);
              onCheckOutChange(e.target.value);
            }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlinedIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2, maxWidth: 240, ...fieldSx }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
            <ScheduleOutlinedIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Choose a time
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {timeSlotUnits.map((u) => {
              const isSelected = selectedUnitId === u.id;
              return (
                <Chip
                  key={u.id}
                  label={u.name}
                  onClick={() => onSelectUnit(u.id)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 600,
                    color: isSelected ? "#fff" : "text.primary",
                    background: isSelected ? "linear-gradient(160deg, #005a8d, #0077b6)" : "rgba(0,119,182,0.06)",
                    boxShadow: isSelected ? "0 6px 14px rgba(0,119,182,0.3)" : "none",
                    "&:hover": { background: isSelected ? undefined : "rgba(0,119,182,0.12)" },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* Quantity - not shown for seat/time-slot listings (inherently 1)
          or Car Rental (no guest/quantity concept in real rental flows). */}
      {seatUnits.length === 0 && timeSlotUnits.length === 0 && quantityConfig && (
        <FormControl fullWidth size="small" sx={{ maxWidth: 480 }}>
          <InputLabel>{quantityConfig.label}</InputLabel>
          <Select
            value={guests}
            label={quantityConfig.label}
            onChange={(e) => onGuestsChange(Number(e.target.value))}
            startAdornment={
              <InputAdornment position="start" sx={{ ml: 1 }}>
                <GroupsOutlinedIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
              </InputAdornment>
            }
            sx={{ borderRadius: "12px", backgroundColor: "rgba(0,119,182,0.04)" }}
          >
            {Array.from(
              { length: quantityConfig.max - quantityConfig.min + 1 },
              (_, i) => quantityConfig.min + i
            ).map((n) => (
              <MenuItem key={n} value={n}>
                {n} {quantityConfig.singular}
                {n > 1 ? "s" : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default BookingOptions;
