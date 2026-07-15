import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { Box, Typography, Button, Stack } from "@mui/material";

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
          sx={{ minWidth: 32, color: "text.secondary" }}
        >
          <ChevronLeftRoundedIcon fontSize="small" />
        </Button>

        <Typography fontWeight={600}>{monthLabel}</Typography>

        <Button
          onClick={onNextMonth}
          sx={{ minWidth: 32, color: "text.secondary" }}
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
                color: "text.secondary",
            }}
          >
            {selectedCount} selected
          </Typography>
        )}

        <Button
          onClick={onClear}
          sx={{
            textTransform: "none",
            color: "text.secondary",
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
            backgroundColor: "error.main",
            color: "error.contrastText",
            "&:hover": {
              backgroundColor: "error.dark",
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
            border: "1px solid",
            borderColor: "divider",
            color: "primary.main",
          }}
        >
          Unblock
        </Button>

      </Stack>
    </Box>
  );
}