import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function VendorTopBar() {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left: Logo/Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
            }}
          >
            U
          </Box>
          <Typography fontWeight={700}>UBE</Typography>
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: "pointer" }}>
            Sign up
          </Typography>

          <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
            List your item
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
