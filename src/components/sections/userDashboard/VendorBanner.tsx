import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { useAuth } from "../../../context/AuthContext";

const VendorBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isVendor =
    String(user?.role ?? "").toLowerCase() === "vendor";

  return (
    <Card
      sx={{
        mb: 3,
        width: "100%",
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
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
          {/* 🔹 LEFT TEXT */}
          <Box display="flex" alignItems="center" gap={2}>
            <BusinessCenterIcon />

            <Typography sx= {{ fontWeight: 600, fontSize: "1.25rem",color: "white" }}>
              {isVendor
                ? "Manage your listings and bookings in the vendor portal"
                : "Start selling your services by becoming a vendor"}
            </Typography>
          </Box>

          {/* 🔹 BUTTON */}
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
              color:  "#1976d2",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
                
              },
              borderRadius: "20px",
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