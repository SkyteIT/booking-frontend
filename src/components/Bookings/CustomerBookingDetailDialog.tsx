import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
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
  Rating,
  TextField,
  Divider,
  Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  getMyBookingDetail,
  cancelMyBooking,
  type BookingDetailDto,
} from "../../services/Customer/bookingService";
import { createReview } from "../../services/reviewService";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import SnackbarAlert from "../common/SnackbarAlert";

type Props = {
  bookingId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export default function CustomerBookingDetailDialog({ bookingId, open, onClose, onUpdated }: Props) {
  const [data, setData] = useState<BookingDetailDto>();
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!bookingId || !open) return;
    const id = bookingId;

    // Reset the review form state for whichever booking is now open -
    // otherwise a previous booking's in-progress form would leak through.
    setShowReviewForm(false);
    setReviewRating(0);
    setReviewComment("");
    setReviewSubmitted(false);

    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await getMyBookingDetail(id);
        setData(res);
      } catch {
        setSnack({ open: true, message: "Failed to fetch booking details.", severity: "error" });
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [bookingId, open]);

  const handleCancel = async () => {
    if (!data?.bookingId) return;
    try {
      setCancelling(true);
      await cancelMyBooking(data.bookingId);
      setSnack({ open: true, message: "Booking cancelled", severity: "success" });
      onClose();
      onUpdated?.();
    } catch {
      setSnack({ open: true, message: "Failed to cancel booking.", severity: "error" });
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!data?.bookingId || !reviewRating || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await createReview({
        bookingId: data.bookingId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewSubmitted(true);
      setShowReviewForm(false);
      onUpdated?.();
    } catch (err) {
      setSnack({
        open: true,
        message: getApiErrorMessage(err, "Failed to submit review."),
        severity: "error",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        keepMounted={false}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.2rem", borderBottom: "1px solid #f3f4f6", color: "primary.main" }}>
          Booking Details
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {loading ? (
            <Stack spacing={2}>
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={50} />
              <Skeleton variant="text" width="30%" />
            </Stack>
          ) : data ? (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {data.bookingNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.listingTitle}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  DATE
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                  <Typography sx={{ fontWeight: 500 }}>
                    {new Date(data.startDateTime).toLocaleString()} - {new Date(data.endDateTime).toLocaleString()}
                  </Typography>
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    STATUS:
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.5,
                      px: 2,
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
                          : data.status === "Cancelled" || data.status === "Rejected"
                          ? "#FEE2E2"
                          : "#E5E7EB",
                      color:
                        data.status === "Pending"
                          ? "#92400E"
                          : data.status === "Confirmed"
                          ? "#166534"
                          : data.status === "Cancelled" || data.status === "Rejected"
                          ? "#991B1B"
                          : "#374151",
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

              {data.status === "Completed" && (
                <>
                  <Divider />
                  {reviewSubmitted ? (
                    <Typography variant="body2" sx={{ color: "success.main", fontWeight: 500 }}>
                      Thanks for your review!
                    </Typography>
                  ) : data.canReview ? (
                    showReviewForm ? (
                      <Stack spacing={1.5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Leave a review
                        </Typography>
                        <Rating value={reviewRating} onChange={(_, value) => setReviewRating(value)} />
                        <TextField
                          size="small"
                          multiline
                          minRows={2}
                          fullWidth
                          placeholder="Share your experience..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                        />
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={submittingReview || !reviewRating || !reviewComment.trim()}
                            onClick={handleSubmitReview}
                          >
                            {submittingReview ? "Submitting..." : "Submit review"}
                          </Button>
                          <Button size="small" onClick={() => setShowReviewForm(false)} disabled={submittingReview}>
                            Cancel
                          </Button>
                        </Stack>
                      </Stack>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setShowReviewForm(true)}
                        sx={{ borderRadius: 2, textTransform: "none", alignSelf: "flex-start" }}
                      >
                        Leave a review
                      </Button>
                    )
                  ) : (
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Your review
                        </Typography>
                        {data.reviewRating != null && (
                          <Rating value={data.reviewRating} readOnly size="small" />
                        )}
                      </Stack>
                      {data.reviewComment && (
                        <Typography variant="body2">{data.reviewComment}</Typography>
                      )}
                      {data.reviewVendorReply && (
                        <Box
                          sx={{
                            mt: 0.5,
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: "action.hover",
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Vendor reply
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {data.reviewVendorReply}
                          </Typography>
                        </Box>
                      )}
                      <Link
                        component={RouterLink}
                        to="/customer/reviews"
                        sx={{ fontWeight: 500, fontSize: "0.875rem", alignSelf: "flex-start" }}
                      >
                        Edit your review
                      </Link>
                    </Stack>
                  )}
                </>
              )}
            </Stack>
          ) : (
            <Typography>No data</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="text" onClick={onClose} sx={{ textTransform: "none", mr: "auto" }}>
            Close
          </Button>
          {data?.canCancel && (
            <Button
              variant="outlined"
              color="error"
              disabled={cancelling}
              onClick={handleCancel}
              sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
            >
              {cancelling ? "Cancelling..." : "Cancel Booking"}
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
