import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";

const VendorBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isVendor =
    String(user?.role ?? "").toLowerCase() === "vendor";

  return (
    <Card
      className="vendor-banner"
      sx={{
        mb: 3,
        width: "100%",
        background: "linear-gradient(160deg, #005a8d, #0077b6)",
        color: "white",
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

            <Typography sx={{ fontWeight: 600, fontSize: "1.25rem", color: "white" }}>
              {isVendor
                ? "Manage your listings and bookings in the vendor portal"
                : "Start selling your services by becoming a vendor"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() =>
              navigate(
                isVendor
                  ? "/vendor/dashboard"
                  : "/vendor/businessinfo"
              )
            }
            sx={{
              backgroundColor: "white",
              color: "#0077b6",
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
              borderRadius: "999px",
              textTransform: "none",
              px: 3,
              whiteSpace: "nowrap",
            }}
          >
            {isVendor ? "Go to Vendor Portal" : "Become Vendor"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VendorBanner;
