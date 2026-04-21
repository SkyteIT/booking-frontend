import { Box, ButtonBase, Typography, Tooltip } from "@mui/material";
import { getMonthMeta, toDateOnly } from "./utils";

// Accept any backend shape safely
type DayData = {
  date: string;
  status: any; 
  bookingCount?: number;
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

    if (!found) return isSelected ? "Selected" : "Available";

    // Status can be either a string or a number depending on backend implementation, so we check for both
    if (found.isBlocked || found.status === 3 || found.status === "Blocked") {
      if (isSelected) return "BlockedSelected";
      return "Blocked";
    }
    if (found.availableCount === 0) {
      return "Unavailable";
    }
    if (found.bookingCount && found.bookingCount > 0) {
      return "Booked";
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
        bg: "#9CA3AF", // grey
        hover: "#9CA3AF",
        text: "#fff",
        disabled: false,
        ring: "none",
      };
    }

    if (state === "Blocked") {
      return {
        bg: "#DC2626", // red
        hover: "#B91C1C",
        text: "#fff",
        disabled: false,
        ring: "none",
      };
    }

    if (state === "BlockedSelected") {
      return {
        bg: "#B91C1C",
        hover: "#991B1B",
        text: "#fff",
        disabled: false,
        ring: "0 0 0 3px #FECACA",
      };
    }

    if (state === "Selected") {
      return {
        bg: "#066090", // dark blue
        hover: "#0077b6",
        text: "#fff",
        disabled: false,
        ring: "0 0 0 3px #93C5FD",
      };
    }
    if (state === "Full") {
      return {
        bg: "#374151", // dark gray (stronger than booked)
        hover: "#374151",
        text: "#fff",
        disabled: true,
        ring: "none",
      };
    }

    return {
      bg: "#0077b6", // available (blue)
      hover: "#005a8d",
      text: "#fff",
      disabled: false,
      ring: "none",
    };
  }

  function getTooltip(dateOnly: string) {
    const found = calendar.find((d) => d.date.startsWith(dateOnly));

    if (!found) return "Available";

    if (found.isBlocked) return "Blocked";

    if (found.bookingCount && found.bookingCount > 0) {
      return `View ${found.bookingCount} bookings`;
    }

    if (found.availableCount === 0) {
      return `Fully booked (${found.bookingCount} bookings)`;
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
            const bookingCount = found?.bookingCount ?? 0;
            const availableCount = found?.availableCount ?? 0;
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
                        <Typography variant="caption" sx={{ fontSize: 10 }}>
                          {availableCount === 0
                            ? "Full"
                            : `${availableCount} left`}
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