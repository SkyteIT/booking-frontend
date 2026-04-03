import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const VendorBanner = () => {
  return (
    <Card
      className="vendor-banner"
      sx={{
        mb: 3,
        width: "100%",
        background: "linear-gradient(90deg,#3aa0ff,#005f8f)",
        color: "white",
        borderRadius: "14px",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <BusinessCenterIcon />

            <Typography>
              Manage your listings and bookings in the vendor portal
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#1976d2",
              borderRadius: "20px",
              textTransform: "none",
              px: 3,
              whiteSpace: "nowrap",
            }}
          >
            Go to Vendor Portal
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VendorBanner;