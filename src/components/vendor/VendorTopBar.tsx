import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { alpha } from "@mui/material/styles";

export default function VendorTopBar() {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(8px)", // 🔥 subtle premium feel
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
        {/* 🔹 Left: Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={(t) => ({
              width: 30,
              height: 30,
              borderRadius: 1.5,
              bgcolor: alpha(t.palette.primary.main, 0.1),
              color: "primary.main",
              display: "grid",
              placeItems: "center",
              fontWeight: 600,
              fontSize: "0.9rem",
            })}
          >
            U
          </Box>

          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
            UBE
          </Typography>
        </Box>

        {/* 🔹 Right: Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              cursor: "pointer",
              fontWeight: 500,
              "&:hover": {
                color: "text.primary",
              },
            }}
          >
            Sign up
          </Typography>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              px: 1.5,
            }}
          >
            List item
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}