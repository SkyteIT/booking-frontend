import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  confirmText?: string;
  confirmColor?: "primary" | "error";
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  confirmColor = "primary",
}: Props) {
  const [loading, setLoading] = React.useState(false);

  const handleConfirmClick = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: (theme) => ({
          borderRadius: 4,

          // glass container
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",

          border: "1px solid",
          borderColor: "divider",

          boxShadow: `0 25px 60px ${alpha(theme.palette.common.black, 0.12)}`,
        }),
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          
          {/* Icon with soft background */}
          <Box
            sx={(theme) => ({
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",

              bgcolor: alpha(theme.palette.warning.main, 0.12),
              color: "warning.main",
            })}
          >
            <WarningAmberRoundedIcon fontSize="small" />
          </Box>

          <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ pt: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
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
          onClick={onCancel}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            color: "text.secondary",

            "&:hover": {
              color: "primary.main",
              bgcolor: "transparent",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirmClick}
          disabled={loading}
          sx={(theme) => ({
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2.5,
            px: 2.5,

            // glass container
            bgcolor:
              confirmColor === "error"
                ? theme.palette.error.main
                : theme.palette.primary.main,

            color: "#fff",

            "&:hover": {
              bgcolor:
                confirmColor === "error"
                  ? theme.palette.error.dark
                  : theme.palette.primary.dark,
            },
          })}
        >
          {loading && <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />}
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}