import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { Alert, Box, Button, CircularProgress, Container, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainFooter from "../../../components/footer/MainFooter";
import CustomerNavbar from "../../../components/navbars/CustomerNavbar";
import {
  getMyVendorApplicationStatus,
  type MyVendorApplicationStatusDto,
} from "../../../services/vendorRegistrationService";

const STATUS_STYLE: Record<string, { bg: string; color: string; icon: JSX.Element }> = {
  Pending: {
    bg: "rgba(245,158,11,0.12)",
    color: "#B45309",
    icon: <ScheduleRoundedIcon sx={{ fontSize: 15 }} />,
  },
  Approved: {
    bg: "rgba(16,185,129,0.12)",
    color: "#059669",
    icon: <CheckRoundedIcon sx={{ fontSize: 15 }} />,
  },
  Rejected: {
    bg: "rgba(220,38,38,0.1)",
    color: "#DC2626",
    icon: <CloseRoundedIcon sx={{ fontSize: 15 }} />,
  },
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
    <Box
      sx={{
        background: "linear-gradient(180deg, #F6F8FB 0%, #EFF6FC 45%, #F6F8FB 100%)",
        minHeight: "100vh",
      }}
    >
      <CustomerNavbar />
      <Container maxWidth="sm" sx={{ pt: { xs: 14, sm: 16 }, pb: 10 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            textAlign: "center",
            border: "1px solid rgba(15,27,45,0.06)",
            boxShadow: "0 12px 32px rgba(15,27,45,0.06)",
          }}
        >
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
              <Typography variant="h5" fontWeight={700} mb={2}>
                {status.businessName}
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.75,
                  py: 0.6,
                  borderRadius: "999px",
                  bgcolor: STATUS_STYLE[status.status]?.bg,
                  color: STATUS_STYLE[status.status]?.color,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  mb: 2.5,
                }}
              >
                {STATUS_STYLE[status.status]?.icon}
                {status.status}
              </Box>
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
