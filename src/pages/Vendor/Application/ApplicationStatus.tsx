import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainFooter from "../../../components/footer/MainFooter";
import CustomerNavbar from "../../../components/navbars/CustomerNavbar";
import {
  getMyVendorApplicationStatus,
  type MyVendorApplicationStatusDto,
} from "../../../services/vendorRegistrationService";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "#FEF3C7", color: "#D97706" },
  Approved: { bg: "#D1FAE5", color: "#059669" },
  Rejected: { bg: "#FEE2E2", color: "#DC2626" },
};

const STATUS_MESSAGE: Record<string, string> = {
  Pending: "Your application is awaiting review. We'll let you know once a decision is made.",
  Approved: "Your application was approved — you now have vendor access.",
  Rejected: "Your application wasn't approved this time.",
};

export default function ApplicationStatus() {
  const [status, setStatus] = useState<MyVendorApplicationStatusDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyVendorApplicationStatus()
      .then(setStatus)
      .catch(() => setError("Couldn't load your application status."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <CustomerNavbar />
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : !status ? (
            <>
              <Typography variant="h5" fontWeight={700} mb={1}>
                No application on file
              </Typography>
              <Typography color="text.secondary" mb={3}>
                You haven't submitted a vendor application yet.
              </Typography>
              <Button component={Link} to="/vendor/businessinfo" variant="contained">
                Start application
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h5" fontWeight={700} mb={1}>
                {status.businessName}
              </Typography>
              <Chip
                label={status.status}
                sx={{
                  bgcolor: STATUS_STYLE[status.status]?.bg,
                  color: STATUS_STYLE[status.status]?.color,
                  fontWeight: 600,
                  mb: 2,
                }}
              />
              <Typography color="text.secondary" mb={1}>
                {STATUS_MESSAGE[status.status]}
              </Typography>
              <Typography variant="caption" color="text.disabled" display="block" mb={2}>
                Submitted {new Date(status.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </Typography>
              {status.status === "Rejected" && status.rejectionReason && (
                <Alert severity="error" sx={{ textAlign: "left", mb: 2 }}>
                  {status.rejectionReason}
                </Alert>
              )}
              {status.status === "Approved" && (
                <Button component={Link} to="/vendor/dashboard" variant="contained">
                  Go to vendor dashboard
                </Button>
              )}
              {status.status === "Rejected" && (
                <Button component={Link} to="/vendor/businessinfo" variant="outlined">
                  Apply again
                </Button>
              )}
            </>
          )}
        </Paper>
      </Container>
      <MainFooter />
    </Box>
  );
}
