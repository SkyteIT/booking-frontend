import { Box, ButtonBase, Typography, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import { getMonthMeta, toDateOnly } from "./utils";

// Accept any backend shape safely
type DayData = {
  date: string;
  status: any; 
  bookingCount?: number;
  bookedCount?: number;
  bookingTotal?: number;
  totalBookings?: number;
  bookingsCount?: number;
  availableCount?: number;
  isBlocked?: boolean;
};

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

export default function AvailabilityMonthGrid({
  monthDate,
  calendar,
  selectedDates,
  onToggleDate,
}: Props) {
  const { year, month, firstDayOfWeek, daysInMonth } = getMonthMeta(monthDate);

  // Final state used for UI
  function getState(dateOnly: string) {
    const found = calendar.find((d) => d.date.startsWith(dateOnly));
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

  // UI styles
  function getCellStyles(state: string) {
    if (state === "Booked") {
      return {
        bg: grey[600],
        hover: grey[700],
        text: "#fff",
        disabled: false,
        ring: "none",
      };
    }

    if (state === "Blocked") {
      return {
        bg: "error.main",
        hover: "error.dark",
        text: "error.contrastText",
        disabled: false,
        ring: "none",
      };
    }

    if (state === "BlockedSelected") {
      return {
        bg: "error.dark",
        hover: "error.dark",
        text: "error.contrastText",
        disabled: false,
        ring: `0 0 0 3px ${grey[200]}`,
      };
    }

    if (state === "Selected") {
      return {
        bg: "primary.dark",
        hover: "primary.main",
        text: "primary.contrastText",
        disabled: false,
        ring: `0 0 0 3px ${grey[300]}`,
      };
    }
    if (state === "Full") {
      return {
        bg: grey[700],
        hover: grey[700],
        text: "#fff",
        disabled: true,
        ring: "none",
      };
    }

    return {
      bg: "primary.main",
      hover: "primary.dark",
      text: "primary.contrastText",
      disabled: false,
      ring: "none",
    };
  }

  function getTooltip(dateOnly: string) {
    const found = calendar.find((d) => d.date.startsWith(dateOnly));
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

            const found = calendar.find((d) => d.date.startsWith(dateOnly));
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
                      bgcolor: styles.bg,
                      color: styles.text,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all .15s ease",
                      boxShadow:
                        styles.ring !== "none" ? styles.ring : "none",
                      "&:hover": {
                        bgcolor: styles.hover,
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