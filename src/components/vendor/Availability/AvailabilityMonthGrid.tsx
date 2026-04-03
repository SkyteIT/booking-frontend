import { Box, ButtonBase, Typography } from "@mui/material";
import type { DateOnly, DateRange } from "./type";
import { getMonthMeta, isInRange, toDateOnly } from "./utils";

type Props = {
  monthDate: Date;

  selectedDates: DateOnly[];
  onToggleDate: (dateOnly: DateOnly) => void;

  bookedRanges: DateRange[];
  blockedRanges: DateRange[];
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AvailabilityMonthGrid({
  monthDate,
  selectedDates,
  onToggleDate,
  bookedRanges,
  blockedRanges,
}: Props) {
  const { year, month, firstDayOfWeek, daysInMonth } = getMonthMeta(monthDate);

  function getState(dateOnly: DateOnly) {
    const isBooked = bookedRanges.some((r) => isInRange(dateOnly, r));
    const isBlocked = blockedRanges.some((r) => isInRange(dateOnly, r));
    const isSelected = selectedDates.includes(dateOnly);

    if (isBooked) return "Booked";
    if (isSelected) return "Selected";
    if (isBlocked) return "Blocked";
    return "Available";
  }

  function getCellStyles(state: ReturnType<typeof getState>) {
    if (state === "Booked") {
      return { bg: "#9CA3AF", hover: "#9CA3AF", text: "#fff", disabled: true, ring: "none" };
    }
    if (state === "Blocked") {
      return { bg: "#DC2626", hover: "#B91C1C", text: "#fff", disabled: false, ring: "none" };
    }
    if (state === "Selected") {
      return { bg: "#1D4ED8", hover: "#1E40AF", text: "#fff", disabled: false, ring: "0 0 0 3px #0B2A6B" };
    }
    return { bg: "#0077b6", hover: "#005a8d", text: "#fff", disabled: false, ring: "none" };
  }

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box sx={{ minWidth: 720 }}>
        {/* Weekday labels */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, mb: 1 }}>
          {WEEKDAYS.map((d) => (
            <Box key={d} sx={{ textAlign: "center", py: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
                {d}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Days grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
          {/* Leading empty cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <Box key={`empty-${i}`} sx={{ height: 72 }} />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dateObj = new Date(year, month, day);
            const dateOnly = toDateOnly(dateObj);
            const state = getState(dateOnly);
            const styles = getCellStyles(state);

            return (
              <ButtonBase
                key={dateOnly}
                onClick={() => onToggleDate(dateOnly)}
                disabled={styles.disabled}
                sx={{
                  height: 72,
                  borderRadius: 2,
                  bgcolor: styles.bg,
                  color: styles.text,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .15s ease",
                  boxShadow: styles.ring !== "none" ? styles.ring : "none",
                  "&:hover": { bgcolor: styles.hover },
                  "&.Mui-disabled": { opacity: 1 },
                }}
              >
                {day}
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}