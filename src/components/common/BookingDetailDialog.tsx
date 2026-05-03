import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Box,
  Skeleton,
  Button,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getBookingDetail, updateBookingStatus } from "../../services/Bookings/booking";
import SnackbarAlert from "./SnackbarAlert";
import type { VendorBookingDto } from "../bookings/BookingTypes";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

type VendorBookingDetailDto = VendorBookingDto & {
  customerEmail?: string;
  canConfirm?: boolean;
  canReject?: boolean;
};

type Props = {
  bookingId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export default function BookingDetailDialog({
  bookingId,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [data, setData] = useState<VendorBookingDetailDto>();
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
    });

  const handleDialogClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!bookingId || !open) return;
    const id = bookingId;

    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await getBookingDetail(id);
        setData(res);
      } catch (err) {
        setSnack({
          open: true,
          message: "Failed to fetch booking details.",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [bookingId, open]);
async function handleUpdate(status: string) {
  if (!data?.bookingId) return;

  try {
    setLoadingAction(true);
    await updateBookingStatus(data.bookingId, status);
    console.log("SENDING STATUS:", status);
    setSnack({
      open: true,
      message: `Booking ${status} successfully`,
      severity: "success",
    })
    onClose(); // Close dialog

    const updated = await getBookingDetail(data.bookingId); // Get updated details
    setData(updated); // Update local state with new details
    onUpdated?.(); // Refresh parent data
    
  } catch (err) {
    console.error("Update status error:", err);
    setSnack({
      open: true,
      message: "Action failed",
      severity: "error",
    });
    onClose();
  }
  finally {
    setLoadingAction(false);
  }
}

  return (
    <>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        keepMounted = {false}
        maxWidth="sm"
        fullWidth
        PaperProps={{
            sx: {
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            },
        }}
    >
        <DialogTitle
            sx={{
            fontWeight: 700,
            fontSize: "1.2rem",
            borderBottom: "1px solid #f3f4f6",
            }}
        >
            Booking Details
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
            {loading ? (
            <Stack spacing={2}>
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={50} />
              <Skeleton variant="rectangular" height={50} />
              <Skeleton variant="text" width="30%" />
            </Stack>
            ) : data ? (
            <Stack spacing={3}>
                
                {/* Header */}
                <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {data.bookingNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {data.listingTitle}
                </Typography>
                </Box>

                {/* Customer */}
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        CUSTOMER
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <PersonOutlineIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                        <Typography sx={{ fontWeight: 600 }}>
                        {data.customerName}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <EmailOutlinedIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                        <Typography variant="body2" color="text.secondary">
                        {data.customerEmail}
                        </Typography>
                    </Stack>
                </Box>

                {/* Date */}
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        DATE
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                        <Typography sx={{ fontWeight: 500 }}>
                        {new Date(data.startDateTime).toLocaleString()} -{" "}
                        {new Date(data.endDateTime).toLocaleString()}
                        </Typography>
                    </Stack>
                </Box>

                {/* Status + Amount */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="caption" color="text.secondary">
                    STATUS:    
                    </Typography>

                    <Box
                    sx={{
                        mt: 0.5,
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 2,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "inline-block",
                        bgcolor:
                        data.status === "Pending"
                            ? "#FEF3C7"
                            : data.status === "Confirmed"
                            ? "#DCFCE7"
                            : "#FEE2E2",
                        color:
                        data.status === "Pending"
                            ? "#92400E"
                            : data.status === "Confirmed"
                            ? "#166534"
                            : "#991B1B",
                    }}
                    >
                    {data.status}
                    </Box>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    <PaymentsOutlinedIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                    <Typography sx={{ fontWeight: 700 }}>
                        {data.currency} {data.totalAmount}
                    </Typography>
                    </Stack>
                </Stack>
            </Stack>
            ) : (
            <Typography>No data</Typography>
            )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="text"
            onClick={handleDialogClose}
            sx={{ textTransform: "none", mr: "auto" }}
          >
            Close
          </Button>
            {data?.canConfirm && (
            <Button
                variant="contained"
                disabled={loadingAction}
                onClick={() => handleUpdate("Confirmed")}
                sx={{
                bgcolor: "primary.main",
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                }}
            >
                {loadingAction ? "Processing..." : "Confirm"}
            </Button>
            )}

            {data?.canReject && (
            <Button
                variant="outlined"
                color="error"
                disabled={loadingAction}
                onClick={() => handleUpdate("Rejected")}
                sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                }}
            >
                {loadingAction ? "Processing..." : "Reject"}
            </Button>
            )}
        </DialogActions>
        </Dialog>
      <SnackbarAlert
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={() => setSnack({ ...snack, open: false })}
      />
    </>
  );
}