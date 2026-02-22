import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  monthDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;

  selectedCount: number;

  onBlock: () => void;
  onUnblock: () => void;
  onClear: () => void;
};

function formatMonthYear(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export default function AvailabilityToolbar({
  monthDate,
  onPrevMonth,
  onNextMonth,
  selectedCount,
  onBlock,
  onUnblock,
  onClear,
}: Props) {
  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", lg: "center" }}
      justifyContent="space-between"
    >
      {/* Month controls */}
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          onClick={onPrevMonth}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          sx={{
            px: 2,
            py: 1,
            minWidth: 180,
            textAlign: "center",
            fontWeight: 800,
            borderRadius: 2,
          }}
        >
          <Typography sx={{ fontWeight: 800 }}>
            {formatMonthYear(monthDate)}
          </Typography>
        </Box>

        <IconButton
          onClick={onNextMonth}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      {/* Actions */}
      {selectedCount > 0 ? (
        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
          <Button
            variant="contained"
            onClick={onBlock}
            sx={{
              bgcolor: "#DC2626",
              "&:hover": { bgcolor: "#B91C1C" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
            }}
          >
            Block {selectedCount} Date{selectedCount > 1 ? "s" : ""}
          </Button>

          <Button
            variant="contained"
            onClick={onUnblock}
            sx={{
              bgcolor: "#16A34A",
              "&:hover": { bgcolor: "#15803D" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
            }}
          >
            Unblock {selectedCount} Date{selectedCount > 1 ? "s" : ""}
          </Button>

          <Button
            variant="outlined"
            onClick={onClear}
            startIcon={<ClearIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
            }}
          >
            Clear
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}