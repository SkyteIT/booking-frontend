import { Box, CircularProgress } from "@mui/material";

export default function LoadingSpinner({ fullScreen = true }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "grid",
          placeItems: "center",
          background: "rgba(255,255,255,0.7)",
          zIndex: (theme) => theme.zIndex.appBar + 100,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress size={20} />
    </Box>
  );
}
