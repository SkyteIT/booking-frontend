import { Box, Typography } from "@mui/material";

export default function Instruction() {
  return (
    <Box
      sx={{
        bgcolor: "#E0F2FE",
        border: "1px solid",
        borderColor: "#0077b6",
        borderRadius: 2,
        p: 2,
        mt: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, mb: 1, color: "#0077b6" }}
      >
        Instructions
      </Typography>

      <Box component="ul" sx={{ pl: 2, m: 0 }}>
        <li>
          Click on available{" "}
          <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
            (blue)
          </Box>{" "}
          dates to select them
        </li>

        <li>
          Click <b>Block</b> to prevent bookings on selected dates
        </li>

        <li>
          Click blocked{" "}
          <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
            (red)
          </Box>{" "}
          dates, then click <b>Unblock</b> to make them available
        </li>

        <li>
          Gray dates are already booked and cannot be modified
        </li>
      </Box>
    </Box>
  );
}