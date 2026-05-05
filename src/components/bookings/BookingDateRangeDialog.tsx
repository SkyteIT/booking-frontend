import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import {
  DateRangePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { Dayjs } from "dayjs";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (start?: string, end?: string) => void;
};

export default function BookingDateRangeDialog({
  open,
  onClose,
  onApply,
}: Props) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const handleApply = () => {
    onApply(
      value[0]?.format("YYYY-MM-DD"),
      value[1]?.format("YYYY-MM-DD")
    );
    onClose();
  };

  const handleClear = () => {
    setValue([null, null]);
    onApply(undefined, undefined);
    onClose();
  };

  const isDisabled = !value[0] && !value[1];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,

          // 🔥 glass effect
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",

          border: "1px solid rgba(0,0,0,0.04)",
          boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ pb: 1.5 }}>
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 700,
          }}
        >
          Select date range
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary" }}
        >
          Filter bookings by date
        </Typography>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ pt: 1, px: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2}>
            <DateRangePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  },
                },
              }}
            />
          </Stack>
        </LocalizationProvider>

        {/* subtle divider */}
        <Box
          sx={{
            mt: 2,
            height: 1,
            bgcolor: "rgba(0,0,0,0.05)",
            borderRadius: 2,
          }}
        />
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 1,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClear}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            color: "text.secondary",
          }}
        >
          Clear
        </Button>

        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            color: "text.secondary",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleApply}
          disabled={isDisabled}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2.5,
            px: 2.5,

            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}