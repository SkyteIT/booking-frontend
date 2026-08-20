import { Box, ButtonBase, Typography, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import type { RawApiRecord } from "../../../utils/types";
import { getMonthMeta, toDateOnly } from "./utils";

// Calendar days come straight from the backend, whose exact shape isn't
// contractually fixed (see vendorAvailability.ts) — read every field
// defensively.
type DayData = RawApiRecord;

type Props = {
  monthDate: Date;
  calendar: DayData[];

  selectedDates: string[];
  onToggleDate: (date: string) => void;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getBookingCount(day: DayData | undefined) {
  return Number(
    day?.bookingCount ??
    day?.bookedCount ??
    day?.bookingTotal ??
    day?.totalBookings ??
    day?.bookingsCount ??
    0
  );
}

function isBlockedDay(day: DayData | undefined) {
  return Boolean(day?.isBlocked || day?.status === 3 || day?.status === "Blocked");
}

function dateOf(day: DayData) {
  return String(day.date ?? "");
}

export default function AvailabilityMonthGrid({
  monthDate,
  calendar,
  selectedDates,
  onToggleDate,
}: Props) {
  const { year, month, firstDayOfWeek, daysInMonth } = getMonthMeta(monthDate);

  // Final state used for UI
  function getState(dateOnly: string) {
    const found = calendar.find((d) => dateOf(d).startsWith(dateOnly));
    const isSelected = selectedDates.includes(dateOnly);
    const bookingCount = getBookingCount(found);

    if (!found) return isSelected ? "Selected" : "Available";

    // Status can be either a string or a number depending on backend implementation, so we check for both
    if (isBlockedDay(found)) {
      if (isSelected) return "BlockedSelected";
      return "Blocked";
    }
    if (bookingCount > 0) {
      return "Booked";
    }
    if (found.availableCount === 0) {
      return "Full";
    }

    if (isSelected) {
      return "Selected";
    }

    return "Available";
  }

  // UI styles - gradients instead of flat fills, matching the app-wide
  // soft-glass treatment rather than the old harsh solid-color blocks.
  function getCellStyles(state: string) {
    if (state === "Booked") {
      return {
        bg: `linear-gradient(160deg, ${grey[500]}, ${grey[700]})`,
        hover: `linear-gradient(160deg, ${grey[600]}, ${grey[800]})`,
        text: "#fff",
        disabled: false,
        ring: "none",
      };
    }

    if (state === "Blocked") {
      return {
        bg: "linear-gradient(160deg, #EF4444, #B91C1C)",
        hover: "linear-gradient(160deg, #DC2626, #991B1B)",
        text: "error.contrastText",
        disabled: false,
        ring: "none",
      };
    }

    if (state === "BlockedSelected") {
      return {
        bg: "linear-gradient(160deg, #DC2626, #991B1B)",
        hover: "linear-gradient(160deg, #DC2626, #991B1B)",
        text: "error.contrastText",
        disabled: false,
        ring: `0 0 0 3px ${grey[200]}`,
      };
    }

    if (state === "Selected") {
      return {
        bg: "linear-gradient(160deg, #005a8d, #003a5c)",
        hover: "linear-gradient(160deg, #005a8d, #0077b6)",
        text: "primary.contrastText",
        disabled: false,
        ring: `0 0 0 3px ${grey[300]}`,
      };
    }
    if (state === "Full") {
      return {
        bg: `linear-gradient(160deg, ${grey[600]}, ${grey[800]})`,
        hover: `linear-gradient(160deg, ${grey[600]}, ${grey[800]})`,
        text: "#fff",
        disabled: true,
        ring: "none",
      };
    }

    return {
      bg: "linear-gradient(160deg, #0077b6, #005a8d)",
      hover: "linear-gradient(160deg, #005a8d, #004a75)",
      text: "primary.contrastText",
      disabled: false,
      ring: "none",
    };
  }

  function getTooltip(dateOnly: string) {
    const found = calendar.find((d) => dateOf(d).startsWith(dateOnly));
    const bookingCount = getBookingCount(found);

    if (!found) return "Available";

    if (isBlockedDay(found)) return "Blocked";

    if (bookingCount > 0) {
      return `View ${bookingCount} bookings`;
    }

    if (found.availableCount === 0) {
      return `Fully booked (${bookingCount} bookings)`;
    }

    return "Available";
  }

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box sx={{ minWidth: 720 }}>

        {/*Weekdays*/}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            mb: 1,
          }}
        >
          {WEEKDAYS.map((d) => (
            <Box key={d} sx={{ textAlign: "center", py: 1 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 800, color: "text.secondary" }}
              >
                {d}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Days grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
          }}
        >
          {/* Empty cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <Box key={`empty-${i}`} sx={{ height: 72 }} />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;

            const dateObj = new Date(year, month, day);
            const dateOnly = toDateOnly(dateObj);

            const found = calendar.find((d) => dateOf(d).startsWith(dateOnly));
            const bookingCount = getBookingCount(found);
            const state = getState(dateOnly);
            const styles = getCellStyles(state);

            return (
              <Tooltip key={dateOnly} title={getTooltip(dateOnly)} arrow placement="top">
                <span>
                  <ButtonBase
                    onClick={() => onToggleDate(dateOnly)}
                    disabled={styles.disabled}
                    sx={{
                      height: 72,
                      width: "100%",
                      borderRadius: 2,
                      background: styles.bg,
                      color: styles.text,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all .15s ease",
                      boxShadow:
                        styles.ring !== "none" ? styles.ring : "none",
                      "&:hover": {
                        background: styles.hover,
                        transform: "scale(1.05)",
                      },
                      "&.Mui-disabled": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      sx={{ lineHeight: 1.1 }}
                    >
                      <span>{day}</span>

                      {bookingCount > 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.3,
                          }}
                        >
                          {bookingCount} booked
                        </Typography>
                      )}
                    </Box>
                  </ButtonBase>
                </span>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}