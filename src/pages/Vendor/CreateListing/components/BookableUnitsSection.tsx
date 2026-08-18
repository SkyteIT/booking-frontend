import AddIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Alert,
} from "@mui/material";
import type { ListingCategory } from "../../../../utils/types";

export type UnitsMode = "none" | "list" | "grid" | "timeslot";

export interface ListRow {
  name: string;
  priceOverride: string;
  capacity: string;
}

export interface GridConfig {
  rows: string;
  columns: string;
  pricePerSeat: string;
}

export interface TimeSlotConfig {
  startTime: string;
  endTime: string;
  slotDurationMinutes: string;
  capacityPerSlot: string;
  price: string;
}

type Props = {
  category: ListingCategory;
  mode: UnitsMode;
  onModeChange: (mode: UnitsMode) => void;
  listRows: ListRow[];
  onListRowsChange: (rows: ListRow[]) => void;
  gridConfig: GridConfig;
  onGridConfigChange: (config: GridConfig) => void;
  timeSlotConfig: TimeSlotConfig;
  onTimeSlotConfigChange: (config: TimeSlotConfig) => void;
};

const emptyListRow: ListRow = { name: "", priceOverride: "", capacity: "1" };

export default function BookableUnitsSection({
  category,
  mode,
  onModeChange,
  listRows,
  onListRowsChange,
  gridConfig,
  onGridConfigChange,
  timeSlotConfig,
  onTimeSlotConfigChange,
}: Props) {
  const showGridOption = category === "Event";
  // Hotel time slots are day-use bookings (e.g. 8AM-4PM) - a real
  // pattern (HotelsByDay, Dayuse.com) treating day-use as a standalone,
  // separately-priced product distinct from overnight stays. The same
  // bulk time-slot generator built for restaurants/activities covers it.
  // Event time slots are showtimes (e.g. a movie theater's screening
  // times) - a vendor can use these instead of, or alongside, assigned
  // seating (Grid mode).
  const showTimeSlotOption =
    category === "Restaurant" || category === "Activity" || category === "Hotel" || category === "Event";
  const timeSlotLabel = category === "Hotel" ? "Day-Use Time Bands" : category === "Event" ? "Showtimes" : "Time Slots";

  const updateRow = (index: number, patch: Partial<ListRow>) => {
    const next = [...listRows];
    next[index] = { ...next[index], ...patch };
    onListRowsChange(next);
  };

  return (
    <Box sx={{ mt: 5, pt: 4, borderTop: "1px solid #E2E8F0" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Bookable Units (optional)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Define specific room types, seats, fleet vehicles, or time slots
        customers can pick individually. Leave this off to keep this listing
        as a single bookable item.
      </Typography>

      <ToggleButtonGroup
        exclusive
        value={mode}
        onChange={(_, v) => v && onModeChange(v)}
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="none">None</ToggleButton>
        <ToggleButton value="list">List (room types / fleet / tiers)</ToggleButton>
        {showGridOption && <ToggleButton value="grid">Seat Grid</ToggleButton>}
        {showTimeSlotOption && <ToggleButton value="timeslot">{timeSlotLabel}</ToggleButton>}
      </ToggleButtonGroup>

      {mode === "list" && (
        <Stack spacing={2}>
          {listRows.map((row, i) => (
            <Stack key={i} direction="row" spacing={2} alignItems="center">
              <TextField
                label="Name"
                placeholder="e.g. Deluxe Room"
                size="small"
                value={row.name}
                onChange={(e) => updateRow(i, { name: e.target.value })}
                sx={{ flex: 2 }}
              />
              <TextField
                label="Price override"
                placeholder="leave blank to use listing price"
                size="small"
                type="number"
                value={row.priceOverride}
                onChange={(e) => updateRow(i, { priceOverride: e.target.value })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Capacity"
                size="small"
                type="number"
                value={row.capacity}
                onChange={(e) => updateRow(i, { capacity: e.target.value })}
                sx={{ flex: 1 }}
              />
              <IconButton
                onClick={() => onListRowsChange(listRows.filter((_, idx) => idx !== i))}
                disabled={listRows.length === 1}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => onListRowsChange([...listRows, { ...emptyListRow }])}
            sx={{ alignSelf: "flex-start", textTransform: "none" }}
          >
            Add another unit
          </Button>
        </Stack>
      )}

      {mode === "grid" && (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Rows"
              size="small"
              type="number"
              value={gridConfig.rows}
              onChange={(e) => onGridConfigChange({ ...gridConfig, rows: e.target.value })}
            />
            <TextField
              label="Columns"
              size="small"
              type="number"
              value={gridConfig.columns}
              onChange={(e) => onGridConfigChange({ ...gridConfig, columns: e.target.value })}
            />
            <TextField
              label="Price per seat"
              placeholder="leave blank to use listing price"
              size="small"
              type="number"
              value={gridConfig.pricePerSeat}
              onChange={(e) => onGridConfigChange({ ...gridConfig, pricePerSeat: e.target.value })}
            />
          </Stack>
          {Number(gridConfig.rows) > 0 && Number(gridConfig.columns) > 0 && (
            <Alert severity="info" sx={{ maxWidth: 500 }}>
              This will generate {Number(gridConfig.rows) * Number(gridConfig.columns)} seats
              (e.g. A1 - {String.fromCharCode(64 + Number(gridConfig.rows))}
              {gridConfig.columns}).
            </Alert>
          )}
        </Stack>
      )}

      {mode === "timeslot" && (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Start time"
              size="small"
              type="time"
              value={timeSlotConfig.startTime}
              onChange={(e) => onTimeSlotConfigChange({ ...timeSlotConfig, startTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End time"
              size="small"
              type="time"
              value={timeSlotConfig.endTime}
              onChange={(e) => onTimeSlotConfigChange({ ...timeSlotConfig, endTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Slot duration (min)"
              size="small"
              type="number"
              value={timeSlotConfig.slotDurationMinutes}
              onChange={(e) =>
                onTimeSlotConfigChange({ ...timeSlotConfig, slotDurationMinutes: e.target.value })
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Capacity per slot"
              size="small"
              type="number"
              value={timeSlotConfig.capacityPerSlot}
              onChange={(e) =>
                onTimeSlotConfigChange({ ...timeSlotConfig, capacityPerSlot: e.target.value })
              }
            />
            <TextField
              label="Price per slot"
              placeholder="leave blank to use listing price"
              size="small"
              type="number"
              value={timeSlotConfig.price}
              onChange={(e) => onTimeSlotConfigChange({ ...timeSlotConfig, price: e.target.value })}
            />
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
