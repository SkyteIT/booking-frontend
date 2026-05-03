import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
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
          borderRadius: 3,
        },
      }}
    >
      {/* 🔹 Header */}
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Select date range
        </Typography>
      </DialogTitle>

      {/* 🔹 Content */}
      <DialogContent sx={{ pt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2}>
            <DateRangePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>

      {/* 🔹 Actions */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClear}
          sx={{
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Clear
        </Button>

        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleApply}
          disabled={isDisabled}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}