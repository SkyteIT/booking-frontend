import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Avatar,
  Rating,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import SegmentedTabs from "../../../components/common/SegmentedTabs";
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useAuth } from "../../../context/useAuth";
import {
  getVendorReviews,
  getVendorRating,
  replyToReview,
  type ReviewDto,
  type VendorRatingDto,
} from "../../../services/reviewService";
import VendorQuestionsTab from "./VendorQuestionsTab";

const PAGE_SIZE = 10;

export default function VendorReviews() {
  const { user } = useAuth();
  const vendorId = String(user?.userId ?? user?.id ?? "");
  const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");

  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [summary, setSummary] = useState<VendorRatingDto | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Reset and load page 1 whenever the vendor changes.
  useEffect(() => {
    if (!vendorId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getVendorRating(vendorId),
      getVendorReviews(vendorId, { pageNumber: 1, pageSize: PAGE_SIZE }),
    ])
      .then(([ratingRes, reviewsRes]) => {
        if (cancelled) return;
        setSummary(ratingRes);
        setReviews(reviewsRes.items);
        setPage(1);
        setPageCount(reviewsRes.totalPages || 1);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load reviews.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  const handleSeeMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getVendorReviews(vendorId, { pageNumber: nextPage, pageSize: PAGE_SIZE });
      setReviews((prev) => [...prev, ...res.items]);
      setPage(nextPage);
      setPageCount(res.totalPages || 1);
    } catch {
      setError("Failed to load more reviews.");
    } finally {
      setLoadingMore(false);
    }
  };

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
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
          }}
        >
          Reviews & Questions
          <Box component="span" sx={{ width: 8, height: 8, borderRadius: "3px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          See what customers are saying, reply to reviews, and answer their questions
        </Typography>
      </Box>

      <SegmentedTabs
        options={["reviews", "questions"] as const}
        value={activeTab}
        onChange={setActiveTab}
        labels={{ reviews: "Reviews", questions: "Questions" }}
      />

      {activeTab === "questions" ? (
        <VendorQuestionsTab />
      ) : (
        <>
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
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
          background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
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
            <LoadingSpinner fullScreen={false} py={3} />
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
                    borderRadius: "16px",
                    border: "1px solid rgba(15,27,45,0.06)",
                    background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
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
                      {review.listingTitle && (
                        <Chip
                          label={review.listingTitle}
                          size="small"
                          sx={{
                            mt: 0.5,
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            bgcolor: "rgba(0,119,182,0.1)",
                            color: "primary.main",
                          }}
                        />
                      )}
                      <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.5 }} />
                      <Typography variant="body2" sx={{ mt: 1, color: "text.primary" }}>
                        {review.comment}
                      </Typography>
                      {review.likeCount > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                          <FavoriteIcon fontSize="small" sx={{ color: "error.main" }} />
                          <Typography variant="caption" color="text.secondary">
                            {review.likeCount} like{review.likeCount === 1 ? "" : "s"}
                          </Typography>
                        </Stack>
                      )}

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

          {!loading && page < pageCount && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSeeMore}
                disabled={loadingMore}
                sx={{ textTransform: "none", borderRadius: "10px" }}
              >
                {loadingMore ? "Loading..." : "See more reviews"}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
        </>
      )}
    </Stack>
  );
}
