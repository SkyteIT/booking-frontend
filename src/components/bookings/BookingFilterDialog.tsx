import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Stack,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (sortBy: string) => void;
};

export default function BookingFilterDialog({
  open,
  onClose,
  onApply,
}: Props) {
  const [sortBy, setSortBy] = useState("Newest");

  const handleApply = () => {
    onApply(sortBy);
    onClose();
  };

  const handleClear = () => {
    setSortBy("Newest");
    onApply("Newest");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
          Filter bookings
        </Typography>
      </DialogTitle>

      {/* 🔹 Content */}
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
              <MenuItem value="StartDateAsc">Start date ↑</MenuItem>
              <MenuItem value="StartDateDesc">Start date ↓</MenuItem>
            </Select>
          </FormControl>
        </Stack>
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