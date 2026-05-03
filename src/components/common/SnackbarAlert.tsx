import { Box, Snackbar, Alert } from "@mui/material";
import Slide from "@mui/material/Slide";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

function SlideTransition(props: any) {
  return <Slide {...props} direction="left" />;
}

type Props = {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

export default function SnackbarAlert({
  open,
  message,
  severity = "info",
  onClose,
}: Props) {
  const palette = {
    success: {
      background: "linear-gradient(135deg,rgba(14, 165, 233, 0.98), rgba(2, 132, 199, 0.98))",
      border: "rgba(186, 230, 253, 0.35)",
    },
    error: {
      background: "linear-gradient(135deg, rgba(239, 68, 68, 0.98), rgba(185, 28, 28, 0.98))",
      border: "rgba(254, 202, 202, 0.35)",
    },
    warning: {
      background: "linear-gradient(135deg, rgba(245, 158, 11, 0.98), rgba(217, 119, 6, 0.98))",
      border: "rgba(254, 240, 138, 0.35)",
    },
    info: {
      background: "linear-gradient(135deg, rgba(14, 165, 233, 0.98), rgba(2, 132, 199, 0.98))",
      border: "rgba(186, 230, 253, 0.35)",
    },
  }[severity];

  const startIcon =
    severity === "success" ? (
      <CheckCircleOutlineIcon fontSize="small" />
    ) : severity === "error" ? (
      <ErrorOutlineIcon fontSize="small" />
    ) : severity === "warning" ? (
      <WarningAmberOutlinedIcon fontSize="small" />
    ) : (
      <InfoOutlinedIcon fontSize="small" />
    );

  return (
    <Snackbar
      open={open}
      autoHideDuration={1500}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 1.25 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        icon={false}
        sx={{
          minWidth: { xs: "calc(100vw - 32px)", sm: 420 },
          borderRadius: 3,
          px: 1.5,
          py: 1.1,
          alignItems: "center",
          border: "1px solid",
          borderColor: palette.border,
          background: palette.background,
          color: "#fff",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.22)",
          backdropFilter: "blur(12px)",
          "& .MuiAlert-message": {
            width: "100%",
            padding: 0,
          },
          "& .MuiAlert-action": {
            alignItems: "center",
            paddingTop: 0,
            marginRight: -0.5,
          },
        }}
      >
        <Box
          component="span"
          sx={{ display: "inline-flex", alignItems: "center", gap: 1.1 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              flexShrink: 0,
            }}
          >
            {startIcon}
          </Box>
          <Box component="span" sx={{ fontWeight: 600, letterSpacing: 0.1 }}>
            {message}
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
}