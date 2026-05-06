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
  Box,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { OutlinedInput } from "@mui/material";

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
          borderRadius: 4,

          // glass style
          bgcolor: "rgba(255,255,255,0.85)",
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
            fontSize: "1.05rem",
            fontWeight: 700,
          }}
        >
          Filter bookings
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Customize how bookings are sorted
        </Typography>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={4}>
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              input={<OutlinedInput label="Sort by" />}
              sx={{
                borderRadius: 2.5,
                "& .MuiSelect-select": {
                  py: 1.4,
                  fontWeight: 500,
                },
              }}
            >
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
              <MenuItem value="StartDateAsc">Start date ↑</MenuItem>
              <MenuItem value="StartDateDesc">Start date ↓</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* subtle divider */}
        <Box
          sx={{
            mt: 3,
            height: 2,
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