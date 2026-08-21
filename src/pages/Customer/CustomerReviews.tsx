import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Rating,
  Pagination,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import SnackbarAlert from "../../components/common/SnackbarAlert";
import {
  getMyReviews,
  updateReview,
  deleteReview,
  type CustomerReviewDto,
} from "../../services/reviewService";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import CustomerPageLayout from "./CustomerPageLayout";

const PAGE_SIZE = 10;

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<CustomerReviewDto[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number | null>(0);
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CustomerReviewDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyReviews({ pageNumber: page, pageSize: PAGE_SIZE });
      setReviews(res.items);
      setPageCount(res.totalPages || 1);
    } catch {
      setError("Failed to load your reviews.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (review: CustomerReviewDto) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };

  const saveEdit = async (review: CustomerReviewDto) => {
    if (!editRating || !editComment.trim()) return;
    setSaving(true);
    try {
      await updateReview(review.id, {
        bookingId: review.bookingId,
        rating: editRating,
        comment: editComment.trim(),
      });
      setSnackbar({ open: true, message: "Review updated", severity: "success" });
      cancelEdit();
      await load();
    } catch (err) {
      setSnackbar({
        open: true,
        message: getApiErrorMessage(err, "Failed to update review"),
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteReview(deleteTarget.id);
      setSnackbar({ open: true, message: "Review deleted", severity: "success" });
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setSnackbar({
        open: true,
        message: getApiErrorMessage(err, "Failed to delete review"),
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CustomerPageLayout title="My Reviews">
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
              Loading your reviews...
            </Typography>
          ) : reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              You haven't left any reviews yet.
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
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {review.listingTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reviewed on{" "}
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Stack>

                  {editingId === review.id ? (
                    <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                      <Rating
                        value={editRating}
                        onChange={(_, value) => setEditRating(value)}
                      />
                      <TextField
                        size="small"
                        multiline
                        minRows={2}
                        fullWidth
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          disabled={saving || !editRating || !editComment.trim()}
                          onClick={() => saveEdit(review)}
                        >
                          {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button size="small" onClick={cancelEdit} disabled={saving}>
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <>
                      <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.25 }} />
                      <Typography variant="body2" sx={{ mt: 1, color: "text.primary" }}>
                        {review.comment}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <Chip
                          label="Edit"
                          size="small"
                          variant="outlined"
                          sx={{ cursor: "pointer" }}
                          onClick={() => startEdit(review)}
                        />
                        <Chip
                          label="Delete"
                          size="small"
                          variant="outlined"
                          color="error"
                          sx={{ cursor: "pointer" }}
                          onClick={() => setDeleteTarget(review)}
                        />
                      </Stack>

                      {review.vendorReply && (
                        <Box
                          sx={{
                            mt: 1.5,
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: "action.hover",
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Vendor reply
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {review.vendorReply}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Stack>
          )}

          {!loading && !error && reviews.length > 0 && (
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
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete review?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete your review of "{deleteTarget?.listingTitle}". This can't be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </CustomerPageLayout>
  );
}
