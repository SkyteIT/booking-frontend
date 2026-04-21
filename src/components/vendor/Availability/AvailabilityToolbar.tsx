import { Box, Typography, Button, Stack } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";

type Props = {
  monthDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedCount: number;
  onBlock: () => void;
  onUnblock: () => void;
  onClear: () => void;
};

export default function AvailabilityToolbar({
  monthDate,
  onPrevMonth,
  onNextMonth,
  selectedCount,
  onBlock,
  onUnblock,
  onClear,
}: Props) {
  const monthLabel = monthDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1,
      }}
    >
      {/* LEFT: Month navigation */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          onClick={onPrevMonth}
          sx={{ minWidth: 32, color: "#6B7280" }}
        >
          <ChevronLeftRoundedIcon fontSize="small" />
        </Button>

        <Typography fontWeight={600}>{monthLabel}</Typography>

        <Button
          onClick={onNextMonth}
          sx={{ minWidth: 32, color: "#6B7280" }}
        >
          <ChevronLeftRoundedIcon fontSize="small" sx={{ transform: "rotate(180deg)" }} />
        </Button>
      </Stack>

      {/* RIGHT: Actions */}
      <Stack direction="row" spacing={1} alignItems="center">
        
        {selectedCount > 0 && (
          <Typography
            sx={{
              fontSize: 13,
              color: "#6B7280",
            }}
          >
            {selectedCount} selected
          </Typography>
        )}

        <Button
          onClick={onClear}
          sx={{
            textTransform: "none",
            color: "#6B7280",
          }}
        >
          Clear
        </Button>

        <Button
          onClick={onBlock}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            backgroundColor: "#DC2626",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#ac1919",
            },
          }}
        >
          Block
        </Button>

        <Button
          onClick={onUnblock}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            border: "1px solid #E5E7EB",
            color:"#0077b6",
          }}
        >
          Unblock
        </Button>

      </Stack>
    </Box>
  );
}