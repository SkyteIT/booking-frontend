import { Box, CircularProgress, Typography, keyframes } from "@mui/material";

type LoadingSpinnerProps = {
  fullScreen?: boolean;
  // Inline/section mode only - ignored when fullScreen.
  size?: number;
  py?: number | string;
  message?: string;
};

const orbitSpin = keyframes`
  to { transform: rotate(360deg); }
`;

const corePulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.85; }
`;

export default function LoadingSpinner({ fullScreen = true, size = 32, py = 6, message }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(160deg, #005a8d, #0077b6)",
          zIndex: (theme) => theme.zIndex.appBar + 100,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          {/* Same brand mark as the login page's hero corner, scaled up
              with thicker rings for a full-screen moment. */}
          <Box sx={{ position: "relative", width: 96, height: 96, display: "grid", placeItems: "center" }}>
            {/* Static outer ring */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "5px solid",
                borderColor: "rgba(255,255,255,0.55)",
                boxShadow: "0 0 30px rgba(0,180,216,0.5)",
              }}
            />
            {/* Rotating orbit arc */}
            <Box
              sx={{
                position: "absolute",
                inset: -14,
                borderRadius: "50%",
                border: "5px solid transparent",
                borderTopColor: "#00b4d8",
                borderRightColor: "#7fe7f7",
                animation: `${orbitSpin} 1.1s linear infinite`,
              }}
            />
            {/* Pulsing core */}
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #7fe7f7, #ffffff 70%)",
                boxShadow: "0 0 24px 6px rgba(0,180,216,0.6)",
                animation: `${corePulse} 1.6s ease-in-out infinite`,
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.3rem",
              letterSpacing: "0.16em",
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              background: "linear-gradient(160deg, #ffffff, #bdeaf5)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 2px 24px rgba(0,0,0,0.3)",
            }}
          >
            UBE
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: "2px",
                background: "#00b4d8",
                boxShadow: "0 0 10px 2px rgba(0,180,216,0.6)",
              }}
            />
          </Typography>
        </Box>
      </Box>
    );
  }

  // Section/inline placeholder - the shared "this block is loading" look,
  // used everywhere a list/panel/dialog swaps its content for a spinner
  // while data loads. Not for spinners that sit inside a button - those
  // stay local to the button (color: "inherit", size: 16-20, no wrapper).
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: message ? 1.5 : 0,
        py,
        width: "100%",
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography color="text.secondary" fontSize={14}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
