
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
  FormHelperText,
  InputAdornment,
  Chip,
} from "@mui/material";
import type { ListingUnitDto } from "../../../../../services/Vendor/listingUnitsService";
import type { Listing } from "../../../Search/utils/types";
import { getQuantityConfig } from "../../utils/quantityConfig";
import LoadingSpinner from "../../../../../components/common/LoadingSpinner";

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
  selectedSeatIds: string[];
  onToggleSeat: (id: string) => void;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  guests: number;
  onGuestsChange: (n: number) => void;
  
  selectedOptionValueIds: Record<string, string>;
  onSelectOptionValue: (groupId: string, valueId: string) => void;
 
  bookedUnitIds: string[];
}

const BookingOptions = ({
  listing,
  units,
  unitsLoading,
  selectedUnitId,
  onSelectUnit,
  selectedSeatIds,
  onToggleSeat,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  guests,
  onGuestsChange,
  selectedOptionValueIds,
  onSelectOptionValue,
  bookedUnitIds,
}: BookingOptionsProps) => {
  if (unitsLoading) {
    return <LoadingSpinner fullScreen={false} size={28} py={4} />;
  }

  const seatUnits = units?.filter((u) => u.kind === "Seat") ?? [];
  const timeSlotUnits = units?.filter((u) => u.kind === "TimeSlot") ?? [];
  const genericUnits = units?.filter((u) => u.kind === "Generic") ?? [];
  const quantityConfig = getQuantityConfig(listing);

  // Which option value is selected in each group, so the seat grid can be
  // tied to a specific tier (e.g. "VIP" requires a seat, "General
  // Admission" is just a quantity) instead of always showing whenever the
  // listing happens to have Seat-kind units.
  const hasOptionGroups = (listing.optionGroups?.length ?? 0) > 0;
  const allOptionValues = listing.optionGroups?.flatMap((g) => g.values) ?? [];
  const selectedOptionValues = Object.values(selectedOptionValueIds)
    .map((valueId) => allOptionValues.find((v) => v.id === valueId))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const showSeatGrid =
    seatUnits.length > 0 &&
    (!hasOptionGroups || selectedOptionValues.some((v) => v.requiresSeatSelection));
  // The backend already knows exactly what date UI each listing type
  // needs (BookingSelectionConfigDto) - an Event with a fixed date sets
  // showStartDate: false, so there's nothing for the customer to pick.
  // Falls back to the old per-type guess only if an older cached
  // response has no bookingSelection at all.
  const selectionConfig = listing.bookingSelection;
  const usesDateRange = selectionConfig
    ? selectionConfig.showEndDate
    : listing.type === "Hotel" || listing.type === "CarRental";
  const startDateLabel =
    selectionConfig?.startLabel ??
    (listing.type === "Hotel"
      ? "Check-in"
      : listing.type === "CarRental"
        ? "Pickup date"
        : "Booking date");
  const endDateLabel =
    selectionConfig?.endLabel ??
    (listing.type === "Hotel" ? "Check-out" : "Return date");
  const showDatePicker = selectionConfig ? selectionConfig.showStartDate : true;
  const fixedDate = selectionConfig?.fixedStartDateTime ?? listing.eventDateTime;

  // Real 2D seat-map layout for Kind=Seat units (concerts/theater) -
  // seats already carry real rowIndex/columnIndex, just render them
  // aligned to it instead of a flat wrapped list.
  const maxColumn = seatUnits.reduce(
    (m, u) => Math.max(m, u.columnIndex ?? 0),
    0,
  );

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
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Select your options
        </Typography>
      </Box>

      {/* Date Pickers - hidden for time-slot listings, which pick a single day below instead */}
      {timeSlotUnits.length === 0 &&
        (showDatePicker ? (
          <>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}
            >
              {usesDateRange ? "Select dates" : "Select a date"}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1.5,
                mb: 3,
                maxWidth: 480,
              }}
            >
              <TextField
                label={startDateLabel}
                type="date"
                size="small"
                value={checkIn}
                onChange={(e) => {
                  onCheckInChange(e.target.value);
                  if (!usesDateRange) onCheckOutChange(e.target.value);
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthOutlinedIcon
                          sx={{ fontSize: "1.1rem", color: "primary.main" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />
              {usesDateRange && (
                <TextField
                  label={endDateLabel}
                  type="date"
                  size="small"
                  value={checkOut}
                  onChange={(e) => onCheckOutChange(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthOutlinedIcon
                            sx={{ fontSize: "1.1rem", color: "primary.main" }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={fieldSx}
                />
              )}
            </Box>
          </>
        ) : (
          // Fixed-date listings (e.g. a music festival with one set date)
          // have nothing for the customer to pick - show the date instead
          // of asking them to choose it.
          fixedDate && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
                px: 1.75,
                py: 1.25,
                borderRadius: "12px",
                backgroundColor: "rgba(0,119,182,0.04)",
                maxWidth: 480,
              }}
            >
              <CalendarMonthOutlinedIcon
                sx={{ fontSize: "1.1rem", color: "primary.main" }}
              />
              <Typography variant="body2">
                <Typography component="span" sx={{ fontWeight: 600 }}>
                  {startDateLabel}:
                </Typography>{" "}
                {new Date(fixedDate).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Typography>
            </Box>
          )
        ))}

      {/* Generic units (room types / fleet vehicles / ticket tiers) */}
      {genericUnits.length > 0 && (
        <FormControl fullWidth size="small" sx={{ mb: 3, maxWidth: 480 }}>
          <InputLabel>Choose an option</InputLabel>
          <Select
            value={selectedUnitId}
            label="Choose an option"
            onChange={(e) => onSelectUnit(e.target.value)}
            sx={{
              borderRadius: "12px",
              backgroundColor: "rgba(0,119,182,0.04)",
            }}
          >
            {genericUnits.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
                {u.priceOverride ? ` — ${listing.currency} ${u.priceOverride}` : ""}
              </MenuItem>
            ))}
          </Select>
          {(() => {
            const selectedUnit = genericUnits.find((u) => u.id === selectedUnitId);
            return selectedUnit?.description ? (
              <FormHelperText sx={{ mx: 0 }}>{selectedUnit.description}</FormHelperText>
            ) : null;
          })()}
        </FormControl>
      )}

      {showSeatGrid && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}
          >
            <EventSeatOutlinedIcon
              sx={{ fontSize: "1.1rem", color: "primary.main" }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {quantityConfig
                ? `Choose your seats (up to ${quantityConfig.max})`
                : "Choose your seats"}
            </Typography>
            {selectedSeatIds.length > 0 && (
              <Chip
                size="small"
                label={`${selectedSeatIds.length} selected`}
                sx={{
                  fontWeight: 600,
                  bgcolor: "rgba(0,119,182,0.1)",
                  color: "primary.main",
                }}
              />
            )}
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
              const isSelected = selectedSeatIds.includes(u.id);
              const isBooked = bookedUnitIds.includes(u.id);
              const atLimit =
                Boolean(quantityConfig) &&
                selectedSeatIds.length >= (quantityConfig?.max ?? Infinity);
              const disabled = isBooked || (!isSelected && atLimit);
              return (
                <Box
                  key={u.id}
                  component="button"
                  type="button"
                  disabled={disabled}
                  title={
                    isBooked
                      ? "Already booked"
                      : !isSelected && atLimit
                        ? `Up to ${quantityConfig?.max} seats`
                        : (u.code ?? u.name)
                  }
                  onClick={() => onToggleSeat(u.id)}
                  sx={{
                    gridColumn: (u.columnIndex ?? 0) + 1,
                    gridRow: (u.rowIndex ?? 0) + 1,
                    width: 38,
                    height: 38,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    bgcolor: isBooked
                      ? "rgba(15,27,45,0.08)"
                      : isSelected
                        ? "primary.main"
                        : "rgba(0,119,182,0.04)",
                    color: isSelected
                      ? "primary.contrastText"
                      : "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: isBooked ? 0.5 : disabled ? 0.4 : 1,
                    textDecoration: isBooked ? "line-through" : "none",
                    boxShadow: isSelected
                      ? "0 6px 14px rgba(0,119,182,0.35)"
                      : "none",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      borderColor: disabled ? "divider" : "primary.main",
                      transform: disabled ? "none" : "translateY(-1px)",
                    },
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
                    <CalendarMonthOutlinedIcon
                      sx={{ fontSize: "1.1rem", color: "primary.main" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2, maxWidth: 240, ...fieldSx }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
            <ScheduleOutlinedIcon
              sx={{ fontSize: "1.1rem", color: "primary.main" }}
            />
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
                    background: isSelected
                      ? "linear-gradient(160deg, #005a8d, #0077b6)"
                      : "rgba(0,119,182,0.06)",
                    boxShadow: isSelected
                      ? "0 6px 14px rgba(0,119,182,0.3)"
                      : "none",
                    "&:hover": {
                      background: isSelected
                        ? undefined
                        : "rgba(0,119,182,0.12)",
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

    
      {(listing.optionGroups?.length ?? 0) > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          {[...listing.optionGroups!]
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((group) => {
              const sortedValues = [...group.values].sort(
                (a, b) => a.displayOrder - b.displayOrder,
              );
              const selectedValueId = selectedOptionValueIds[group.id] ?? "";
              return (
                <FormControl
                  key={group.id}
                  fullWidth
                  size="small"
                  sx={{ maxWidth: 480 }}
                >
                  <InputLabel>{group.name}</InputLabel>
                  <Select
                    value={selectedValueId}
                    label={group.name}
                    onChange={(e) =>
                      onSelectOptionValue(group.id, e.target.value)
                    }
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "rgba(0,119,182,0.04)",
                    }}
                  >
                    {sortedValues.map((value) => (
                      <MenuItem key={value.id} value={value.id}>
                        {value.name}
                        {value.priceOverride != null
                          ? ` — ${listing.currency} ${value.priceOverride}/${listing.priceUnit ?? "unit"}`
                          : value.priceModifier
                            ? ` (${value.priceModifier > 0 ? "+" : ""}${listing.currency} ${value.priceModifier})`
                            : ""}
                        {value.confirmationTypeOverride === "Instant"
                          ? " · Instant confirm"
                          : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            })}
        </Box>
      )}

    
      {!showSeatGrid &&
        timeSlotUnits.length === 0 &&
        quantityConfig && (
          <FormControl fullWidth size="small" sx={{ maxWidth: 480 }}>
            <InputLabel>{quantityConfig.label}</InputLabel>
            <Select
              value={guests}
              label={quantityConfig.label}
              onChange={(e) => onGuestsChange(Number(e.target.value))}
              startAdornment={
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <GroupsOutlinedIcon
                    sx={{ fontSize: "1.1rem", color: "primary.main" }}
                  />
                </InputAdornment>
              }
              sx={{
                borderRadius: "12px",
                backgroundColor: "rgba(0,119,182,0.04)",
              }}
            >
              {Array.from(
                { length: quantityConfig.max - quantityConfig.min + 1 },
                (_, i) => quantityConfig.min + i,
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
