import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Avatar,
  Rating,
  Pagination,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ReplyIcon from "@mui/icons-material/Reply";
import { useAuth } from "../../../context/useAuth";
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import {
  getVendorReviews,
  getVendorRating,
  replyToReview,
  type ReviewDto,
  type VendorRatingDto,
} from "../../../services/reviewService";

const PAGE_SIZE = 10;

export default function VendorReviews() {
  const { user } = useAuth();
  const vendorId = String(user?.userId ?? user?.id ?? "");

  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [summary, setSummary] = useState<VendorRatingDto | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const load = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    setError(null);
    try {
      const [ratingRes, reviewsRes] = await Promise.all([
        getVendorRating(vendorId),
        getVendorReviews(vendorId, { pageNumber: page, pageSize: PAGE_SIZE }),
      ]);
      setSummary(ratingRes);
      setReviews(reviewsRes.items);
      setPageCount(reviewsRes.totalPages || 1);
    } catch {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [vendorId, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSendReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      await replyToReview(reviewId, replyText.trim());
      setSnackbar({ open: true, message: "Reply sent", severity: "success" });
      setReplyingTo(null);
      setReplyText("");
    } catch {
      setSnackbar({ open: true, message: "Failed to send reply", severity: "error" });
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Reviews
        </Typography>
        <Typography variant="body2" color="text.secondary">
          See what customers are saying and reply to their feedback
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          bgcolor: "background.paper",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, py: 2.5 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "primary.main" }}>
            {summary ? summary.averageRating.toFixed(1) : "—"}
          </Typography>
          <Box>
            <Rating value={summary?.averageRating ?? 0} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              Based on {summary?.totalCount ?? 0} review{summary?.totalCount === 1 ? "" : "s"}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          bgcolor: "background.paper",
        }}
      >
        <CardContent sx={{ pt: 2, pb: 2.5 }}>
          {error ? (
            <Box
              sx={(t) => ({
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(t.palette.error.main, 0.08),
                border: `1px solid ${alpha(t.palette.error.main, 0.2)}`,
              })}
            >
              <Typography variant="body2" sx={{ color: "error.main", fontWeight: 500 }}>
                {error}
              </Typography>
            </Box>
          ) : loading ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
              Loading reviews...
            </Typography>
          ) : reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No reviews yet
            </Typography>
          ) : (
            <Stack spacing={2}>
              {reviews.map((review) => (
                <Box
                  key={review.id}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {review.customerName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {review.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </Stack>
                      <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.25 }} />
                      <Typography variant="body2" sx={{ mt: 1, color: "text.primary" }}>
                        {review.comment}
                      </Typography>

                      {replyingTo === review.id ? (
                        <Stack spacing={1} sx={{ mt: 1.5 }}>
                          <TextField
                            size="small"
                            multiline
                            minRows={2}
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            fullWidth
                          />
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              disabled={sendingReply || !replyText.trim()}
                              onClick={() => handleSendReply(review.id)}
                            >
                              {sendingReply ? "Sending..." : "Send reply"}
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Chip
                          icon={<ReplyIcon fontSize="small" />}
                          label="Reply"
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1.5, cursor: "pointer" }}
                          onClick={() => {
                            setReplyingTo(review.id);
                            setReplyText("");
                          }}
                        />
                      )}
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={pageCount || 1}
              page={page}
              onChange={(_, value) => setPage(value)}
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": { color: "text.secondary" },
                "& .MuiPaginationItem-root.Mui-selected": {
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                  color: "primary.main",
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Stack>
  );
}
