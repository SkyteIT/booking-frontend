// Interactive date/unit/quantity selection, living in the main content
// column (next to photos/description) instead of the narrow sticky
// sidebar - a real seat grid or fleet list needs room to breathe.
// PriceCard just reads the selection made here and shows a summary +
// Add to cart.
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  CircularProgress,
} from "@mui/material";
import type { ListingUnitDto } from "../../../../../services/Vendor/listingUnitsService";
import type { Listing } from "../../../Search/utils/types";
import { getQuantityConfig } from "../../utils/quantityConfig";

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
    <Box sx={{ pt: 4, borderTop: "1px solid", borderColor: "divider" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, letterSpacing: "-0.01em" }}>
        Select your options
      </Typography>

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
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Check-out"
              type="date"
              size="small"
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
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
            sx={{ borderRadius: "10px" }}
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
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Choose a seat
          </Typography>

          <Box
            sx={{
              textAlign: "center",
              py: 1,
              mb: 2.5,
              borderRadius: "6px",
              bgcolor: "action.hover",
              color: "text.secondary",
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
                    borderRadius: "6px",
                    border: "1px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    bgcolor: isSelected ? "primary.main" : "background.paper",
                    color: isSelected ? "primary.contrastText" : "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" },
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
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 1.5, maxWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Choose a time
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {timeSlotUnits.map((u) => (
              <Chip
                key={u.id}
                label={u.name}
                color={selectedUnitId === u.id ? "primary" : "default"}
                onClick={() => onSelectUnit(u.id)}
                sx={{ cursor: "pointer" }}
              />
            ))}
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
            sx={{ borderRadius: "10px" }}
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
