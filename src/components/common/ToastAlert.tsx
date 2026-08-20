import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, IconButton, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import { keyframes } from "@mui/material/styles";

function SlideLeftTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

type ToastSeverity = "success" | "error" | "warning" | "info";

type Props = {
  open: boolean;
  message: string;
  severity?: ToastSeverity;
  duration?: number;
  onClose: () => void;
};

const SEVERITY = {
  success: {
    gradient: "linear-gradient(160deg, #005a8d, #0077b6)",
    glow: "rgba(0,119,182,0.28)",
    surface: "linear-gradient(160deg, rgba(224,242,254,0.85), rgba(255,255,255,0.92))",
    border: "rgba(0,119,182,0.12)",
    icon: <CheckRoundedIcon />,
  },
  error: {
    gradient: "linear-gradient(160deg, #B91C1C, #DC2626)",
    glow: "rgba(220,38,38,0.28)",
    surface: "linear-gradient(160deg, rgba(254,226,226,0.85), rgba(255,255,255,0.92))",
    border: "rgba(220,38,38,0.16)",
    icon: <ErrorOutlineRoundedIcon />,
  },
  warning: {
    gradient: "linear-gradient(160deg, #B45309, #F59E0B)",
    glow: "rgba(245,158,11,0.28)",
    surface: "linear-gradient(160deg, rgba(254,243,199,0.85), rgba(255,255,255,0.92))",
    border: "rgba(245,158,11,0.18)",
    icon: <WarningAmberRoundedIcon />,
  },
  info: {
    gradient: "linear-gradient(160deg, #005a8d, #0077b6)",
    glow: "rgba(0,119,182,0.28)",
    surface: "linear-gradient(160deg, rgba(224,242,254,0.85), rgba(255,255,255,0.92))",
    border: "rgba(0,119,182,0.12)",
    icon: <InfoOutlinedIcon />,
  },
} as const;

const shrink = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

export default function ToastAlert({
  open,
  message,
  severity = "success",
  duration = 3500,
  onClose,
}: Props) {
  const { gradient, glow, surface, border, icon } = SEVERITY[severity];

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={SlideLeftTransition}
      sx={{
        top: { xs: "92px", sm: "104px" },
        zIndex: (t) => t.zIndex.appBar + 10,
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          minWidth: { xs: "calc(100vw - 64px)", sm: 280 },
          maxWidth: 320,
          borderRadius: "22px",
          border: "1px solid",
          borderColor: border,
          background: surface,
          backdropFilter: "blur(20px)",
          boxShadow: `0 12px 30px rgba(15,27,45,0.14), 0 0 0 1px ${glow}`,
          px: 1.5,
          py: 1.25,
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: 26,
            height: 26,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: gradient,
            color: "#fff",
            boxShadow: `0 6px 14px ${glow}`,
            "& svg": { fontSize: 15 },
          }}
        >
          {icon}
        </Box>

        <Box
          sx={{ flex: 1, pt: 0.1, fontWeight: 600, fontSize: "0.82rem", color: "#111827", lineHeight: 1.35 }}
        >
          {message}
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{ mt: -0.4, mr: -0.5, p: 0.4, color: "#9CA3AF", "&:hover": { color: "#111827" } }}
        >
          <CloseRoundedIcon sx={{ fontSize: 14 }} />
        </IconButton>

        <Box
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 2,
            width: "100%",
            background: gradient,
            opacity: 0.55,
            borderRadius: "0 0 0 22px",
            animation: `${shrink} ${duration}ms linear forwards`,
          }}
        />
      </Box>
    </Snackbar>
  );
}
