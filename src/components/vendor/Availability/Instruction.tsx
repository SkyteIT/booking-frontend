import { Box, Typography } from "@mui/material";

export default function Instruction() {
  return (
    <Box
      sx={{
        bgcolor: "#E0F2FE",
        border: "1px solid",
        borderColor:"#0077b6",
        borderRadius: 2,
        p: 2,
        mt: 2
      }}
    >
      <Typography variant="body2" color="#0077b6" sx={{ fontWeight: 500, mb: 1 }}>
       <ul>
        <li>
            <li>Click on available <Box component="span" sx={{ color: "primary.main" }} >(blue)</Box> dates to select them</li>
            <li>Click "Block" to prevent bookings on selected dates</li>
            <li> Click blocked <Box component="span" sx={{ color: "error.main" }} >(red)</Box>, then click "Unblock" to make them available</li>
            <li>Gray dates are already booked and cannot be modified</li>
           
        </li>
       </ul>
      </Typography>
    </Box>
  );
}
        
        